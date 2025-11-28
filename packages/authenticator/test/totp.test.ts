import { jest, describe, expect, test, afterEach, beforeEach } from "@jest/globals";

import type { TAuthenticatorOptions } from "../src/types/authenticator";
import type { ITOTPOptions } from "@otp-lib/core";

import { AuthenticatorType } from "../src/enum/type";

import TOTPAuthenticator from "../src/totp";

import { TOTP } from "@otp-lib/core";

describe("Time-Based One-Time Password Authenticator", () => {
    describe("Constructor", () => {
        test("Should use default option values", () => {
            const options: TAuthenticatorOptions<ITOTPOptions> = {
                account: "account@test.com"
            };

            const totp = new TOTPAuthenticator(options);

            expect(totp.getAccount()).toBe(options.account);
            expect(totp.getIssuer()).toBe(null);
        });

        test("Should use defined option values", () => {
            const options: TAuthenticatorOptions<ITOTPOptions> = {
                account: "account@test.com",
                issuer: "Issuer"
            };

            const totp = new TOTPAuthenticator(options);

            expect(totp.getAccount()).toBe(options.account);
            expect(totp.getIssuer()).toBe(options.issuer);
        });

        describe("Should throw if options is not a plain object", () => {
            const invalidOptions = [null, 123, "string", [], new Date()];

            test.each(invalidOptions)(`Should throw if options is "%s"`, (option) => {
                /* @ts-expect-error */
                expect(() => new TOTPAuthenticator(option)).toThrow("The options must be a plain object");
            });
        });
    });

    describe("Proxy methods", () => {
        const options: TAuthenticatorOptions<ITOTPOptions> = {
            account: "account"
        };

        options.window = [1, 3];
        options.period = 20;

        const authenticator = new TOTPAuthenticator(options);

        beforeEach(() => {
            jest.useFakeTimers();
            jest.setSystemTime(0);
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test("Should call proxy method getWindow", () => {
            const spy = jest.spyOn(TOTP.prototype, "getWindow");

            expect(authenticator.getWindow()).toBe(options.window);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        test("Should call proxy method getPeriod", () => {
            const spy = jest.spyOn(TOTP.prototype, "getPeriod");

            expect(authenticator.getPeriod()).toBe(options.period);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        test("Should call proxy method getCounter", () => {
            const spy = jest.spyOn(TOTP.prototype, "getCounter");

            expect(authenticator.getCounter()).toBe(0);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        test("Should call proxy method getTimeUsed", () => {
            const spy = jest.spyOn(TOTP.prototype, "getTimeUsed");

            expect(authenticator.getTimeUsed()).toBe(0);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        test("Should call proxy method getTimeRemaining", () => {
            const spy = jest.spyOn(TOTP.prototype, "getTimeRemaining");

            expect(authenticator.getTimeRemaining()).toBe(options.period);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        test("Should call proxy method generate", async() => {
            const spy = jest.spyOn(TOTP.prototype, "generate");

            await authenticator.generate();

            expect(spy).toHaveBeenCalledTimes(1);
        });

        test("Should call proxy method verifyDelta", async() => {
            const spy = jest.spyOn(TOTP.prototype, "verifyDelta");

            const code = await authenticator.generate();
            const delta = await authenticator.verifyDelta(code);

            expect(spy).toHaveBeenCalledWith(code);
            expect(delta).toBe(0);
        });

        test("Should call proxy method verify", async() => {
            const spy = jest.spyOn(TOTP.prototype, "verify");

            const code = await authenticator.generate();
            const verify = await authenticator.verify(code);

            expect(spy).toHaveBeenCalledWith(code);
            expect(verify).toBe(true);
        });
    });

    describe("TOTP Authenticator URI", () => {
        test("Should return default TOTP Authenticator URI", () => {
            const options: TAuthenticatorOptions<ITOTPOptions> = {
                account: "account@test.com"
            };

            const authenticator = new TOTPAuthenticator(options);
            const uri = new URL(authenticator.toURI());
            
            expect(uri.host).toBe(AuthenticatorType.TOTP);
            expect(uri.searchParams.get("period")).toBe("30");
        });

        test("Should throw invalid type from TOTP Authenticator URI", () => {
            expect(() => TOTPAuthenticator.fromURI("otpauth://hotp"))
                .toThrow(`The authenticator URI type is invalid`);
        });

        test("Should throw invalid period from TOTP Authenticator URI", () => {
            expect(() => TOTPAuthenticator.fromURI("otpauth://totp/account?secret=234567&period="))
                .toThrow(`The authenticator URI period is invalid`);
            expect(() => TOTPAuthenticator.fromURI("otpauth://totp/account?secret=234567&period=abc"))
                .toThrow(`The authenticator URI period is invalid`);
        });

        test("Should return default period from TOTP Authenticator URI", () => {
            const authenticator = TOTPAuthenticator.fromURI("otpauth://totp/account?secret=234567");

            expect(authenticator.getPeriod()).toBe(30);
        });

        test("Should return period from TOTP Authenticator URI", () => {
            const authenticator = TOTPAuthenticator.fromURI("otpauth://totp/account?secret=234567&period=15");

            expect(authenticator.getPeriod()).toBe(15);
        });
    });
});