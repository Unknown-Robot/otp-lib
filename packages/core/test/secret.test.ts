import { describe, expect, test } from "@jest/globals";

import Base64URL from "../src/encoding/base64url";
import Base64 from "../src/encoding/base64";
import Base32 from "../src/encoding/base32";
import Latin1 from "../src/encoding/latin1";
import Ascii from "../src/encoding/ascii";
import Utf8 from "../src/encoding/utf8";
import Hex from "../src/encoding/hex";

import Secret from "../src/secret";

describe("Secret", () => {
    describe("Constructor", () => {
        test("Should use default option values", () => {
            const secret = Secret.create();
            const bytes = secret.toBytes();

            expect(bytes.length).toBe(20);
        });

        test("Should use defined option values", () => {
            const secret = Secret.create(32);
            const bytes = secret.toBytes();

            expect(bytes.length).toBe(32);
        });

        test("Should create unique secrets for each instance", () => {
            const a = Secret.create();
            const b = Secret.create();

            expect(a.toBytes()).not.toBe(b.toBytes());
        });

        test("Should throw if bytes is not instance of Uint8Array class", () => {
            /* @ts-expect-error */
            expect(() => Secret.fromBytes("bytes")).toThrow();
        });
    });

    describe("Immutability", () => {
        test("Should copy the input bytes", () => {
            const input = new Uint8Array([1, 2, 3]);
            const secret = Secret.fromBytes(input);
            input[0] = 99;

            expect(secret.toBytes()[0]).toBe(1);
        });

        test("Should return copy of the internal bytes", () => {
            const secret = Secret.fromBytes(new Uint8Array([1, 2, 3]));
            const bytes = secret.toBytes();
            bytes[0] = 99;

            expect(secret.toBytes()[0]).toBe(1);
        });
    });

    /* describe("Base64URL", () => {

    }); */

    describe("Input", () => {
        test("Should create secret from bytes", () => {
            const bytes = new Uint8Array(100);
            const secret = Secret.fromBytes(
                globalThis.crypto.getRandomValues(bytes)
            );

            expect(secret.toBytes()).toStrictEqual(bytes);
        });

        test("Should create secret from base64url text", () => {
            const text = "-_AA";
            const expected = new Uint8Array([251, 240, 0]);
            const secret = Secret.fromBase64URL(text);

            expect(secret.toBytes()).toStrictEqual(expected);
        });

        test("Should throw if base64url secret is not string", () => {
            /* @ts-expect-error */
            expect(() => Secret.fromBase64URL(123)).toThrow("The secret must be a string");
        });

        test("Should create secret from base64 text", () => {
            const text = "AQID";
            const expected = new Uint8Array([1, 2, 3]);
            const secret = Secret.fromBase64(text);

            expect(secret.toBytes()).toStrictEqual(expected);
        });

        test("Should throw if base64 secret is not string", () => {
            /* @ts-expect-error */
            expect(() => Secret.fromBase64(123)).toThrow("The secret must be a string");
        });

        test("Should create secret from base32 text", () => {
            const text = "AEBAGBAF";
            const expected = new Uint8Array([1, 2, 3, 4, 5]);
            const secret = Secret.fromBase32(text);

            expect(secret.toBytes()).toStrictEqual(expected);
        });

        test("Should throw if base32 secret is not string", () => {
            /* @ts-expect-error */
            expect(() => Secret.fromBase32(123)).toThrow("The secret must be a string");
        });

        test("Should create secret from latin1 text", () => {
            const text = "Hello";
            const expected = new Uint8Array([72, 101, 108, 108, 111]);
            const secret = Secret.fromLatin1(text);

            expect(secret.toBytes()).toStrictEqual(expected);
        });

        test("Should throw if latin1 secret is not string", () => {
            /* @ts-expect-error */
            expect(() => Secret.fromLatin1(123)).toThrow("The secret must be a string");
        });

        test("Should create secret from ascii text", () => {
            const text = "Hello";
            const expected = new Uint8Array([72, 101, 108, 108, 111]);
            const secret = Secret.fromAscii(text);

            expect(secret.toBytes()).toStrictEqual(expected);
        });

        test("Should throw if ascii secret is not string", () => {
            /* @ts-expect-error */
            expect(() => Secret.fromAscii(123)).toThrow("The secret must be a string");
        });

        test("Should create secret from utf8 text", () => {
            const text = "Hello";
            const expected = new Uint8Array([72, 101, 108, 108, 111]);
            const secret = Secret.fromUtf8(text);

            expect(secret.toBytes()).toStrictEqual(expected);
        });

        test("Should throw if utf8 secret is not string", () => {
            /* @ts-expect-error */
            expect(() => Secret.fromUtf8(123)).toThrow("The secret must be a string");
        });

        test("Should create secret from hex text", () => {
            const text = "0102030405";
            const expected = new Uint8Array([1, 2, 3, 4, 5]);
            const secret = Secret.fromHex(text);

            expect(secret.toBytes()).toStrictEqual(expected);
        });

        test("Should throw if hex secret is not string", () => {
            /* @ts-expect-error */
            expect(() => Secret.fromHex(123)).toThrow("The secret must be a string");
        });
    });

    describe("Output", () => {
        test("Should return base64url text from secret", () => {
            const bytes = new Uint8Array([251, 240, 0]);
            const expected = "-_AA";
            const secret = Secret.fromBytes(bytes);

            expect(secret.toBase64URL()).toBe(expected);
        });

        test("Should return base64 text from secret", () => {
            const bytes = new Uint8Array([1, 2, 3]);
            const expected = "AQID";
            const secret = Secret.fromBytes(bytes);

            expect(secret.toBase64()).toBe(expected);
        });

        test("Should return base32 text from secret", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5]);
            const expected = "AEBAGBAF";
            const secret = Secret.fromBytes(bytes);

            expect(secret.toBase32()).toBe(expected);
        });

        test("Should return latin1 text from secret", () => {
            const bytes = new Uint8Array([72, 101, 108, 108, 111]);
            const expected = "Hello";
            const secret = Secret.fromBytes(bytes);

            expect(secret.toLatin1()).toBe(expected);
        });

        test("Should return ascii text from secret", () => {
            const bytes = new Uint8Array([72, 101, 108, 108, 111]);
            const expected = "Hello";
            const secret = Secret.fromBytes(bytes);

            expect(secret.toAscii()).toBe(expected);
        });

        test("Should return utf8 text from secret", () => {
            const bytes = new Uint8Array([72, 101, 108, 108, 111]);
            const expected = "Hello";
            const secret = Secret.fromBytes(bytes);

            expect(secret.toUtf8()).toBe(expected);
        });

        test("Should return hex text from secret", () => {
            const bytes = new Uint8Array([1, 2, 3, 4, 5]);
            const expected = "0102030405";
            const secret = Secret.fromBytes(bytes);

            expect(secret.toHex()).toBe(expected);
        });
    });
});