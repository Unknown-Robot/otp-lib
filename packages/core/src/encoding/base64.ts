/**
 * Class Base64
 * used to implements the base64 encoding
 *
 * @class Base64
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-4
 */
class Base64 {
    /**
     * Encode the bytes to base64 text
     *
     * @static
     * @param {Uint8Array<ArrayBuffer>} bytes The bytes to encode
     * @return {string}
     * @memberof Base64
     */
    public static encode(bytes: Uint8Array<ArrayBuffer>): string {
        const value = new Array(bytes.length);

        for(let i = 0; i < bytes.length; i++) {
            value[i] = String.fromCharCode(bytes[i]);
        }
        
        return btoa(value.join(""));
    }
    
    /**
     * Decode the base64 text to bytes
     *
     * @static
     * @param {string} text The base64 text to decode
     * @return {Uint8Array<ArrayBuffer>}
     * @memberof Base64
     */
    public static decode(text: string): Uint8Array<ArrayBuffer> {

        const binary = atob(text);
        const bytes = new Uint8Array(binary.length);

        for(let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }

        return bytes;
    }
}

export default Base64;