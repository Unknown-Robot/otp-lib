import type { IOTPOptions } from "@otp-lib/core";

export type TAuthenticatorOptions<T extends IOTPOptions> = T & IAuthenticatorOptions;

/**
 * Interface IAuthenticatorOptions
 * used to represents the authenticator options
 *
 * @export
 * @interface IAuthenticatorOptions
 * @extends {IOTPOptions}
 */
export interface IAuthenticatorOptions {
    /**
     * The issuer name of authenticator
     *
     * @type {string}
     * @memberof IAuthenticatorOptions
     */
    issuer?: string;

    /**
     * The account name of authenticator
     *
     * @type {string}
     * @memberof IAuthenticatorOptions
     */
    account: string;
}