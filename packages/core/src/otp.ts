import type { IOTPOptions } from "./types/otp";

import { HashAlgorithms } from "./enum/hash";

import TypeGuard from "./utils/typeguard";

import Secret from "./secret";

/**
 * Class OTP
 * used to implements the One-Time Password
 *
 * @class OTP
 */
class OTP {
    /**
     * The Crypto Subtle key of OTP 
     *
     * @private
     * @type {(CryptoKey | null)}
     * @memberof OTP
     */
    private cryptoKey: CryptoKey | null = null;

    /**
     * The hash algorithm of OTP
     *
     * @private
     * @type {HashAlgorithms}
     * @memberof OTP
     */
    private algorithm: HashAlgorithms;

    /**
     * The digits length of OTP
     *
     * @private
     * @type {number}
     * @memberof OTP
     */
    private digits: number;

    /**
     * The secret of OTP
     *
     * @private
     * @type {Secret}
     * @memberof OTP
     */
    private secret: Secret;

    /**
     * Constructor of OTP class
     * 
     * @param {IOTPOptions} [options={}] The options of OTP
     * @memberof OTP
     */
    constructor(options: IOTPOptions = {}) {
        if(!TypeGuard.isPlainObject(options)) {
            throw(new Error("The options must be a plain object"));
        }

        const algorithm = options.algorithm ?? HashAlgorithms.SHA1;
        if(!TypeGuard.isEnum(algorithm, HashAlgorithms)) {
            throw(new Error(`The options.algorithm "${algorithm}" is not supported`));
        }

        const secret = options.secret ?? Secret.create();
        if(!(secret instanceof Secret)) {
            throw(new Error("The options.secret must be a instance of Secret class"));
        }
        
        const digits = options.digits ?? 6;
        if(!TypeGuard.isPositiveInteger(digits)) {
            throw(new Error("The options.digits must be a positive integer"));
        }

        this.algorithm = algorithm;
        this.secret = secret;
        this.digits = digits;
    }

    /**
     * Get the hash algorithm of OTP
     *
     * @return {HashAlgorithms}
     * @memberof OTP
     */
    public getAlgorithm(): HashAlgorithms {
        return this.algorithm;
    }

    /**
     * Get the digits length of OTP
     *
     * @return {number}
     * @memberof OTP
     */
    public getDigits(): number {
        return this.digits;
    }

    /**
     * Get the secret of OTP
     *
     * @return {Secret}
     * @memberof OTP
     */
    public getSecret(): Secret {
        return this.secret;
    }

    /**
     * Constant time comparison of two strings to prevent timing attacks
     *
     * @protected
     * @param {string} a The first string to compare
     * @param {string} b The second string to compare
     * @return {boolean}
     * @memberof OTP
     */
    protected timingSafeEqual(a: string, b: string): boolean {
        if(a.length !== b.length) {
            return false;
        }

        let diff = 0;
        for(let i = 0; i < a.length; i++) {
            diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
        }

        return diff === 0;
    }

    /**
     * Get the Web Crypto key of OTP
     *
     * @protected
     * @return {Promise<CryptoKey>}
     * @memberof OTP
     */
    protected async getCryptoKey(): Promise<CryptoKey> {
        if(this.cryptoKey === null) {
            this.cryptoKey = await globalThis.crypto.subtle.importKey(
                "raw", this.secret.toBytes(), { name: "HMAC", hash: this.algorithm }, false, ["sign"]
            );
        }

        return this.cryptoKey;
    }

    /**
     * Generate the HMAC digest for the counter value
     * {@link https://datatracker.ietf.org/doc/html/rfc4226#section-5.3|RFC 4226}
     *
     * @protected
     * @param {number} counter The counter value of OTP
     * @return {Promise<Uint8Array<ArrayBuffer>>}
     * @memberof OTP
     */
    protected async digest(counter: number): Promise<Uint8Array<ArrayBuffer>> {
        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);
        view.setBigUint64(0, BigInt(counter), false);
     
        const digest = await globalThis.crypto.subtle.sign(
            { name: "HMAC", hash: this.algorithm },
            await this.getCryptoKey(),
            buffer
        );

        return new Uint8Array(digest);
    }

    /**
     * Create the OTP code from counter value
     * {@link https://datatracker.ietf.org/doc/html/rfc4226#section-5.4|RFC 4226}
     *
     * @protected
     * @param {number} counter The counter value of OTP
     * @return {Promise<string>}
     * @memberof OTP
     */
    protected async code(counter: number): Promise<string> {
        const digest = await this.digest(counter);
        const offset = digest[digest.byteLength - 1] & 0xf;
        const code = (
            ((digest[offset] & 0x7f) << 24) |
            ((digest[offset + 1] & 0xff) << 16) |
            ((digest[offset + 2] & 0xff) << 8) |
            (digest[offset + 3] & 0xff)
        ) % 10 ** this.digits;

        return code.toString().padStart(this.digits, "0");
    }

    /**
     * Verify the OTP code delta for the counter value
     *
     * @protected
     * @param {string} code The OTP code to verify
     * @param {Map<number, number>} counters The OTP counter values to verify
     * @return {Promise<number | null>}
     * @memberof OTP
     */
    protected async verifyDelta(code: string, counters: Map<number, number>): Promise<number | null> {
        if(code.length === this.digits) {
            for(const [delta, counter] of counters) {
                const value = await this.code(counter);
                if(this.timingSafeEqual(value, code)) {
                    return delta;
                }
            }
        }

        return null;
    }
}

export default OTP;