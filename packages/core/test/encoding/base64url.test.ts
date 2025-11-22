import { describe, expect, test } from "@jest/globals";

import Base64URL from "../../src/encoding/base64url";

describe("Encoding base64url", () => {
    describe("Encode", () => {
        test("Should encode bytes to base64url text", () => {
            const bytes = new Uint8Array([251, 240, 0]);
            const expected = "-_AA";

            expect(Base64URL.encode(bytes)).toBe(expected);
        });

        test("Should encode empty bytes to base64url text", () => {
            const bytes = new Uint8Array(0);
            const expected = "";

            expect(Base64URL.encode(bytes)).toBe(expected);
        });

        test("Should encode bytes to base64url text with padding", () => {
            const bytes = new Uint8Array([251, 240]);
            const expected = "-_A";

            expect(Base64URL.encode(bytes)).toBe(expected);
        });

        test("Should round trip encode decode bytes to base64url text", () => {
            const bytes = new Uint8Array(100);
            const encoded = Base64URL.encode(
                globalThis.crypto.getRandomValues(bytes)
            );
            
            expect(Base64URL.decode(encoded)).toStrictEqual(bytes);
        });
    });

    describe("Decode", () => {
        test("Should decode base64url to bytes", () => {
            const text = "-_AA";
            const expected = new Uint8Array([251, 240, 0]);

            expect(Base64URL.decode(text)).toEqual(expected);
        });

        test("Shoud decode base64url text to empty bytes", () => {
            const text = "";
            const expected = new Uint8Array(0);

            expect(Base64URL.decode(text)).toStrictEqual(expected);
        });

        test("Should decode base64url to bytes with padding", () => {
            const text = "-_A";
            const expected = new Uint8Array([251, 240]);

            expect(Base64URL.decode(text)).toEqual(expected);
        });

        test("Should decode base64url text throw invalid character", () => {
            expect(() => Base64URL.decode("-_A$")).toThrow();
        });

        test("Should round trip decode encode base64url text to bytes", () => {
            const text = "-w";
            const decoded = Base64URL.decode(text);
            
            expect(Base64URL.encode(decoded)).toBe(text);
        });
    });
});