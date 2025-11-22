/**
 * Enum AuthenticatorType
 * used to implements the authenticator type
 *
 * @export
 * @enum {string}
 * @see https://github.com/google/google-authenticator/wiki/Key-Uri-Format#types
 */
export enum AuthenticatorType {
    /**
     * The HOTP type of authenticator
     * 
     * @type {string}
     */
    HOTP = "hotp",

    /**
     * The TOTP type of authenticator
     * 
     * @type {string}
     */
    TOTP = "totp"
}