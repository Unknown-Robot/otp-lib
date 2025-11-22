/**
 * Class Base32
 * used to implements the base32 encoding
 *
 * @class Base32
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-6
 */
class Base32 {
    /**
     * The alphabet of base32 encoding
     *
     * @private
     * @static
     * @readonly
     * @type {string}
     * @memberof Base32
     */
    private static readonly alphabet: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

    /**
     * The bits length per group of base32 encoding
     *
     * @private
     * @static
     * @readonly
     * @type {number}
     * @memberof Base32
     */
    private static readonly bitsPerGroup: number = 5;

    /**
     * The bits length per byte of base32 encoding
     *
     * @private
     * @static
     * @readonly
     * @type {number}
     * @memberof Base32
     */
    private static readonly bitsPerByte: number = 8;

    /**
     * The padding character of base32 encoding
     *
     * @private
     * @static
     * @readonly
     * @type {string}
     * @memberof Base32
     */
    private static readonly padding: string = "=";

    /**
     * Encode the bytes to base32 text
     *
     * @static
     * @param {Uint8Array<ArrayBuffer>} bytes The bytes to encode
     * @return {string}
     * @memberof Base32
     */
    public static encode(bytes: Uint8Array<ArrayBuffer>): string {
        let bits = 0, buffer = 0, result = "";

        for(const byte of bytes) {
            buffer = (buffer << this.bitsPerByte) | byte;
            bits += this.bitsPerByte;
            while(bits >= this.bitsPerGroup) {
                result += this.alphabet[(buffer >> (bits - this.bitsPerGroup)) & 0x1F];
                bits -= this.bitsPerGroup;
            }
        }

        if(bits > 0) {
            result += this.alphabet[(buffer << (this.bitsPerGroup - bits)) & 0x1F];
        }

        while(result.length % this.bitsPerByte !== 0) {
            result += this.padding;
        }

        return result;
    }
    
    /**
     * Decode the base32 text to bytes
     *
     * @static
     * @param {string} text The base32 text to decode
     * @return {Uint8Array<ArrayBuffer>}
     * @memberof Base32
     */
    public static decode(text: string): Uint8Array<ArrayBuffer> {
        const value = text.replaceAll(this.padding, "").toUpperCase();
        const length = (value.length * this.bitsPerGroup) / this.bitsPerByte;
        const bytes = new Uint8Array(length);
        let bits = 0, buffer = 0, index = 0;

        for(let i = 0; i < value.length; i++) {
            const character = this.alphabet.indexOf(value[i]);
            if(character === -1) {
                throw(new Error(`The base32 character "${value[i]}" at position ${i + 1} is invalid`));
            }
            
            buffer = (buffer << this.bitsPerGroup) | character;
            bits += this.bitsPerGroup;
            
            if(bits >= this.bitsPerByte) {
                bits -= this.bitsPerByte;
                bytes[index++] = (buffer >> bits) & 0xFF;
            }
        }

        return bytes;
    }
}

export default Base32;