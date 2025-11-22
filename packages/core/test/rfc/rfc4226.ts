import { HashAlgorithms } from "../../src/enum/hash";

/**
 * Interface IRFC4226TestValues
 * used to represents the RFC 4226 test values
 *
 * @export
 * @interface IRFC4226TestValues
 */
export interface IRFC4226TestValues {
    /**
     * The hash algorithm of RFC 4226 test values
     *
     * @type {HashAlgorithms}
     * @memberof IRFC4226TestValues
     */
    algorithm: HashAlgorithms;

    /**
     * The ASCII secret of RFC 4226 test values
     *
     * @type {string}
     * @memberof IRFC4226TestValues
     */
    secret: string;

    /**
     * The HMAC digests of RFC 4226 test values
     *
     * @type {string[]}
     * @memberof IRFC4226TestValues
     */
    digests: string[];

    /**
     * The HOTP codes of RFC 4226 test values
     *
     * @type {string[]}
     * @memberof IRFC4226TestValues
     */
    codes: string[];
}

/**
 * The HOTP RFC 4226 test values
 * 
 * @type {IRFC4226TestValues}
 * @see https://datatracker.ietf.org/doc/html/rfc4226#page-32
 */
const RFC4226TestValues: IRFC4226TestValues = {
    algorithm: HashAlgorithms.SHA1,
    secret: "12345678901234567890",
    digests: [
        "cc93cf18508d94934c64b65d8ba7667fb7cde4b0",
        "75a48a19d4cbe100644e8ac1397eea747a2d33ab",
        "0bacb7fa082fef30782211938bc1c5e70416ff44",
        "66c28227d03a2d5529262ff016a1e6ef76557ece",
        "a904c900a64b35909874b33e61c5938a8e15ed1c",
        "a37e783d7b7233c083d4f62926c7a25f238d0316",
        "bc9cd28561042c83f219324d3c607256c03272ae",
        "a4fb960c0bc06e1eabb804e5b397cdc4b45596fa",
        "1b3c89f65e6c9e883012052823443f048b4332db",
        "1637409809a679dc698207310c8c7fc07290d9e5"
    ],
    codes: [
        "755224",
        "287082",
        "359152",
        "969429",
        "338314",
        "254676",
        "287922",
        "162583",
        "399871",
        "520489"
    ]
}

export default RFC4226TestValues;