import type { TAuthenticatorOptions } from "./types/authenticator";
import type { ITOTPOptions } from "@otp-lib/core";

import { AuthenticatorType } from "./enum/type";

import Authenticator from "./authenticator";

import { Typeguard } from "@otp-lib/core/utils";
import { TOTP } from "@otp-lib/core";

/**
 * Class TOTPAuthenticator
 * used to implements the Time-Based One-Time Password Authenticator
 *
 * @class TOTPAuthenticator
 * @extends {Authenticator<TOTP, ITOTPOptions>}
 */
class TOTPAuthenticator extends Authenticator<TOTP, ITOTPOptions> {
    /**
     * Constructor of TOTPAuthenticator class
     * 
     * @param {TAuthenticatorOptions<ITOTPOptions>} options The options of TOTP
     * @memberof TOTPAuthenticator
     */
    constructor(options: TAuthenticatorOptions<ITOTPOptions>) {
        super(new TOTP(options), options);
    }

    /**
     * Get the past, future period window of TOTP authenticator
     *
     * @return {number}
     * @memberof TOTPAuthenticator
     */
    public getWindow(): [number, number] {
        return this.otp.getWindow();
    }

    /**
     * Get the period in seconds of TOTP authenticator
     *
     * @return {number}
     * @memberof TOTPAuthenticator
     */
    public getPeriod(): number {
        return this.otp.getPeriod();
    }

    /**
     * Get the counter of TOTP authenticator
     *
     * @return {number}
     * @memberof TOTPAuthenticator
     */
    public getCounter(): number {
        return this.otp.getCounter();
    }

    /**
     * Get the number of seconds used in the current time step
     *
     * @return {number}
     * @memberof TOTPAuthenticator
     */
    public getTimeUsed(): number {
        return this.otp.getTimeUsed();
    }

    /**
     * Get the remaining time in seconds until the next time step
     *
     * @return {number}
     * @memberof TOTPAuthenticator
     */
    public getTimeRemaining(): number {
        return this.otp.getTimeRemaining();
    }

    /**
     * Generate the TOTP code from current counter time step
     *
     * @return {Promise<string>}
     * @memberof TOTPAuthenticator
     */
    public generate(): Promise<string> {
        return this.otp.generate();
    }

    /**
     * Verify the TOTP code delta for the current counter value
     *
     * @param {string} code The TOTP code to verify
     * @return {Promise<number | null>}
     * @memberof TOTPAuthenticator
     */
    public verifyDelta(code: string): Promise<number | null> {
        return this.otp.verifyDelta(code);
    }

    /**
     * Verify if the TOTP code is valid for the current counter value
     *
     * @param {string} code The TOTP code to verify
     * @return {Promise<boolean>}
     * @memberof TOTPAuthenticator
     */
    public async verify(code: string): Promise<boolean> {
        return this.otp.verify(code);
    }

    /**
     * Get the TOTP authenticator from URI
     *
     * @static
     * @param {string} uri The TOTP URI to parse 
     * @return {TOTPAuthenticator}
     * @memberof TOTPAuthenticator
     */
    public static fromURI(uri: string): TOTPAuthenticator {
        const url = new URL(uri);

        if(url.host !== AuthenticatorType.TOTP) {
            throw(new Error("The authenticator URI type is invalid"));
        }

        const options: TAuthenticatorOptions<ITOTPOptions> = super.fromURL(url);

        const period = url.searchParams.get("period");
        if(period !== null) {
            const value = parseInt(period, 10);
            if(!Typeguard.isPositiveInteger(value)) {
                throw(new Error("The authenticator URI period is invalid"));
            }
            
            options.period = value;
        }

        return new this(options);
    }

    /**
     * Get the URI of TOTP
     *
     * @return {string}
     * @memberof TOTPAuthenticator
     */
    public toURI(): string {
        const url = super.toURL();

        url.host = AuthenticatorType.TOTP;

        const period = this.getPeriod();
        url.searchParams.set("period", period.toString());

        return url.toString();
    }
}

export default TOTPAuthenticator;