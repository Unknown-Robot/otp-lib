import { describe, expect, test } from "@jest/globals";

import Hex from "../../src/encoding/hex";

describe("Encoding hex", () => {
    describe("Encode", () => {
        test("Should encode bytes to hex text", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5]);
            const expected = "0102030405";

            expect(Hex.encode(bytes)).toBe(expected);
        });

        test("Should encode empty bytes to hex text", () => {
            const bytes = new Uint8Array(0);
            const expected = "";

            expect(Hex.encode(bytes)).toBe(expected);
        });

        test("Should encode maximum bytes to hex text", () => {
            const bytes = new Uint8Array([255, 255]);
            const expected = "ffff";

            expect(Hex.encode(bytes)).toBe(expected);
        });

        test("Should encode bytes to hex text with zero", () => {
            const bytes = new Uint8Array([10, 1]);
            const expected = "0a01";

            expect(Hex.encode(bytes)).toBe(expected);
        });

        test("Should round trip encode decode bytes to base64url text", () => {
            const bytes = new Uint8Array(100);
            const encoded = Hex.encode(
                globalThis.crypto.getRandomValues(bytes)
            );
            
            expect(Hex.decode(encoded)).toStrictEqual(bytes);
        });
    });

    describe("Decode", () => {
        test("Should decode hex text to bytes", () => {
            const text = "0102030405";
            const expected = new Uint8Array([1, 2, 3, 4, 5]);

            expect(Hex.decode(text)).toEqual(expected);
        });

        test("Shoud decode hex text to empty bytes", () => {
            const text = "";
            const expected = new Uint8Array(0);

            expect(Hex.decode(text)).toStrictEqual(expected);
        });

        test("Shoud decode hex text case insensitive", () => {
            const text = "DEADBEEFff";
            const expected = new Uint8Array([222, 173, 190, 239, 255]);

            expect(Hex.decode(text)).toEqual(expected);
        });

        test("Should decode hex text throw invalid length", () => {
            expect(() => Hex.decode("ABC")).toThrow();
        });

        test("Should decode hex text throw invalid character", () => {
            expect(() => Hex.decode("ABGZ")).toThrow();
        });

        test("Should round trip decode encode ascii text to bytes", () => {
            const text = "deadbeef";
            const decoded = Hex.decode(text);
            
            expect(Hex.encode(decoded)).toBe(text);
        });
    });
});