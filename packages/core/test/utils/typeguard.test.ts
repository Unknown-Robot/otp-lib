import { describe, expect, test } from "@jest/globals";

import TypeGuard from "../../src/utils/typeguard";

describe("Type Guard", () => {
    describe("isKeyOf", () => {
        const keyObject = { name: "Alice", age: 30 };
        enum Roles { ADMIN = "admin", USER = "user" }
        enum Empty {}

        test("Should return true for existing keys", () => {
            expect(TypeGuard.isKeyOf("name", keyObject)).toBe(true);
            expect(TypeGuard.isKeyOf("age", keyObject)).toBe(true);
        });

        test("Should return true for existing enum keys", () => {
            expect(TypeGuard.isKeyOf("ADMIN", Roles)).toBe(true);
            expect(TypeGuard.isKeyOf("USER", Roles)).toBe(true);
        });

        test("Should return false for non-existing keys", () => {
            expect(TypeGuard.isKeyOf("email", keyObject)).toBe(false);
            expect(TypeGuard.isKeyOf("constructor", keyObject)).toBe(false);
        });

        test("Should return false for non-existing enum keys", () => {
            expect(TypeGuard.isKeyOf("admin", Roles)).toBe(false);
            expect(TypeGuard.isKeyOf("guest", Roles)).toBe(false);
        });
        
        test("Should return false with empty objects", () => {
             expect(TypeGuard.isKeyOf("any", {})).toBe(false);
        });

        test("Should return false with empty enum", () => {
             expect(TypeGuard.isKeyOf("any", Empty)).toBe(false);
        });
    });

    describe("isEnum", () => {
        enum StringEnum { Red = "RED", Blue = "BLUE" }
        enum NumericEnum { Zero = 0, One = 1 }

        test("Should return true for string enum values", () => {
            expect(TypeGuard.isEnum("RED", StringEnum)).toBe(true);
            expect(TypeGuard.isEnum("BLUE", StringEnum)).toBe(true);
        });

        test("Should return true for numeric enum values", () => {
            expect(TypeGuard.isEnum(0, NumericEnum)).toBe(true);
            expect(TypeGuard.isEnum(1, NumericEnum)).toBe(true);
        });

        test("Should return false for invalid enum values", () => {
            expect(TypeGuard.isEnum("GREEN", StringEnum)).toBe(false);
            expect(TypeGuard.isEnum(2, NumericEnum)).toBe(false);
            expect(TypeGuard.isEnum(null, StringEnum)).toBe(false);
        });
    });

    describe("isArrayOf", () => {
        test("Should return true for array of specific type", () => {
            expect(TypeGuard.isArrayOf(["a", "b", "c"], TypeGuard.isString)).toBe(true);
            expect(TypeGuard.isArrayOf([1, 2, 3], TypeGuard.isInteger)).toBe(true);
        });

        test("Should return true for empty array", () => {
            expect(TypeGuard.isArrayOf([], TypeGuard.isString)).toBe(true);
        });

        test("Should return false if at least one element doesn't match", () => {
            expect(TypeGuard.isArrayOf(["a", 1, "c"], TypeGuard.isString)).toBe(false);
        });

        test("Should return false if value is not array", () => {
            expect(TypeGuard.isArrayOf("not array", TypeGuard.isString)).toBe(false);
            expect(TypeGuard.isArrayOf(null, TypeGuard.isString)).toBe(false);
        });
    });

    describe("isArray", () => {
        test("Should return true for arrays", () => {
            expect(TypeGuard.isArray([])).toBe(true);
            expect(TypeGuard.isArray([1, 2, 3])).toBe(true);
            expect(TypeGuard.isArray(new Array(5))).toBe(true);
        });

        test("Should return false for non-array values", () => {
            expect(TypeGuard.isArray({})).toBe(false);
            expect(TypeGuard.isArray("[]")).toBe(false);
            expect(TypeGuard.isArray(null)).toBe(false);
            expect(TypeGuard.isArray(123)).toBe(false);
        });
    });

    describe("isPlainObject", () => {
        test("Should return true for plain objects", () => {
            expect(TypeGuard.isPlainObject({})).toBe(true);
            expect(TypeGuard.isPlainObject({ key: "value" })).toBe(true);
            expect(TypeGuard.isPlainObject(new Object())).toBe(true);
        });

        test("Should return false for non-plain objects", () => {
            expect(TypeGuard.isPlainObject(null)).toBe(false);
            expect(TypeGuard.isPlainObject([])).toBe(false);
            expect(TypeGuard.isPlainObject(new Date())).toBe(false);
            expect(TypeGuard.isPlainObject(/regex/)).toBe(false);
        });

        test("Should return false for primitives", () => {
            expect(TypeGuard.isPlainObject("string")).toBe(false);
            expect(TypeGuard.isPlainObject(123)).toBe(false);
            expect(TypeGuard.isPlainObject(true)).toBe(false);
            expect(TypeGuard.isPlainObject(undefined)).toBe(false);
        });
    });

    describe("isNonNegativeInteger", () => {
        test("Should return true for zero", () => {
            expect(TypeGuard.isNonNegativeInteger(0)).toBe(true);
        });

        test("Should return true for positive integers", () => {
            expect(TypeGuard.isNonNegativeInteger(1)).toBe(true);
            expect(TypeGuard.isNonNegativeInteger(999)).toBe(true);
            expect(TypeGuard.isNonNegativeInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
        });

        test("Should return false for negative integers", () => {
            expect(TypeGuard.isNonNegativeInteger(-1)).toBe(false);
            expect(TypeGuard.isNonNegativeInteger(-100)).toBe(false);
            expect(TypeGuard.isNonNegativeInteger(Number.MIN_SAFE_INTEGER)).toBe(false);
        });

        test("Should return false for floats", () => {
            expect(TypeGuard.isNonNegativeInteger(0.1)).toBe(false);
            expect(TypeGuard.isNonNegativeInteger(10.5)).toBe(false);
        });

        test("Should return false for non-number types", () => {
            expect(TypeGuard.isNonNegativeInteger("0")).toBe(false);
            expect(TypeGuard.isNonNegativeInteger(null)).toBe(false);
            expect(TypeGuard.isNonNegativeInteger(NaN)).toBe(false);
            expect(TypeGuard.isNonNegativeInteger(Infinity)).toBe(false);
        });
    });

    describe("isPositiveInteger", () => {
        test("Should return true for positive integers", () => {
            expect(TypeGuard.isPositiveInteger(1)).toBe(true);
            expect(TypeGuard.isPositiveInteger(100)).toBe(true);
        });

        test("Should return false for zero", () => {
            expect(TypeGuard.isPositiveInteger(0)).toBe(false);
        });

        test("Should return false for negative integers", () => {
            expect(TypeGuard.isPositiveInteger(-1)).toBe(false);
            expect(TypeGuard.isPositiveInteger(-100)).toBe(false);
        });

        test("Should return false for floats", () => {
            expect(TypeGuard.isPositiveInteger(1.5)).toBe(false);
        });

        test("Should return false for non-number types", () => {
            expect(TypeGuard.isPositiveInteger("1")).toBe(false);
            expect(TypeGuard.isPositiveInteger(null)).toBe(false);
            expect(TypeGuard.isPositiveInteger(NaN)).toBe(false);
        });
    });

    describe("isInteger", () => {
        test("Should return true for integer values", () => {
            expect(TypeGuard.isInteger(0)).toBe(true);
            expect(TypeGuard.isInteger(10)).toBe(true);
            expect(TypeGuard.isInteger(-5)).toBe(true);
            expect(TypeGuard.isInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
        });

        test("Should return false for non-integer numbers", () => {
            expect(TypeGuard.isInteger(10.5)).toBe(false);
            expect(TypeGuard.isInteger(Math.PI)).toBe(false);
        });

        test("Should return false for non-number values or special numbers", () => {
            expect(TypeGuard.isInteger("10")).toBe(false);
            expect(TypeGuard.isInteger(null)).toBe(false);
            expect(TypeGuard.isInteger(NaN)).toBe(false);
            expect(TypeGuard.isInteger(Infinity)).toBe(false);
        });
    });

    describe("isString", () => {
        test("Should return true for string values", () => {
            expect(TypeGuard.isString("Hello")).toBe(true);
            expect(TypeGuard.isString("")).toBe(true);
            expect(TypeGuard.isString(String("Test"))).toBe(true);
            expect(TypeGuard.isString(String())).toBe(true);
        });

        test("Should return false for non-string values", () => {
            expect(TypeGuard.isString(123)).toBe(false);
            expect(TypeGuard.isString(true)).toBe(false);
            expect(TypeGuard.isString(null)).toBe(false);
            expect(TypeGuard.isString(undefined)).toBe(false);
            expect(TypeGuard.isString({})).toBe(false);
            expect(TypeGuard.isString([])).toBe(false);
        });
    });
});