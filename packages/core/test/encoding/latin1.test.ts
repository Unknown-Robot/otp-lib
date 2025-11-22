import { describe, expect, test } from "@jest/globals";

import Latin1 from "../../src/encoding/latin1";

describe("Encoding latin1", () => {
    describe("Encode", () => {
        test("Should encode standard bytes to ascii text", () => {
            const bytes = new Uint8Array([72, 101, 108, 108, 111]);
            const expected = "Hello";

            expect(Latin1.encode(bytes)).toBe(expected);
        });

        test("Should encode extended 8-bit bytes to latin1 text", () => {
            const bytes = new Uint8Array([128, 169, 255]);
            const expected = bytes.reduce((result, byte) => (
                result += String.fromCharCode(byte)
            ), "");

            expect(Latin1.encode(bytes)).toBe(expected);
        });

        test("Should encode empty bytes to latin1 text", () => {
            const bytes = new Uint8Array(0);
            const expected = "";

            expect(Latin1.encode(bytes)).toBe(expected);
        });

        test("Should round trip encode decode bytes to latin1 text", () => {
            const bytes = new Uint8Array(Array.from({ length: 256 }, (_, i) => i));
            const encoded = Latin1.encode(bytes);
            
            expect(Latin1.decode(encoded)).toStrictEqual(bytes);
        });
    });

    describe("Decode", () => {
        test("Should decode standard bytes to ascii text", () => {
            const text = "Hello";
            const expected = new Uint8Array([72, 101, 108, 108, 111]);

            expect(Latin1.decode(text)).toStrictEqual(expected);
        });

        test("Should decode extended 8-bit bytes to latin1 text", () => {
            const expected = new Uint8Array([128, 169, 255]);
            const text = expected.reduce((result, byte) => (
                result += String.fromCharCode(byte)
            ), "");

            expect(Latin1.decode(text)).toStrictEqual(expected);
        });

        test("Should decode empty bytes to latin1 text", () => {
            const text = "";
            const expected = new Uint8Array(0);

            expect(Latin1.decode(text)).toStrictEqual(expected);
        });

        test("Should decode ascii text throw invalid character", () => {
            expect(() => Latin1.decode(String.fromCharCode(257))).toThrow();
            expect(() => Latin1.decode("你好")).toThrow();
            expect(() => Latin1.decode("♥️")).toThrow();
        });

        test("Should round trip decode encode ascii text to bytes", () => {
            const text = Array.from({ length: 256 }, (_, i) => (
                String.fromCharCode(i)
            )).join("");
            const decoded = Latin1.decode(text);
            
            expect(Latin1.encode(decoded)).toBe(text);
        });
    });
});