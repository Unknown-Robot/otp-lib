import type { HashAlgorithms } from "../enum/hash";

import type Secret from "../secret";

/**
 * Interface IOTPOptions
 * used to represents the One-Time Password options
 *
 * @export
 * @interface IOTPOptions
 */
export interface IOTPOptions {
    /**
     * The hash algorithm of OTP
     *
     * @type {HashAlgorithms}
     * @memberof IOTPOptions
     */
    algorithm?: HashAlgorithms;
    
    /**
     * The digits length of OTP
     *
     * @type {number}
     * @memberof IOTPOptions
     */
    digits?: number;

    /**
     * The secret of OTP
     *
     * @type {Secret}
     * @memberof IOTPOptions
     */
    secret?: Secret;
}