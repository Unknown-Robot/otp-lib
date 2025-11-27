/**
 * Class TypeGuard
 * used to implements the type-guard methods
 *
 * @class TypeGuard
 */
class TypeGuard {
    /**
     * Check type guard if value in generic enum
     *
     * @static
     * @template T The template type of enumeration 
     * @param {unknown} value The value to check in enumeration
     * @param {object} enumeration The reference of enumeration
     * @return {value is T[keyof T]}
     * @memberof TypeGuard
     */
    public static isEnum<T extends object>(value: unknown, enumeration: T): value is T[keyof T] {
        return Object.values(enumeration).includes(value);
    }

    /**
     * Check type guard if value is key of object
     *
     * @static
     * @template T The template type of object
     * @param {PropertyKey} value The value to check is key of
     * @param {T} reference The reference of object
     * @return {value is keyof T}
     * @memberof TypeGuard
     */
    public static isKeyOf<T extends object>(value: PropertyKey, reference: T): value is keyof T {
        return reference.hasOwnProperty(value);
    }

    /**
     * Check type guard if value is array of specific type
     * 
     * @static
     * @template T The template type of array
     * @param {unknown} value The value to check is array of
     * @return {value is T[]}
     * @memberof TypeGuard
     */
    public static isArrayOf<T>(value: unknown, predicate: (value: unknown) => value is T): value is T[] {
        return TypeGuard.isArray<T>(value) && value.every(predicate);
    }

    /**
     * Check type guard if value is plain object
     * 
     * @static
     * @param {unknown} value The value to check is plain object
     * @return {value is object}
     * @memberof TypeGuard
     */
    public static isPlainObject(value: unknown): value is object {
        return typeof(value) === "object" && value !== null
            && Object.getPrototypeOf(value) === Object.prototype;
    }

    /**
     * Check type guard if value is array
     *
     * @static
     * @template T The template type of array
     * @param {unknown} value The value to check is array
     * @return {value is T[]}
     * @memberof TypeGuard
     */
    public static isArray<T>(value: unknown): value is T[] {
        return Array.isArray(value);
    }

    /**
     * Check type guard if value is non-negative integer (>= 0)
     * 
     * @static
     * @param {unknown} value The value to check is non-negative integer
     * @return {value is number}
     * @memberof TypeGuard
     */
    public static isNonNegativeInteger(value: unknown): value is number {
        return TypeGuard.isInteger(value) && value >= 0;
    }

    /**
     * Check type guard if value is positive integer (> 0)
     * 
     * @static
     * @param {unknown} value The value to check is positive integer
     * @return {value is number}
     * @memberof TypeGuard
     */
    public static isPositiveInteger(value: unknown): value is number {
        return TypeGuard.isInteger(value) && value > 0;
    }

    /**
     * Check type guard if value is integer
     * 
     * @static
     * @param {unknown} value The value to check is integer
     * @return {value is number}
     * @memberof TypeGuard
     */
    public static isInteger(value: unknown): value is number {
        return Number.isInteger(value);
    }

    /**
     * Check type guard if value is string
     * 
     * @static
     * @param {unknown} value The value to check is string
     * @return {value is string}
     * @memberof TypeGuard
     */
    public static isString(value: unknown): value is string {
        return typeof(value) === "string";
    };
}

export default TypeGuard;