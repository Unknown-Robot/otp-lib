import type { TAuthenticatorOptions } from "./types/authenticator";
import type { IHOTPOptions } from "@otp-lib/core";

import { AuthenticatorType } from "./enum/type";

import Authenticator from "./authenticator";

import { TypeGuard } from "@otp-lib/core/utils";
import { HOTP } from "@otp-lib/core";

/**
 * Class HOTPAuthenticator
 * used to implements the HMAC-Based One-Time Password Authenticator
 *
 * @class HOTPAuthenticator
 * @extends {Authenticator<HOTP, IHOTPOptions>}
 */
class HOTPAuthenticator extends Authenticator<HOTP, IHOTPOptions> {
    /**
     * Constructor of HOTPAuthenticator class
     * 
     * @param {TAuthenticatorOptions<IHOTPOptions>} options The options of HOTP
     * @memberof HOTPAuthenticator
     */
    constructor(options: TAuthenticatorOptions<IHOTPOptions>) {
        super(new HOTP(options), options);
    }

    /**
     * Set the counter value of HOTP authenticator
     *
     * @param {number} counter The counter value of HOTP authenticator
     * @memberof HOTPAuthenticator
     */
    public setCounter(counter: number): void {
        return this.otp.setCounter(counter);
    }

    /**
     * Get the look-ahead window of HOTP authenticator
     *
     * @return {number}
     * @memberof HOTPAuthenticator
     */
    public getLookAhead(): number {
        return this.otp.getLookAhead();
    }

    /**
     * Get the counter value of HOTP authenticator
     *
     * @return {number}
     * @memberof HOTPAuthenticator
     */
    public getCounter(): number {
        return this.otp.getCounter();
    }

    /**
     * Generate the HOTP code from current counter value
     *
     * @return {Promise<string>}
     * @memberof HOTPAuthenticator
     */
    public generate(): Promise<string> {
        return this.otp.generate();
    }

    /**
     * Verify the HOTP code delta for the current counter value
     *
     * @param {string} code The HOTP code to verify
     * @return {Promise<number | null>}
     * @memberof HOTPAuthenticator
     */
    public verifyDelta(code: string): Promise<number | null> {
        return this.otp.verifyDelta(code);
    }

    /**
     * Verify if the HOTP code is valid for the current counter value
     *
     * @param {string} code The HOTP code to verify
     * @return {Promise<boolean>}
     * @memberof HOTPAuthenticator
     */
    public async verify(code: string): Promise<boolean> {
        return this.otp.verify(code);
    }

    /**
     * Get the HOTP authenticator from URI
     *
     * @static
     * @param {string} uri The HOTP URI to parse 
     * @return {HOTPAuthenticator}
     * @memberof HOTPAuthenticator
     */
    public static fromURI(uri: string): HOTPAuthenticator {
        const url = new URL(uri);

        if(url.host !== AuthenticatorType.HOTP) {
            throw(new Error("The authenticator URI type is invalid"));
        }

        const options: TAuthenticatorOptions<IHOTPOptions> = super.fromURL(url);

        const counter = url.searchParams.get("counter");
        if(counter !== null) {
            const value = parseInt(counter, 10);
            if(!TypeGuard.isPositiveInteger(value)) {
                throw(new Error("The authenticator URI counter is invalid"));
            }
            
            options.counter = value;
        }
        else {
            throw(new Error("The authenticator URI counter is required"));
        }

        return new this(options);
    }

    /**
     * Get the URI of HOTP authenticator
     *
     * @return {string}
     * @memberof HOTPAuthenticator
     */
    public toURI(): string {
        const url = super.toURL();

        url.host = AuthenticatorType.HOTP;

        const counter = this.getCounter();
        url.searchParams.set("counter", counter.toString());

        return url.toString();
    }
}

export default HOTPAuthenticator;