import { describe, expect, test } from "@jest/globals";

import { Base64TestVectors } from "../rfc/rfc4648";

import Base64 from "../../src/encoding/base64";

describe("Encoding base64", () => {
    describe("Encode", () => {
        test("Should encode bytes to base64 text", () => {
            const bytes = new Uint8Array([1, 2, 3]);
            const expected = "AQID";

            expect(Base64.encode(bytes)).toBe(expected);
        });

        test("Should encode empty bytes to base64 text", () => {
            const bytes = new Uint8Array(0);
            const expected = "";

            expect(Base64.encode(bytes)).toBe(expected);
        });

        test("Should encode bytes to base64 text with padding", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5]);
            const expected = "AQIDBAU=";

            expect(Base64.encode(bytes)).toBe(expected);
        });

        test("Should round trip encode decode bytes to base64 text", () => {
            const bytes = new Uint8Array(100);
            const encoded = Base64.encode(
                globalThis.crypto.getRandomValues(bytes)
            );
            
            expect(Base64.decode(encoded)).toStrictEqual(bytes);
        });
    });

    describe("Decode", () => {
        test("Should decode base64 text to bytes", () => {
            const text = "AQID";
            const expected = new Uint8Array([1, 2, 3]);

            expect(Base64.decode(text)).toEqual(expected);
        });

        test("Shoud decode base64 text to empty bytes", () => {
            const text = "";
            const expected = new Uint8Array(0);

            expect(Base64.decode(text)).toStrictEqual(expected);
        });

        test("Should decode base64 text with padding to bytes", () => {
            const text = "AQIDBAU=";
            const expected = new Uint8Array([1, 2, 3, 4, 5]);

            expect(Base64.decode(text)).toEqual(expected);
        });

        test("Should decode base64 text throw invalid length", () => {
            expect(() => Base64.decode("A")).toThrow();
        });

        test("Should decode base64 text throw invalid character", () => {
            expect(() => Base64.decode("AQI-_AU=")).toThrow();
        });

        test("Should round trip decode encode base64 text to bytes", () => {
            const text = "AQIDBA==";
            const decoded = Base64.decode(text);
            
            expect(Base64.encode(decoded)).toBe(text);
        });
    });

    describe("RFC 4648 (Test Vectors)", () => {
        for(const { input, output } of Base64TestVectors) {
            const bytes = new TextEncoder().encode(input);

            test(`Should encode base64 "${input}"`, () => {
                expect(Base64.encode(bytes)).toStrictEqual(output);
            });

            test(`Should decode base64 "${output}"`, () => {
                expect(Base64.decode(output)).toStrictEqual(bytes);
            });
        }
    });
});