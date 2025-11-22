import type { IOTPOptions } from "./otp";

/**
 * Interface ITOTPWindow
 * used to represents the Time-Based One-Time Password period window
 *
 * @export
 * @interface ITOTPWindow
 */
export interface ITOTPWindow {
    /**
     * The future of period window
     *
     * @type {number}
     * @memberof ITOTPWindow
     */
    future?: number;

    /**
     * The past of period window
     *
     * @type {number}
     * @memberof ITOTPWindow
     */
    past?: number;
}

/**
 * Interface ITOTPOptions
 * used to represents the Time-Based One-Time Password options
 *
 * @export
 * @interface ITOTPOptions
 * @extends {IOTPOptions}
 */
export interface ITOTPOptions extends IOTPOptions {
    /**
     * The future, past period window of TOTP
     *
     * @type {(number | [number, number])}
     * @memberof TOTP
     */
    window?: number | [number, number];

    /**
     * The period in seconds of TOTP
     *
     * @type {number}
     * @memberof TOTP
     */
    period?: number;
}