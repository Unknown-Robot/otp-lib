/**
 * Class Hex
 * used to implements the hexadecimal encoding
 *
 * @class Hex
 */
class Hex {
    /**
     * The alphabet of hexadecimal encoding
     *
     * @private
     * @static
     * @readonly
     * @type {string[]}
     * @memberof Hex
     */
    private static readonly alphabet: string[] = Array.from({ length: 256 }, (_, i) => (
        i.toString(16).padStart(2, "0")
    ));

    /**
     * Encode the bytes to hexadecimal text
     *
     * @static
     * @param {Uint8Array<ArrayBuffer>} bytes The bytes to encode
     * @return {string}
     * @memberof Hex
     */
    public static encode(bytes: Uint8Array<ArrayBuffer>): string {
        const value = new Array(bytes.length);

        for(let i = 0; i < bytes.length; i++) {
            value[i] = this.alphabet[bytes[i]];
        }

        return value.join("");
    }
    
    /**
     * Decode the hexadecimal text to bytes
     *
     * @static
     * @param {string} text The hexadecimal text to decode
     * @return {Uint8Array<ArrayBuffer>}
     * @memberof Hex
     */
    public static decode(text: string): Uint8Array<ArrayBuffer> {
        if(text.length % 2 !== 0) {
            throw(new Error("The hexadecimal text length must be even"));
        }

        const bytes = new Uint8Array(text.length / 2);

        for(let i = 0; i < text.length; i += 2) {
            const chunk = text.substring(i, i + 2).toLowerCase();
            if(!this.alphabet.includes(chunk)) {
                throw(new Error(`The hexadecimal character "${chunk}" at position ${i + 1} is invalid`));
            }

            bytes[i / 2] = parseInt(chunk, 16);
        }

        return bytes;
    }
}

export default Hex;