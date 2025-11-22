import { describe, expect, test } from "@jest/globals";

import { Base32TestVectors } from "../rfc/rfc4648";

import Base32 from "../../src/encoding/base32";

describe("Encoding base32", () => {
    describe("Encode", () => {
        test("Should encode bytes to base32 text", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5]);
            const expected = "AEBAGBAF";

            expect(Base32.encode(bytes)).toBe(expected);
        });

        test("Should encode empty bytes to base32 text", () => {
            const bytes = new Uint8Array(0);
            const expected = "";

            expect(Base32.encode(bytes)).toBe(expected);
        });

        test("Should encode bytes to base32 text with padding", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5, 6]);
            const expected = "AEBAGBAFAY======";

            expect(Base32.encode(bytes)).toBe(expected);
        });

        test("Should round trip encode decode bytes to base32 text", () => {
            const bytes = new Uint8Array(100);
            const encoded = Base32.encode(
                globalThis.crypto.getRandomValues(bytes)
            );
            
            expect(Base32.decode(encoded)).toStrictEqual(bytes);
        });
    });

    describe("Decode", () => {
        test("Shoud decode base32 text to bytes", () => {
            const text = "AEBAGBAF";
            const expected = new Uint8Array([1, 2, 3, 4, 5]);

            expect(Base32.decode(text)).toEqual(expected);
        });

        test("Shoud decode base32 text to empty bytes", () => {
            const text = "";
            const expected = new Uint8Array(0);

            expect(Base32.decode(text)).toStrictEqual(expected);
        });

        test("Shoud decode base32 text with padding to bytes", () => {
            const text = "AEBAGBAFAY======";
            const expected = new Uint8Array([1, 2, 3, 4, 5, 6]);

            expect(Base32.decode(text)).toEqual(expected);
        });

        test("Shoud decode base32 text case insensitive", () => {
            const text = "aeBAgbAF";
            const expected = Base32.decode("AEBAGBAF");

            expect(Base32.decode(text)).toStrictEqual(expected);
        });

        test("Shoud decode base32 text case insensitive with padding", () => {
            const text = "aeBAgbAFay======";
            const expected = Base32.decode("AEBAGBAFAY======");

            expect(Base32.decode(text)).toStrictEqual(expected);
        });

        test("Should decode base32 text throw invalid character", () => {
            expect(() => Base32.decode("AEBAGBA0"))
                .toThrow(`The base32 character "0" at position 8 is invalid`);
        });

        test("Should decode base32 text with padding throw invalid character", () => {
            expect(() => Base32.decode("AEBAGBAF0======="))
                .toThrow(`The base32 character "0" at position 9 is invalid`);
        });

        test("Should round trip decode encode base32 text to bytes", () => {
            const text = "MZXW6YTBOI======";
            const decoded = Base32.decode(text);
            
            expect(Base32.encode(decoded)).toBe(text);
        });
    });

    describe("RFC 4648 (Test Vectors)", () => {
        for(const { input, output } of Base32TestVectors) {
            const bytes = new TextEncoder().encode(input);

            test(`Should encode base32 "${input}"`, () => {
                expect(Base32.encode(bytes)).toStrictEqual(output);
            });

            test(`Should decode base32 "${output}"`, () => {
                expect(Base32.decode(output)).toStrictEqual(bytes);
            });
        }
    });
});