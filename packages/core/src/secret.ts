import type { IEncoding } from "./types/encoding";

import Base64URL from "./encoding/base64url";
import Base64 from "./encoding/base64";
import Base32 from "./encoding/base32";
import Latin1 from "./encoding/latin1";
import Ascii from "./encoding/ascii";
import Utf8 from "./encoding/utf8";
import Hex from "./encoding/hex";

import TypeGuard from "./utils/typeguard";

/**
 * Class Secret
 * used to implements the secret 
 *
 * @class Secret
 */
class Secret {
    /**
     * The raw binary of secret
     *
     * @private
     * @readonly
     * @type {Uint8Array<ArrayBuffer>}
     * @memberof Secret
     */
    private readonly bytes: Uint8Array<ArrayBuffer>;

    /**
     * Constructor of Secret class
     * 
     * @private
     * @param {Uint8Array<ArrayBuffer>} bytes The raw bytes of secret
     * @memberof Secret
     */
    private constructor(bytes: Uint8Array<ArrayBuffer>) {
        if(!(bytes instanceof Uint8Array)) {
            throw(new Error("The bytes must be a instance of Uint8Array class"));
        }

        this.bytes = new Uint8Array(bytes);
    }

    /**
     * Create Secret from text encoder
     *
     * @private
     * @static
     * @param {string} secret The encoding text of secret
     * @param {IEncoding} encoder The encoder of secret
     * @return {Secret}
     * @memberof Secret
     */
    private static createFrom(secret: string, encoder: IEncoding): Secret {
        if(!TypeGuard.isString(secret)) {
            throw(new Error("The secret must be a string"));
        }

        return new this(encoder.decode(secret));
    }

    /**
     * Create Secret from bytes length
     *
     * @static
     * @param {number} [length=20] The bytes length of secret 
     * @return {Secret}
     * @memberof Secret
     */
    public static create(length: number = 20): Secret {
        const bytes = new Uint8Array(length);
    
        return new this(
            globalThis.crypto.getRandomValues(bytes)
        );
    }

    /**
     * Create Secret from raw binary
     *
     * @static
     * @param {Uint8Array<ArrayBuffer>} secret The raw bytes of secret
     * @return {Secret}
     * @memberof Secret
     */
    public static fromBytes(secret: Uint8Array<ArrayBuffer>): Secret {
        return new this(secret);
    }

    /**
     * Create Secret from base64url text
     *
     * @static
     * @param {string} secret The base64url text of secret
     * @return {Secret}
     * @memberof Secret
     */
    public static fromBase64URL(secret: string): Secret {
        return this.createFrom(secret, Base64URL);
    }

    /**
     * Create Secret from base64 text
     *
     * @static
     * @param {string} secret The base64 text of secret
     * @return {Secret}
     * @memberof Secret
     */
    public static fromBase64(secret: string): Secret {
        return this.createFrom(secret, Base64);
    }

    /**
     * Create Secret from base32 text
     *
     * @static
     * @param {string} secret The base32 text of secret
     * @return {Secret}
     * @memberof Secret
     */
    public static fromBase32(secret: string): Secret {
        return this.createFrom(secret, Base32);
    }

    /**
     * Create Secret from latin1 text
     *
     * @static
     * @param {string} secret The latin1 text of secret
     * @return {Secret}
     * @memberof Secret
     */
    public static fromLatin1(secret: string): Secret {
        return this.createFrom(secret, Latin1);
    }

    /**
     * Create Secret from ascii text
     *
     * @static
     * @param {string} secret The ascii text of secret
     * @return {Secret}
     * @memberof Secret
     */
    public static fromAscii(secret: string): Secret {
        return this.createFrom(secret, Ascii);
    }

    /**
     * Create Secret from utf8 text
     *
     * @static
     * @param {string} secret The utf8 text of secret
     * @return {Secret}
     * @memberof Secret
     */
    public static fromUtf8(secret: string): Secret {
        return this.createFrom(secret, Utf8);
    }

    /**
     * Create Secret from hexadecimal text
     *
     * @static
     * @param {string} secret The hexadecimal text of secret
     * @return {Secret}
     * @memberof Secret
     */
    public static fromHex(secret: string): Secret {
        return this.createFrom(secret, Hex);
    }

    /**
     * Get the raw binary of secret
     *
     * @return {Uint8Array<ArrayBuffer>}
     * @memberof Secret
     */
    public toBytes(): Uint8Array<ArrayBuffer> {
        return new Uint8Array(this.bytes);
    }

    /**
     * Get the base64url text of secret
     *
     * @return {string}
     * @memberof Secret
     */
    public toBase64URL(): string {
        return Base64URL.encode(this.bytes);
    }

    /**
     * Get the base64 text of secret
     *
     * @return {string}
     * @memberof Secret
     */
    public toBase64(): string {
        return Base64.encode(this.bytes);
    }

    /**
     * Get the base32 text of secret
     *
     * @return {string}
     * @memberof Secret
     */
    public toBase32(): string {
        return Base32.encode(this.bytes);
    }

    /**
     * Get the latin1 text of secret
     *
     * @return {string}
     * @memberof Secret
     */
    public toLatin1(): string {
        return Latin1.encode(this.bytes);
    }

    /**
     * Get the ascii text of secret
     *
     * @return {string}
     * @memberof Secret
     */
    public toAscii(): string {
        return Ascii.encode(this.bytes);
    }

    /**
     * Get the utf8 text of secret
     *
     * @return {string}
     * @memberof Secret
     */
    public toUtf8(): string {
        return Utf8.encode(this.bytes);
    }

    /**
     * Get the hexadecimal text of secret
     *
     * @return {string}
     * @memberof Secret
     */
    public toHex(): string {
        return Hex.encode(this.bytes);
    }
}

export default Secret;