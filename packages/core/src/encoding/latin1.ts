/**
 * Class Latin1
 * used to implements the latin1 encoding
 *
 * @class Latin1
 */
class Latin1 {
    /**
     * Encode the bytes to latin1 text
     *
     * @static
     * @param {Uint8Array<ArrayBuffer>} bytes The bytes to encode
     * @return {string}
     * @memberof Latin1
     */
    public static encode(bytes: Uint8Array<ArrayBuffer>): string {
        const value = new Array(bytes.length);

        for(let i = 0; i < bytes.length; i++) {
            value[i] = String.fromCharCode(bytes[i]);
        }
        
        return value.join("");
    }
    
    /**
     * Decode the latin1 text to bytes
     *
     * @static
     * @param {string} text The latin1 text to decode
     * @return {Uint8Array<ArrayBuffer>}
     * @memberof Latin1
     */
    public static decode(text: string): Uint8Array<ArrayBuffer> {
        const bytes = new Uint8Array(text.length);
        
        for(let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i);
            if(code > 255) {
                throw(new Error(`The latin1 character "${text[i]}" at position ${i + 1} is invalid`));
            }

            bytes[i] = code;
        }
        
        return bytes;
    }
}

export default Latin1;