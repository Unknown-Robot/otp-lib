import Base64 from "./base64";

/**
 * Class Base64URL
 * used to implements the base64url encoding
 *
 * @class Base64URL
 * @extends {Base64}
 * @see https://datatracker.ietf.org/doc/html/rfc4648#section-5
 */
class Base64URL extends Base64 {
    /**
     * Encode the bytes to base64url text
     *
     * @static
     * @param {Uint8Array<ArrayBuffer>} bytes The bytes to encode
     * @return {string}
     * @memberof Base64URL
     */
    public static encode(bytes: Uint8Array<ArrayBuffer>): string {
        const base64 = super.encode(bytes);

        return base64
            .replaceAll("+", "-")
            .replaceAll("/", "_")
            .replaceAll("=", "");
    }
    
    /**
     * Decode the base64url text to bytes
     *
     * @static
     * @param {string} text The base64url text to decode
     * @return {Uint8Array<ArrayBuffer>}
     * @memberof Base64URL
     */
    public static decode(text: string): Uint8Array<ArrayBuffer> {
        const base64 = text
            .replaceAll("-", "+")
            .replaceAll("_", "/");

        return super.decode(base64);
    }
}

export default Base64URL;