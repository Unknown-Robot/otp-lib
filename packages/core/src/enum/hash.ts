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