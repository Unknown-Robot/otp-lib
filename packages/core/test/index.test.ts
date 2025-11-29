import { describe, expect, test } from "@jest/globals";

import * as Library from "../src/index";

describe("Entry Point", () => {
    test("Should export classes", () => {
        expect(Library.OTP).toBeDefined();
        expect(Library.HOTP).toBeDefined();
        expect(Library.TOTP).toBeDefined();
        expect(Library.Secret).toBeDefined();
    });

    test("Should export enum", () => {
        expect(Library.HashAlgorithms).toBeDefined();
        expect(Library.KeySizes).toBeDefined();
    });
});