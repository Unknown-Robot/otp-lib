import type { ITOTPOptions } from "./types/totp";

import TypeGuard from "./utils/typeguard";

import OTP from "./otp";

/**
 * Class TOTP
 * used to implements the Time-Based One-Time Password
 *
 * @class TOTP
 * @extends {OTP}
 * @see https://datatracker.ietf.org/doc/html/rfc6238
 */
class TOTP extends OTP {
    /**
     * The future, past period window of TOTP
     *
     * @private
     * @type {[number, number]}
     * @memberof TOTP
     */
    private window: [number, number];

    /**
     * The period in seconds of TOTP
     *
     * @private
     * @type {number}
     * @memberof TOTP
     */
    private period: number;

    /**
     * Constructor of TOTP class
     * 
     * @param {ITOTPOptions} [options={}] The options of TOTP
     * @memberof TOTP
     */
    constructor(options: ITOTPOptions = {}) {
        const { window = [0, 0], period = 30 } = options;

        if((!TypeGuard.isArrayOf(window, TypeGuard.isNonNegativeInteger) || window.length !== 2)
        && !TypeGuard.isNonNegativeInteger(window)) {
            throw(new Error("The options.window must be a non-negative integer or an array of two non-negative integers"));
        }
        else if(!TypeGuard.isPositiveInteger(period)) {
            throw(new Error("The options.period must be a positive integer"));
        }

        super(options);
        this.window = (!TypeGuard.isArray(window))? [window, window] : window;
        this.period = period;
    }

    /**
     * Get the current Unix timestamp
     *
     * @private
     * @return {number}
     * @memberof TOTP
     */
    private getTimestamp(): number {
        return Math.floor(Date.now() / 1000);
    }

    /**
     * Get the past, future period window of TOTP
     *
     * @return {number}
     * @memberof TOTP
     */
    public getWindow(): [number, number] {
        return this.window;
    }

    /**
     * Get the period in seconds of TOTP
     *
     * @return {number}
     * @memberof TOTP
     */
    public getPeriod(): number {
        return this.period;
    }

    /**
     * Get the counter of TOTP
     *
     * @return {number}
     * @memberof TOTP
     */
    public getCounter(): number {
        return Math.floor(this.getTimestamp() / this.period);
    }

    /**
     * Get the number of seconds used in the current time step
     *
     * @return {number}
     * @memberof TOTP
     */
    public getTimeUsed(): number {
        return this.getTimestamp() % this.period;
    }

    /**
     * Get the remaining time in seconds until the next time step
     *
     * @return {number}
     * @memberof TOTP
     */
    public getTimeRemaining(): number {
        return this.period - this.getTimeUsed();
    }

    /**
     * Generate the TOTP code from current counter time step
     *
     * @return {Promise<string>}
     * @memberof TOTP
     */
    public async generate(): Promise<string> {
        return super.code(this.getCounter());
    }

    /**
     * Verify the TOTP code delta for the current counter value
     *
     * @param {string} code The TOTP code to verify
     * @return {Promise<number | null>}
     * @memberof TOTP
     */
    public verifyDelta(code: string): Promise<number | null> {
        const [past, future] = this.getWindow();
        const counter = this.getCounter();
        const counters = new Map([
            [0, counter]
        ]);

        for(let i = 1; i <= Math.max(past, future); i++) {
            if(i <= past) {
                counters.set(-i, counter - i);
            }
            
            if(i <= future) {
                counters.set(i, counter + i);
            }
        }

        return super.verifyDelta(code, counters);
    }

    /**
     * Verify if the TOTP code is valid for the current counter value
     *
     * @param {string} code The TOTP code to verify
     * @return {Promise<boolean>}
     * @memberof TOTP
     */
    public async verify(code: string): Promise<boolean> {
        return await this.verifyDelta(code) !== null;
    }
}

export default TOTP;