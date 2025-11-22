/**
 * Class Ascii
 * used to implements the ascii encoding
 *
 * @class Ascii
 */
class Ascii {
    /**
     * Encode the bytes to ascii text
     *
     * @static
     * @param {Uint8Array<ArrayBuffer>} bytes The bytes to encode
     * @return {string}
     * @memberof Ascii
     */
    public static encode(bytes: Uint8Array<ArrayBuffer>): string {
        const value = new Array(bytes.length);

        for(let i = 0; i < bytes.length; i++) {
            value[i] = String.fromCharCode(bytes[i] & 0x7F);
        }
        
        return value.join("");
    }
    
    /**
     * Decode the ascii text to bytes
     *
     * @static
     * @param {string} text The ascii text to decode
     * @return {Uint8Array<ArrayBuffer>}
     * @memberof Ascii
     */
    public static decode(text: string): Uint8Array<ArrayBuffer> {
        const bytes = new Uint8Array(text.length);
        
        for(let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i);
            if(code > 127) {
                throw(new Error(`The ascii character "${text[i]}" at position ${i + 1} is invalid`));
            }

            bytes[i] = code;
        }
        
        return bytes;
    }
}

export default Ascii;