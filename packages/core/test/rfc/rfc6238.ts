import { HashAlgorithms } from "../../src/enum/hash";

/**
 * Interface IRFC6238TestVector
 * used to represents the RFC 6238 test vectors
 *
 * @export
 * @interface IRFC6238TestVector
 */
export interface IRFC6238TestVector {
    /**
     * The hash algorithm of RFC 6238 test vector
     *
     * @type {HashAlgorithms}
     * @memberof IRFC6238TestVector
     */
    algorithm: HashAlgorithms;

    /**
     * The Unix timestamp of RFC 6238 test vector
     *
     * @type {number}
     * @memberof IRFC6238TestVector
     */
    timestamp: number;

    /**
     * The ASCII secret of RFC 6238 test vector
     *
     * @type {string}
     * @memberof IRFC6238TestVector
     */
    secret: string;

    /**
     * The TOTP code of RFC 6238 test vector
     *
     * @type {string}
     * @memberof IRFC6238TestVector
     */
    code: string;
}

/**
 * The list of TOTP RFC 6238 test vectors
 * 
 * @type {IRFC6238TestVector[]}
 * @see https://datatracker.ietf.org/doc/html/rfc6238#appendix-A
 * @see https://datatracker.ietf.org/doc/html/rfc6238#appendix-B
 */
const RFC6238TestVectors: IRFC6238TestVector[] = [
    {
        secret: "12345678901234567890",
        algorithm: HashAlgorithms.SHA1,
        code: "94287082",
        timestamp: 59
    },
    {
        secret: "12345678901234567890123456789012",
        algorithm: HashAlgorithms.SHA256,
        code: "46119246",
        timestamp: 59
    },
    {
        secret: "1234567890123456789012345678901234567890123456789012345678901234",
        algorithm: HashAlgorithms.SHA512,
        code: "90693936",
        timestamp: 59
    },
    {
        secret: "12345678901234567890",
        algorithm: HashAlgorithms.SHA1,
        timestamp: 1111111109,
        code: "07081804"
    },
    {
        secret: "12345678901234567890123456789012",
        algorithm: HashAlgorithms.SHA256,
        timestamp: 1111111109,
        code: "68084774"
    },
    {
        secret: "1234567890123456789012345678901234567890123456789012345678901234",
        algorithm: HashAlgorithms.SHA512,
        timestamp: 1111111109,
        code: "25091201"
    },
    {
        secret: "12345678901234567890",
        algorithm: HashAlgorithms.SHA1,
        timestamp: 1111111111,
        code: "14050471"
    },
    {
        secret: "12345678901234567890123456789012",
        algorithm: HashAlgorithms.SHA256,
        timestamp: 1111111111,
        code: "67062674"
    },
    {
        secret: "1234567890123456789012345678901234567890123456789012345678901234",
        algorithm: HashAlgorithms.SHA512,
        timestamp: 1111111111,
        code: "99943326"
    },
    {
        secret: "12345678901234567890",
        algorithm: HashAlgorithms.SHA1,
        timestamp: 1234567890,
        code: "89005924"
    },
    {
        secret: "12345678901234567890123456789012",
        algorithm: HashAlgorithms.SHA256,
        timestamp: 1234567890,
        code: "91819424"
    },
    {
        secret: "1234567890123456789012345678901234567890123456789012345678901234",
        algorithm: HashAlgorithms.SHA512,
        timestamp: 1234567890,
        code: "93441116"
    },
    {
        secret: "12345678901234567890",
        algorithm: HashAlgorithms.SHA1,
        timestamp: 2000000000,
        code: "69279037"
    },
    {
        secret: "12345678901234567890123456789012",
        algorithm: HashAlgorithms.SHA256,
        timestamp: 2000000000,
        code: "90698825"
    },
    {
        secret: "1234567890123456789012345678901234567890123456789012345678901234",
        algorithm: HashAlgorithms.SHA512,
        timestamp: 2000000000,
        code: "38618901"
    },
    {
        secret: "12345678901234567890",
        algorithm: HashAlgorithms.SHA1,
        timestamp: 20000000000,
        code: "65353130"
    },
    {
        secret: "12345678901234567890123456789012",
        algorithm: HashAlgorithms.SHA256,
        timestamp: 20000000000,
        code: "77737706"
    },
    {
        secret: "1234567890123456789012345678901234567890123456789012345678901234",
        algorithm: HashAlgorithms.SHA512,
        timestamp: 20000000000,
        code: "47863826"
    }
];

export default RFC6238TestVectors;