import type { IHOTPOptions } from "./types/hotp";

import TypeGuard from "./utils/typeguard";

import OTP from "./otp";

/**
 * Class HOTP
 * used to implements the HMAC-Based One-Time Password
 *
 * @class HOTP
 * @extends {OTP}
 * @see https://datatracker.ietf.org/doc/html/rfc4226
 */
class HOTP extends OTP {
    /**
     * The look-ahead window of HOTP
     *
     * @private
     * @type {number}
     * @memberof HOTP
     */
    private lookAhead: number;

    /**
     * The counter value of HOTP
     *
     * @private
     * @type {number}
     * @memberof HOTP
     */
    private counter: number;

    /**
     * Constructor of HOTP class
     * 
     * @param {IHOTPOptions} [options={}] The options of HOTP
     * @memberof HOTP
     */
    constructor(options: IHOTPOptions = {}) {
        super(options);

        const lookAhead = options.lookAhead ?? 0;
        if(!TypeGuard.isNonNegativeInteger(lookAhead)) {
            throw(new Error("The options.lookAhead must be non-negative integer"));
        }
        
        const counter = options.counter ?? 0;
        if(!TypeGuard.isNonNegativeInteger(counter)) {
            throw(new Error("The options.counter must be non-negative integer"));
        }

        this.lookAhead = lookAhead;
        this.counter = counter;
    }

    /**
     * Set the counter value of HOTP
     *
     * @param {number} counter The counter value of HOTP
     * @memberof HOTP
     */
    public setCounter(counter: number): void {
        this.counter = Math.abs(counter);
    }

    /**
     * Get the look-ahead window of HOTP
     *
     * @return {number}
     * @memberof HOTP
     */
    public getLookAhead(): number {
        return this.lookAhead;
    }

    /**
     * Get the counter value of HOTP
     *
     * @return {number}
     * @memberof HOTP
     */
    public getCounter(): number {
        return this.counter;
    }

    /**
     * Generate the HOTP code from current counter value
     *
     * @return {Promise<string>}
     * @memberof HOTP
     */
    public generate(): Promise<string> {
        return super.code(this.counter);
    }

    /**
     * Verify the HOTP code delta for the current counter value
     *
     * @param {string} code The HOTP code to verify
     * @return {Promise<number | null>}
     * @memberof HOTP
     */
    public verifyDelta(code: string): Promise<number | null> {
        const counters = new Map<number, number>();
        
        for(let i = 0; i <= this.lookAhead; i++) {
            counters.set(i, this.counter + i);
        }

        return super.verifyDelta(code, counters);
    }

    /**
     * Verify if the HOTP code is valid for the current counter value
     *
     * @param {string} code The HOTP code to verify
     * @return {Promise<boolean>}
     * @memberof HOTP
     */
    public async verify(code: string): Promise<boolean> {
        return await this.verifyDelta(code) !== null;
    }
}

export default HOTP;