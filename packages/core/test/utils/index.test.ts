import { describe, expect, test } from "@jest/globals";

import * as Library from "../../src/utils";

describe("Export Utils", () => {
    test("Should export classes", () => {
        expect(Library.TypeGuard).toBeDefined();
    });
});