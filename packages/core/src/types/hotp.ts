import type { IOTPOptions } from "./otp";

/**
 * Interface IHOTPOptions
 * used to represents the HMAC-Based One-Time Password options
 *
 * @export
 * @interface IHOTPOptions
 * @extends {IOTPOptions}
 */
export interface IHOTPOptions extends IOTPOptions {
    /**
     * The look-ahead window of HOTP
     *
     * @type {number}
     * @memberof IHOTPOptions
     */
    lookAhead?: number;

    /**
     * The counter value of HOTP
     *
     * @type {number}
     * @memberof IHOTPOptions
     */
    counter?: number;
}