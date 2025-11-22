import { describe, expect, test } from "@jest/globals";

import type { IHOTPOptions } from "../src/types/hotp";

import RFC4226TestValues from "./rfc/rfc4226";

import Hex from "../src/encoding/hex";

import Secret from "../src/secret";
import HOTP from "../src/hotp";

class TestHOTP extends HOTP {
    public digest(counter: number): Promise<Uint8Array<ArrayBuffer>> {
        return super.digest(counter);
    }
}

describe("HMAC-Based One-Time Password", () => {
    describe("Constructor", () => {
        test("Should use default option values", () => {
            const hotp = new HOTP();

            expect(hotp.getLookAhead()).toBe(0);
            expect(hotp.getCounter()).toBe(0);
        });

        test("Should use defined option values", () => {
            const options: IHOTPOptions = {};
            options.lookAhead = 3;
            options.counter = 10;

            const hotp = new HOTP(options);

            expect(hotp.getLookAhead()).toBe(options.lookAhead);
            expect(hotp.getCounter()).toBe(options.counter);
        });

        test("Should throw if counter is not non-negative integer", () => {
            expect(() => new HOTP({ counter: 0.5 })).toThrow();
            expect(() => new HOTP({ counter: -9 })).toThrow();
        });

        test("Should throw if lookAhead is not non-negative integer", () => {
            expect(() => new HOTP({ lookAhead: 0.5 })).toThrow();
            expect(() => new HOTP({ lookAhead: -9 })).toThrow();
        });
    });

    describe("Counter", () => {
        test("Should update counter value", () => {
            const hotp = new HOTP({ counter: 11 });
            const counter = 451;

            expect(hotp.getCounter()).not.toBe(counter)
            hotp.setCounter(counter);
            expect(hotp.getCounter()).toBe(counter);
        });
    });

    describe("Verify", () => {
        test("Should success verify the current code", async() => {
            const hotp = new HOTP();
            const code = await hotp.generate();

            expect(await hotp.verifyDelta(code)).toBe(0);
            expect(await hotp.verify(code)).toBe(true);
        });

        test("Should success verify the next look-ahead code", async() => {
            const hotp = new HOTP({ lookAhead: 1 });

            hotp.setCounter(1);
            const code = await hotp.generate();
            hotp.setCounter(0);

            expect(await hotp.verifyDelta(code)).toBe(1);
            expect(await hotp.verify(code)).toBe(true);
        });

        test("Should success verify the all look-ahead codes", async() => {
            const hotp = new HOTP({ lookAhead: 5 });

            for(let i = 0; i <= hotp.getLookAhead(); i++) {
                hotp.setCounter(i);
                const code = await hotp.generate();
                hotp.setCounter(0);

                expect(await hotp.verifyDelta(code)).toBe(i);
                expect(await hotp.verify(code)).toBe(true);
            }
        });

        test("Should fail verify the past look-ahead code", async() => {
            const hotp = new HOTP({ lookAhead: 1 });

            hotp.setCounter(0);
            const code = await hotp.generate();
            hotp.setCounter(1);

            expect(await hotp.verifyDelta(code)).toBe(null);
            expect(await hotp.verify(code)).toBe(false);
        });

        /* test("Should fail when the code is too short") */
    });

    describe("RFC 4226 (Appendix D - HOTP Algorithm: Test Values)", () => {
        const secret = Secret.fromAscii(RFC4226TestValues.secret);

        for(const [counter, digest] of RFC4226TestValues.digests.entries()) {
            test(`Should generate HMAC digest "${digest}"`, async() => {
                const hotp = new TestHOTP({
                    algorithm: RFC4226TestValues.algorithm,
                    secret
                });

                const value = await hotp.digest(counter);

                expect(Hex.encode(value)).toBe(digest);
            });
        }

        for(const [counter, code] of RFC4226TestValues.codes.entries()) {
            test(`Should generate HOTP "${code}"`, async() => {
                const hotp = new HOTP({
                    algorithm: RFC4226TestValues.algorithm,
                    counter: counter,
                    secret
                });

                const value = await hotp.generate();

                expect(value).toBe(code);
                expect(await hotp.verify(value)).toBe(true);
                expect(await hotp.verifyDelta(value)).not.toBe(null);
            });
        }
    });
});