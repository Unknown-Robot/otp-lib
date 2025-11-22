/**
 * Interface IEncoding
 * used to represents the encoding class
 *
 * @export
 * @interface IEncoding
 */
export interface IEncoding {
    /**
     * Encode the bytes to encoding text
     *
     * @param {Uint8Array<ArrayBuffer>} bytes The bytes to encode
     * @return {string}
     * @memberof IEncoding
     */
    encode(bytes: Uint8Array<ArrayBuffer>): string;

    /**
     * Decode the encoding text to bytes
     *
     * @param {string} text The encoding text to decode
     * @return {Uint8Array<ArrayBuffer>}
     * @memberof IEncoding
     */
    decode(text: string): Uint8Array<ArrayBuffer>;
}