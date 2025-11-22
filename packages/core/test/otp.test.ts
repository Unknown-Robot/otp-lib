import { describe, expect, test } from "@jest/globals";

import type { IOTPOptions } from "../src/types/otp";

import { HashAlgorithms } from "../src/enum/hash";

import Secret from "../src/secret";
import OTP from "../src/otp";

class TestOTP extends OTP {
    public verifyDelta(code: string, counters: Map<number, number>): Promise<number | null> {
        return super.verifyDelta(code, counters);
    }

    public digest(counter: number): Promise<Uint8Array<ArrayBuffer>> {
        return super.digest(counter);
    }

    public timingSafeEqual(a: string, b: string): boolean {
        return super.timingSafeEqual(a, b);
    }

    public code(counter: number): Promise<string> {
        return super.code(counter);
    }
}

describe("One-Time Password", () => {
    describe("Constructor", () => {
        test("Should use default option values", () => {
            const otp = new TestOTP();

            expect(otp.getAlgorithm()).toBe(HashAlgorithms.SHA1);
            expect(otp.getSecret()).toBeInstanceOf(Secret);
            expect(otp.getDigits()).toBe(6);
        });

        test("Should use defined option values", () => {
            const options: IOTPOptions = {};
            options.algorithm = HashAlgorithms.SHA256;
            options.secret = Secret.create();
            options.digits = 8;

            const otp = new TestOTP(options);

            expect(otp.getAlgorithm()).toBe(options.algorithm);
            expect(otp.getSecret()).toBe(options.secret);
            expect(otp.getDigits()).toBe(options.digits);
        });

        test("Should throw if algorithm is not supported", () => {
            /* @ts-expect-error */
            expect(() => new TestOTP({ algorithm: "MD5" })).toThrow();
        });

        test("Should throw if secret is not instance of Secret class", () => {
            /* @ts-expect-error */
            expect(() => new TestOTP({ secret: "secret" })).toThrow();
        });

        test("Should throw if digits is not positive integer", () => {
            expect(() => new TestOTP({ digits: 0 })).toThrow();
            expect(() => new TestOTP({ digits: -9 })).toThrow();
            expect(() => new TestOTP({ digits: 0.5 })).toThrow();
        });
    });

    describe("Timing safe equal", () => {
        const otp = new TestOTP();

        test("Should return true for identical strings", () => {
            expect(otp.timingSafeEqual("123456", "123456")).toBe(true);
        });

        test("Should return false for strings with different lengths", () => {
            expect(otp.timingSafeEqual("123456", "123")).toBe(false);
        });

        test("Should return false for different strings with same length", () => {
            expect(otp.timingSafeEqual("123456", "123457")).toBe(false);
        });
    });

    describe("Digest", () => {
        test("Should generate digest", async() => {
            const otp = new TestOTP();
            const digest = await otp.digest(0);

            expect(digest).toBeInstanceOf(Uint8Array);
        });

        test("Should generate SHA-1 digest", async() => {
            const otp = new TestOTP({ algorithm: HashAlgorithms.SHA1 });
            const digest = await otp.digest(0);

            expect(digest.byteLength).toBe(20);
        });

        test("Should generate SHA-256 digest", async() => {
            const otp = new TestOTP({ algorithm: HashAlgorithms.SHA256 });
            const digest = await otp.digest(0);

            expect(digest.byteLength).toBe(32);
        });

        test("Should generate SHA-384 digest", async() => {
            const otp = new TestOTP({ algorithm: HashAlgorithms.SHA384 });
            const digest = await otp.digest(0);

            expect(digest.byteLength).toBe(48);
        });

        test("Should generate SHA-512 digest", async() => {
            const otp = new TestOTP({ algorithm: HashAlgorithms.SHA512 });
            const digest = await otp.digest(0);

            expect(digest.byteLength).toBe(64);
        });
    });

    describe("Code", () => {
        test("Should generate code with the same length of digits", async() => {
            const options: IOTPOptions = {};
            options.digits = 10;

            const otp = new TestOTP(options);
            const code = await otp.code(1);

            expect(code.length).toBe(options.digits);
        });

        test("Should generate same code with multiple OTP's using the same secret", async() => {
            const secret = Secret.create();
            const a = new TestOTP({ secret });
            const b = new TestOTP({ secret });

            expect(await a.code(1)).toBe(await b.code(1));
        });
    });

    describe("Verify", () => {
        test("Should return delta when the code is valid", async() => {
            const otp = new TestOTP();
            const code = await otp.code(1);
            const counters = new Map([[0, 1]]);

            expect(await otp.verifyDelta(code, counters)).toBe(0);
        });

        test("Should return delta when at least one codes is valid", async() => {
            const otp = new TestOTP();
            const code = await otp.code(1);
            const counters = new Map([
                [0, 0], [1, 1], [2, 2]
            ]);

            expect(await otp.verifyDelta(code, counters)).toBe(1);
        });

        test("Should return null when the code is too short", async() => {
            const otp = new TestOTP({ digits: 4 });

            expect(await otp.verifyDelta("0", new Map())).toBeNull();
        });

        test("Should return null when the code is too long", async() => {
            const otp = new TestOTP({ digits: 6 });

            expect(await otp.verifyDelta("0000000", new Map())).toBeNull();
        });

        test("Should return null when the code contains non-numeric characters", async() => {
            const otp = new TestOTP({ digits: 8 });

            expect(await otp.verifyDelta("ABCDEF", new Map())).toBeNull();
        });
    });
});