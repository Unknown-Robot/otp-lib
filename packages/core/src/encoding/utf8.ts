/**
 * Class Utf8
 * used to implements the utf-8 encoding
 *
 * @class Utf8
 */
class Utf8 {
    /**
     * The instance of utf-8 text decoder
     *
     * @private
     * @static
     * @readonly
     * @type {TextDecoder}
     * @memberof Utf8
     */
    private static readonly decoder: TextDecoder = new TextDecoder("utf-8");

    /**
     * The instance of utf-8 text encoder
     *
     * @private
     * @static
     * @readonly
     * @type {TextEncoder}
     * @memberof Utf8
     */
    private static readonly encoder: TextEncoder = new TextEncoder();

    /**
     * Encode the bytes to utf-8 text
     *
     * @static
     * @param {Uint8Array<ArrayBuffer>} bytes The bytes to encode
     * @return {string}
     * @memberof Utf8
     */
    public static encode(bytes: Uint8Array<ArrayBuffer>): string {
        return this.decoder.decode(bytes);
    }
    
    /**
     * Decode the utf-8 text to bytes
     *
     * @static
     * @param {string} text The utf-8 text to decode
     * @return {Uint8Array<ArrayBuffer>}
     * @memberof Utf8
     */
    public static decode(text: string): Uint8Array<ArrayBuffer> {
        return this.encoder.encode(text);
    }
}

export default Utf8;