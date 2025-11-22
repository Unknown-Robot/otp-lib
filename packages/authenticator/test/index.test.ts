import { describe, expect, test } from "@jest/globals";

import * as Library from "../src/index";

describe("Entry Point", () => {
    test("Should export classes", () => {
        expect(Library.HOTP).toBeDefined();
        expect(Library.TOTP).toBeDefined();
        expect(Library.Authenticator).toBeDefined();
    });

    test("Should export enum", () => {
        expect(Library.AuthenticatorType).toBeDefined();
    });
});