import { describe, expect, test } from "@jest/globals";

import Ascii from "../../src/encoding/ascii";

describe("Encoding ascii", () => {
    describe("Encode", () => {
        test("Should encode bytes to ascii text", () => {
            const bytes = new Uint8Array([72, 101, 108, 108, 111]);
            const expected = "Hello";
            
            expect(Ascii.encode(bytes)).toBe(expected);
        });

        test("Should encode empty bytes to ascii text", () => {
            const bytes = new Uint8Array(0);
            const expected = "";

            expect(Ascii.encode(bytes)).toBe(expected);
        });

        test("Should encode bytes to ascii control characters", () => {
            const bytes = new Uint8Array([0, 9, 10]);
            const expected = "\x00\t\n";
            
            expect(Ascii.encode(bytes)).toBe(expected);
        });

        test("Should round trip encode decode bytes to ascii text", () => {
            const bytes = new Uint8Array(Array.from({ length: 128 }, (_, i) => i));
            const encoded = Ascii.encode(bytes);
            
            expect(Ascii.decode(encoded)).toStrictEqual(bytes);
        });
    });

    describe("Decode", () => {
        test("Shoud decode ascii text to bytes", () => {
            const text = "Hello";
            const expected = new Uint8Array([72, 101, 108, 108, 111]);

            expect(Ascii.decode(text)).toEqual(expected);
        });

        test("Shoud decode ascii text to empty bytes", () => {
            const text = "";
            const expected = new Uint8Array(0);

            expect(Ascii.decode(text)).toStrictEqual(expected);
        });

        test("Should encode ascii control characters to bytes", () => {
            const text = "\x00\t\n";
            const expected = new Uint8Array([0, 9, 10]);
            
            expect(Ascii.decode(text)).toStrictEqual(expected);
        });

        test("Should decode ascii text throw invalid character", () => {
            expect(() => Ascii.decode(String.fromCharCode(128))).toThrow();
            expect(() => Ascii.decode("café")).toThrow();
            expect(() => Ascii.decode("♥️")).toThrow();
        });

        test("Should round trip decode encode ascii text to bytes", () => {
            const text = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
            const decoded = Ascii.decode(text);
            
            expect(Ascii.encode(decoded)).toBe(text);
        });
    });
});