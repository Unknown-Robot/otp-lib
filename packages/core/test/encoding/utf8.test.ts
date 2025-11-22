import { describe, expect, test } from "@jest/globals";

import Utf8 from "../../src/encoding/utf8";

describe("Encoding utf8", () => {
    describe("Encode", () => {
        test("Should encode standard bytes to utf8 text", () => {
            const bytes = new Uint8Array([72, 101, 108, 108, 111]);
            const expected = "Hello";

            expect(Utf8.encode(bytes)).toBe(expected);
        });

        test("Should encode multi-byte characters to utf8 text", () => {
            const bytes = new Uint8Array([
                0xC3, 0xA9,
                0xE2, 0x82, 0xAC,
                0xF0, 0x9F, 0x94, 0x92
            ]);
            const expected = "é€🔒";

            expect(Utf8.encode(bytes)).toBe(expected);
        });

        test("Should encode empty bytes to utf8 text", () => {
            const bytes = new Uint8Array(0);
            const expected = "";

            expect(Utf8.encode(bytes)).toBe(expected);
        });

        test("Should round trip encode decode bytes to utf8 text", () => {
            const bytes = new Uint8Array([0xF0, 0x9F, 0x94, 0x92]);
            const text = Utf8.encode(bytes);

            expect(Utf8.decode(text)).toEqual(bytes);
        });
    });

    describe("Decode", () => {
        test("Should decode utf8 text to standard bytes", () => {
            const text = "Hello";
            const expected = new Uint8Array([72, 101, 108, 108, 111]);

            expect(Utf8.decode(text)).toEqual(expected);
        });

        test("Should decode utf8 text to multi-byte characters", () => {
            const text = "é€🔒";
            const expected = new Uint8Array([
                0xC3, 0xA9,
                0xE2, 0x82, 0xAC,
                0xF0, 0x9F, 0x94, 0x92
            ]);

            expect(Utf8.decode(text)).toEqual(expected);
        });

        test("Should decode utf8 text to empty bytes", () => {
            const text = "";
            const expected = new Uint8Array(0);

            expect(Utf8.decode(text)).toEqual(expected);
        });

        test("Should round trip decode encode utf8 text to bytes", () => {
            const text = "Test 123 € 🔒";
            const decoded = Utf8.decode(text);

            expect(Utf8.encode(decoded)).toBe(text);
        });
    });
});