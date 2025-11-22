import { jest, describe, expect, test, afterEach } from "@jest/globals";

import type { TAuthenticatorOptions } from "../src/types/authenticator";
import type { IOTPOptions } from "@otp-lib/core";

import { OTP, Secret, HashAlgorithms } from "@otp-lib/core";

import Authenticator from "../src/authenticator";

class TestAuthenticator extends Authenticator<OTP, IOTPOptions> {
    public static fromURL(url: URL): TAuthenticatorOptions<IOTPOptions> {
        return super.fromURL(url);
    }

    public toURL(): URL {
        return super.toURL();
    }
}

describe("Authenticator", () => {
    const otp = new OTP();

    describe("Constructor", () => {
        test("Should use default option values", () => {
            const options: TAuthenticatorOptions<IOTPOptions> = {
                account: "account"
            };

            const authenticator = new TestAuthenticator(otp, options);

            expect(authenticator.getIssuer()).toBeNull();
        });

        test("Should use defined option values", () => {
            const options: TAuthenticatorOptions<IOTPOptions> = {
                account: "account",
                issuer: "Issuer"
            };

            const authenticator = new TestAuthenticator(otp, options);

            expect(authenticator.getAccount()).toBe(options.account);
            expect(authenticator.getIssuer()).toBe(options.issuer);
        });

        test("Should throw if account is not string", () => {
            /* @ts-expect-error */
            expect(() => new TestAuthenticator(otp, { account: 123 })).toThrow();
            /* @ts-expect-error */
            expect(() => new TestAuthenticator(otp, { account: null })).toThrow();
        });

        test("Should throw if issuer is not string", () => {
            /* @ts-expect-error */
            expect(() => new TestAuthenticator(otp, { account: "account", issuer: 123 })).toThrow();
        });
    });

    describe("Proxy methods", () => {
        const options: TAuthenticatorOptions<IOTPOptions> = {
            account: "account"
        };

        options.algorithm = HashAlgorithms.SHA512;
        options.secret = Secret.create();
        options.digits = 8;

        const authenticator = new Authenticator(
            new OTP(options), options
        );

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test("Should call proxy method getAlgorithm", () => {
            const spy = jest.spyOn(OTP.prototype, "getAlgorithm");

            expect(authenticator.getAlgorithm()).toBe(options.algorithm);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        test("Should call proxy method getDigits", () => {
            const spy = jest.spyOn(OTP.prototype, "getDigits");

            expect(authenticator.getDigits()).toBe(options.digits);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        test("Should call proxy method getSecret", () => {
            const spy = jest.spyOn(OTP.prototype, "getSecret");

            expect(authenticator.getSecret()).toBe(options.secret);
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });

    describe("Authenticator URI", () => {
        test("Should return default Authenticator URI", () => {
            const options: TAuthenticatorOptions<IOTPOptions> = {
                account: "account"
            };

            const authenticator = new TestAuthenticator(otp, options);
            const uri = authenticator.toURL();
            
            expect(uri.searchParams.get("algorithm")).toBe(HashAlgorithms.SHA1.replace("-", ""));
            expect(uri.searchParams.get("secret")).not.toBe(null);
            expect(uri.searchParams.get("digits")).toBe("6");
            expect(uri.protocol).toBe("otpauth:");
        });

        test("Should return defined Authenticator URI", () => {
            const options: TAuthenticatorOptions<IOTPOptions> = {
                account: "account"
            };

            options.algorithm = HashAlgorithms.SHA512;
            options.secret = Secret.create();
            options.issuer = "issuer";
            options.digits = 8;

            const authenticator = new TestAuthenticator(new OTP(options), options);
            const uri = authenticator.toURL();
            
            expect(uri.searchParams.get("algorithm")).toBe(options.algorithm.replace("-", ""));
            expect(uri.searchParams.get("secret")).toBe(options.secret.toBase32());
            expect(uri.searchParams.get("digits")).toBe(options.digits.toString());
            expect(uri.searchParams.get("issuer")).toBe(options.issuer);

            expect(uri.pathname).toBe(`/${options.issuer}:${options.account}`);
        });

        test("Should return only account Authenticator URI", () => {
            const options: TAuthenticatorOptions<IOTPOptions> = {
                account: "account"
            };

            const authenticator = new TestAuthenticator(otp, options);
            const url = authenticator.toURL();
            
            expect(url.searchParams.get("issuer")).toBeNull();
            expect(url.pathname).toBe(`/${options.account}`);
        });

        test("Should return encoded account Authenticator URI", () => {
            const options: TAuthenticatorOptions<IOTPOptions> = {
                account: "account@test.com"
            };

            const authenticator = new TestAuthenticator(otp, options);
            const uri = authenticator.toURL();
            
            expect(uri.pathname).toBe(`/${encodeURIComponent(options.account)}`);
        });

        test("Should return encoded issuer:account Authenticator URI", () => {
            const options: TAuthenticatorOptions<IOTPOptions> = {
                account: "account@test.com"
            };

            options.issuer = "issuer corp";

            const authenticator = new TestAuthenticator(otp, options);
            const uri = authenticator.toURL();
            
            expect(uri.pathname).toBe(`/${[options.issuer, options.account].map(encodeURIComponent).join(":")}`);
        });

        test("Should throw invalid protocol from Authenticator URI", () => {
            expect(() => TestAuthenticator.fromURL(new URL("https://otp")))
                .toThrow("The authenticator URI protocol is invalid");
        });

        test("Should throw invalid type from Authenticator URI", () => {
            expect(() => TestAuthenticator.fromURL(new URL("otpauth://unknown/")))
                .toThrow("The authenticator URI type is invalid");
        });

        describe("Should throw invalid label from Authenticator URI", () => {
            const invalidLabel = [
                new URL(`otpauth://hotp`),
                new URL(`otpauth://hotp/`)
            ];

            test.each(invalidLabel)(`Should throw invalid label "%s"`, (url) => {                
                expect(() => TestAuthenticator.fromURL(url))
                    .toThrow("The authenticator URI label is invalid");
            });
        });

        describe("Should throw required secret from Authenticator URI", () => {
            const invalidSecret = [
                new URL("otpauth://hotp/account"),
                new URL("otpauth://hotp/account?secret=")
            ];

            test.each(invalidSecret)(`Should throw required secret "%s"`, (url) => {
                expect(() => TestAuthenticator.fromURL(url))
                    .toThrow("The authenticator URI secret is required");
            });
        });

        test("Should throw invalid base32 secret from Authenticator URI", () => {
            const url = new URL("otpauth://hotp/account?secret=0234567");

            expect(() => TestAuthenticator.fromURL(url))
                .toThrow(`The base32 character "0" at position 1 is invalid`);
        });

        test("Should throw not supported algorithm from Authenticator URI", () => {
            const url = new URL("otpauth://hotp/account?secret=234567&algorithm=MD5");

            expect(() => TestAuthenticator.fromURL(url))
                .toThrow("The authenticator URI algorithm is not supported");
        });

        describe("Should throw invalid digits from Authenticator URI", () => {
            const invalidDigits = ["test", "0", "-9", "0.5"].map((digits) => (
                new URL(`otpauth://hotp/account?secret=234567&digits=${digits}`)
            ));

            test.each(invalidDigits)(`Should throw invalid digits "%s"`, (url) => {                
                expect(() => TestAuthenticator.fromURL(url))
                    .toThrow("The authenticator URI digits is invalid");
            });
        });

        test("Should return only account from Authenticator URI", () => {
            const options = TestAuthenticator.fromURL(new URL("otpauth://hotp/account?secret=234567"));

            expect(options.account).toBe("account");
            expect(options.issuer).toBeUndefined();
        });

        test("Should return issuer parameter from Authenticator URI", () => {
            const options = TestAuthenticator.fromURL(new URL("otpauth://hotp/oldIssuer:account?secret=234567&issuer=newIssuer"));

            expect(options.account).toBe("account");
            expect(options.issuer).toBe("newIssuer");
        });

        test("Should return issuer:account from Authenticator URI", () => {
            const options = TestAuthenticator.fromURL(new URL("otpauth://hotp/issuer:account?secret=234567"));

            expect(options.account).toBe("account");
            expect(options.issuer).toBe("issuer");
        });

        test("Should return decoded account from Authenticator URI", () => {
            const options = TestAuthenticator.fromURL(new URL("otpauth://hotp/space%20account?secret=234567"));

            expect(options.account).toBe("space account");
        });

        test("Should return decoded issuer:account from Authenticator URI", () => {
            const options = TestAuthenticator.fromURL(new URL("otpauth://hotp/space%20issuer:space%20account?secret=234567"));

            expect(options.account).toBe("space account");
            expect(options.issuer).toBe("space issuer");
        });

        test("Should return secret from Authenticator URI", () => {
            const options = TestAuthenticator.fromURL(new URL("otpauth://hotp/account?secret=234567"));
            const secret = Secret.fromBase32("234567");

            expect(options.secret?.toBytes()).toStrictEqual(secret.toBytes());
        });

        test("Should return algorithm from Authenticator URI", () => {
            const options = TestAuthenticator.fromURL(new URL("otpauth://hotp/account?secret=234567&algorithm=SHA512"));

            expect(options.algorithm).toBe(HashAlgorithms.SHA512);
        });

        test("Should return digits from Authenticator URI", () => {
            const options = TestAuthenticator.fromURL(new URL("otpauth://hotp/account?secret=234567&digits=8"));

            expect(options.digits).toBe(8);
        });
    });
});