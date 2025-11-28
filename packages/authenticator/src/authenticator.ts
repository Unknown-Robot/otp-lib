import type { TAuthenticatorOptions } from "./types/authenticator";
import type { IOTPOptions } from "@otp-lib/core";

import { OTP, Secret, HashAlgorithms } from "@otp-lib/core";
import { TypeGuard } from "@otp-lib/core/utils";

import { AuthenticatorType } from "./enum/type";

/**
 * Class Authenticator
 * used to implements the authenticator
 *
 * @class Authenticator
 * @template TCore The template of OTP
 * @template TOptions The template of OTP options
 */
class Authenticator<TCore extends OTP, TOptions extends IOTPOptions> {
    /**
     * The account name of authenticator
     *
     * @private
     * @type {string}
     * @memberof Authenticator
     */
    private account: string;

    /**
     * The issuer name of authenticator
     *
     * @private
     * @type {(string | null)}
     * @memberof Authenticator
     */
    private issuer: string | null;

    /**
     * The OTP of authenticator
     *
     * @protected
     * @type {TCore}
     * @memberof Authenticator
     */
    protected otp: TCore;

    /**
     * Constructor of Authenticator class
     * 
     * @param {TCore} otp The instance of OTP
     * @param {TAuthenticatorOptions<TOptions>} options The options of authenticator
     * @memberof Authenticator
     */
    constructor(otp: TCore, options: TAuthenticatorOptions<TOptions>) {
        const { account, issuer = null } = options;

        if(!TypeGuard.isString(account)) {
            throw(new Error("The options.account must be a string"));
        }
        else if(issuer !== null && !TypeGuard.isString(issuer)) {
            throw(new Error("The options.issuer must be a string or null"));
        }

        this.account = account;
        this.issuer = issuer;
        this.otp = otp;
    }

    /**
     * Get the hash algorithm of OTP authenticator
     *
     * @return {HashAlgorithms}
     * @memberof Authenticator
     */
    public getAlgorithm(): HashAlgorithms {
        return this.otp.getAlgorithm();
    }

    /**
     * Get the digits length of OTP authenticator
     *
     * @return {number}
     * @memberof Authenticator
     */
    public getDigits(): number {
        return this.otp.getDigits();
    }

    /**
     * Get the secret of OTP authenticator
     *
     * @return {Secret}
     * @memberof Authenticator
     */
    public getSecret(): Secret {
        return this.otp.getSecret();
    }

    /**
     * Get the account name of authenticator
     *
     * @return {string}
     * @memberof Authenticator
     */
    public getAccount(): string {
        return this.account;
    }

    /**
     * Get the issuer name of authenticator
     *
     * @return {(string | null)}
     * @memberof Authenticator
     */
    public getIssuer(): string | null {
        return this.issuer;
    }

    /**
     * Get the authenticator options from URL
     *
     * @protected
     * @static
     * @param {URL} url The authenticator URI to parse
     * @return {TAuthenticatorOptions<IOTPOptions>}
     * @memberof Authenticator
     */
    protected static fromURL(url: URL): TAuthenticatorOptions<IOTPOptions> {
        if(!url.protocol.startsWith("otpauth")) {
            throw(new Error("The authenticator URI protocol is invalid"));
        }
        else if(!TypeGuard.isEnum(url.host, AuthenticatorType)) {
            throw(new Error("The authenticator URI type is invalid"));
        }

        const label = decodeURIComponent(url.pathname.substring(1));
        if(!label.length) {
            throw(new Error("The authenticator URI label is invalid"));
        }

        const options: TAuthenticatorOptions<IOTPOptions> = {
            account: label
        };

        const separator = label.indexOf(":");
        if(separator !== -1) {
            options.account = label.substring(separator + 1);
        }

        const issuer = url.searchParams.get("issuer");
        if(issuer !== null) {
            options.issuer = issuer;
        }
        else if(separator > 0) {
            options.issuer = label.substring(0, separator);
        }

        const secret = url.searchParams.get("secret");
        if(!secret || !secret.length) {
            throw(new Error("The authenticator URI secret is required"));
        }

        options.secret = Secret.fromBase32(secret);

        const algorithm = url.searchParams.get("algorithm");
        if(algorithm !== null) {
            const value = algorithm.toUpperCase();
            if(!TypeGuard.isKeyOf(value, HashAlgorithms)) {
                throw(new Error("The authenticator URI algorithm is not supported"));
            }

            options.algorithm = HashAlgorithms[value];
        }

        const digits = url.searchParams.get("digits");
        if(digits !== null) {
            const value = parseInt(digits, 10);
            if(!TypeGuard.isPositiveInteger(value)) {
                throw(new Error("The authenticator URI digits is invalid"));
            }
            
            options.digits = value;
        }

        return options;
    }

    /**
     * Get the URL from authenticator
     *
     * @protected
     * @return {URL}
     * @memberof Authenticator
     */
    protected toURL(): URL {
        const url = new URL("otpauth://");
        
        if(this.issuer) {
            url.pathname = [this.issuer, this.account].map(encodeURIComponent).join(":");
            url.searchParams.set("issuer", this.issuer);
        }
        else {
            url.pathname = encodeURIComponent(this.account);
        }

        const algorithm = this.getAlgorithm();
        const secret = this.getSecret();
        const digits = this.getDigits();

        url.searchParams.set("algorithm", algorithm.replace("-", ""));
        url.searchParams.set("secret", secret.toBase32());
        url.searchParams.set("digits", digits.toString());

        return url;
    }
}

export default Authenticator;