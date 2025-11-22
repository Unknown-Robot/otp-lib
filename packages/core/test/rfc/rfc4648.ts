/**
 * Interface IRFC4648TestVector
 * used to represents the RFC 4648 test vectors
 *
 * @export
 * @interface IRFC4648TestVector
 */
export interface IRFC4648TestVector {
    /**
     * The ASCII input of RFC 4648 test vector
     *
     * @type {string}
     * @memberof IRFC4648TestVector
     */
    input: string;

    /**
     * The output of RFC 4648 test vector
     *
     * @type {string}
     * @memberof IRFC4648TestVector
     */
    output: string;
}

/**
 * The base32 test vectors of RFC 4648 
 * 
 * @export
 * @type {IRFC4648TestVector[]}
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-10
 */
export const Base32TestVectors: IRFC4648TestVector[] = [
    {
        input: "foobar",
        output: "MZXW6YTBOI======"
    },
    {
        input: "fooba",
        output: "MZXW6YTB"
    },
    {
        input: "foob",
        output: "MZXW6YQ="
    },
    {
        input: "foo",
        output: "MZXW6==="
    },
    {
        input: "fo",
        output: "MZXQ===="
    },
    {
        input: "f",
        output: "MY======"
    },
    {
        input: "",
        output: ""
    }
];

/**
 * The base64 test vectors of RFC 4648 
 * 
 * @export
 * @type {IRFC4648TestVector[]}
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-10
 */
export const Base64TestVectors: IRFC4648TestVector[] = [
    {
        input: "foobar",
        output: "Zm9vYmFy"
    },
    {
        input: "fooba",
        output: "Zm9vYmE="
    },
    {
        input: "foob",
        output: "Zm9vYg=="
    },
    {
        input: "foo",
        output: "Zm9v"
    },
    {
        input: "fo",
        output: "Zm8="
    },
    {
        input: "f",
        output: "Zg=="
    },
    {
        input: "",
        output: ""
    }
];