import { jest, describe, expect, test, afterEach } from "@jest/globals";

import type { TAuthenticatorOptions } from "../src/types/authenticator";
import type { IHOTPOptions } from "@otp-lib/core";

import { AuthenticatorType } from "../src/enum/type";

import HOTPAuthenticator from "../src/hotp";
import { HOTP } from "@otp-lib/core";

describe("HMAC-Based One-Time Password Authenticator", () => {
    describe("Constructor", () => {
        test("Should use default option values", () => {
            const options: TAuthenticatorOptions<IHOTPOptions> = {
                account: "account@test.com"
            };

            const hotp = new HOTPAuthenticator(options);

            expect(hotp.getAccount()).toBe(options.account);
            expect(hotp.getIssuer()).toBeNull();
        });

        test("Should use defined option values", () => {
            const options: TAuthenticatorOptions<IHOTPOptions> = {
                account: "account@test.com",
                issuer: "Issuer"
            };

            const hotp = new HOTPAuthenticator(options);

            expect(hotp.getAccount()).toBe(options.account);
            expect(hotp.getIssuer()).toBe(options.issuer);
        });

        describe("Should throw if options is not a plain object", () => {
            const invalidOptions = [null, 123, "string", [], new Date()];

            test.each(invalidOptions)(`Should throw if options is "%s"`, (option) => {
                /* @ts-expect-error */
                expect(() => new HOTPAuthenticator(option)).toThrow("The options must be a plain object");
            });
        });
    });

    describe("Proxy methods", () => {
        const options: TAuthenticatorOptions<IHOTPOptions> = {
            account: "account"
        };

        options.lookAhead = 5;
        options.counter = 3;

        const authenticator = new HOTPAuthenticator(options);

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test("Should call proxy method setCounter", () => {
            const spy = jest.spyOn(HOTP.prototype, "setCounter");
            const authenticator = new HOTPAuthenticator(options);

            authenticator.setCounter(42);
            expect(spy).toHaveBeenCalledWith(42);
        });

        test("Should call proxy method getLookAhead", () => {
            const spy = jest.spyOn(HOTP.prototype, "getLookAhead");

            expect(authenticator.getLookAhead()).toBe(options.lookAhead);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        test("Should call proxy method getCounter", () => {
            const spy = jest.spyOn(HOTP.prototype, "getCounter");

            expect(authenticator.getCounter()).toBe(options.counter);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        test("Should call proxy method generate", async() => {
            const spy = jest.spyOn(HOTP.prototype, "generate");

            await authenticator.generate();

            expect(spy).toHaveBeenCalledTimes(1);
        });

        test("Should call proxy method verifyDelta", async() => {
            const spy = jest.spyOn(HOTP.prototype, "verifyDelta");

            const code = await authenticator.generate();
            const delta = await authenticator.verifyDelta(code);

            expect(spy).toHaveBeenCalledWith(code);
            expect(delta).toBe(0);
        });

        test("Should call proxy method verify", async() => {
            const spy = jest.spyOn(HOTP.prototype, "verify");

            const code = await authenticator.generate();
            const verify = await authenticator.verify(code);

            expect(spy).toHaveBeenCalledWith(code);
            expect(verify).toBe(true);
        });
    });

    describe("HOTP Authenticator URI", () => {
        test("Should return default HOTP Authenticator URI", () => {
            const options: TAuthenticatorOptions<IHOTPOptions> = {
                account: "account@test.com"
            };

            const authenticator = new HOTPAuthenticator(options);
            const uri = new URL(authenticator.toURI());
            
            expect(uri.host).toBe(AuthenticatorType.HOTP);
            expect(uri.searchParams.get("counter")).toBe("0");
        });

        test("Should return defined HOTP Authenticator URI", () => {
            const options: TAuthenticatorOptions<IHOTPOptions> = {
                account: "account@test.com"
            };

            options.counter = 451;

            const authenticator = new HOTPAuthenticator(options);
            const uri = new URL(authenticator.toURI());
            
            expect(uri.searchParams.get("counter")).toBe(options.counter.toString());
        });

        test("Should throw invalid type from HOTP Authenticator URI", () => {
            expect(() => HOTPAuthenticator.fromURI("otpauth://totp"))
                .toThrow(`The authenticator URI type is invalid`);
        });

        test("Should throw required counter from HOTP Authenticator URI", () => {
            expect(() => HOTPAuthenticator.fromURI("otpauth://hotp/account?secret=234567"))
                .toThrow(`The authenticator URI counter is required`);
        });

        describe("Should throw invalid counter from HOTP Authenticator URI", () => {
            const invalidCounter = [
                "otpauth://hotp/account?secret=234567&counter=",
                "otpauth://hotp/account?secret=234567&counter=abc"
            ];

            test.each(invalidCounter)(`Should throw invalid counter "%s"`, (uri) => {
                expect(() => HOTPAuthenticator.fromURI(uri))
                    .toThrow(`The authenticator URI counter is invalid`);
            });
        });

        test("Should return counter from HOTP Authenticator URI", () => {
            const authenticator = HOTPAuthenticator.fromURI("otpauth://hotp/account?secret=234567&counter=30");

            expect(authenticator.getCounter()).toBe(30);
        });
    });
});