/**
 * Enum HashAlgorithms
 * used to implements the hash algorithms, indexed by compact format to NIST format
 *
 * @export
 * @enum {string}
 */
export enum HashAlgorithms {
    /**
     * The Secure Hash Algorithm 512 bits
     * 
     * @type {string}
     */
    SHA512 = "SHA-512",

    /**
     * The Secure Hash Algorithm 384 bits
     * 
     * @type {string}
     */
    SHA384 = "SHA-384",

    /**
     * The Secure Hash Algorithm 256 bits
     * 
     * @type {string}
     */
    SHA256 = "SHA-256",

    /**
     * The Secure Hash Algorithm 160 bits
     * 
     * @type {string}
     */
    SHA1 = "SHA-1"
}

/**
 * Recommended key size in bytes for each hash algorithm
 * 
 * @export
 * @constant
 * @type {Readonly<Record<HashAlgorithms, number>>}
 * @see https://datatracker.ietf.org/doc/html/rfc2104#section-3
 */
export const KeySizes: Readonly<Record<HashAlgorithms, number>> = {
    [HashAlgorithms.SHA512]: 64,
    [HashAlgorithms.SHA384]: 48,
    [HashAlgorithms.SHA256]: 32,
    [HashAlgorithms.SHA1]: 20
};