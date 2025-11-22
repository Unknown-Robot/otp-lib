import { jest, describe, expect, test, beforeEach, afterAll } from "@jest/globals";

import type { ITOTPOptions } from "../src/types/totp";

import RFC6238TestVectors from "./rfc/rfc6238";

import Secret from "../src/secret";
import TOTP from "../src/totp";

describe("Time-Based One-Time Password", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    describe("Constructor", () => {
        test("Should use default option values", () => {
            const totp = new TOTP();

            expect(totp.getPeriod()).toBe(30);
            expect(totp.getWindow()).toStrictEqual([0, 0]);
        });

        test("Should use defined option values", () => {
            const options: ITOTPOptions = {};
            options.window = [1, 3];
            options.period = 10;

            const totp = new TOTP(options);

            expect(totp.getPeriod()).toBe(options.period);
            expect(totp.getWindow()).toStrictEqual(options.window);
        });

        test("Should use defined option values", () => {
            const options: ITOTPOptions = {};
            options.window = [1, 3];
            options.period = 10;

            const totp = new TOTP(options);

            expect(totp.getPeriod()).toBe(options.period);
            expect(totp.getWindow()).toStrictEqual(options.window);
        });

        test("Should use normalize option values", () => {
            const options: ITOTPOptions = {};
            options.window = 3;

            const totp = new TOTP(options);

            expect(totp.getWindow()).toStrictEqual([3, 3]);
        });

        test("Should throw if window is not non-negative integer", () => {
            expect(() => new TOTP({ window: -9 })).toThrow();
            expect(() => new TOTP({ window: 0.5 })).toThrow();
        });

        test("Should throw if window is not array of two non-negative integers", () => {
            /* @ts-expect-error */
            expect(() => new TOTP({ window: [0] })).toThrow();
            expect(() => new TOTP({ window: [-9, 0] })).toThrow();
            expect(() => new TOTP({ window: [-9, -9] })).toThrow();
        });

        test("Should throw if period is not positive integer", () => {
            expect(() => new TOTP({ period: 0 })).toThrow();
            expect(() => new TOTP({ period: -9 })).toThrow();
            expect(() => new TOTP({ period: 0.5 })).toThrow();
        });
    });

    describe("Counter", () => {
        test("Should return valid counter for the start of period", () => {
            const totp = new TOTP({ period: 30 });
            jest.setSystemTime(0);
            
            expect(totp.getCounter()).toBe(0);
        });

        test("Should return valid counter for the end of period", () => {
            const totp = new TOTP({ period: 30 });

            const timestamp = (totp.getPeriod() * 1000) - 1;
            jest.setSystemTime(timestamp);
            
            expect(totp.getCounter()).toBe(0);
        });

        test("Should return valid counter for the boundary of period", () => {
            const totp = new TOTP({ period: 30 });

            const timestamp = (totp.getPeriod() * 1000);
            jest.setSystemTime(timestamp);
            
            expect(totp.getCounter()).toBe(1);
        });

        test("Should return valid counter for the future of period", () => {
            const totp = new TOTP({ period: 30 });

            const timestamp = (300 * 1000);
            jest.setSystemTime(timestamp);
            
            expect(totp.getCounter()).toBe(10);
        });

        test("Should return valid counter for random periods", () => {
            for (let i = 0; i < 100; i++) {
                const timestamp = Math.floor(Math.random() * 1000000000);
                const period = Math.floor(Math.random() * 300) + 1;
                
                const totp = new TOTP({ period });
                const counter = Math.floor(timestamp / period);
                
                jest.setSystemTime(timestamp * 1000);

                expect(totp.getCounter()).toBe(counter);
                expect(totp.getPeriod()).toBe(period);
            }
        });
    });

    describe("Time", () => {
        test("Should return valid time used for the start of period", () => {
            const totp = new TOTP({ period: 30 });
            jest.setSystemTime(0);
            
            expect(totp.getTimeUsed()).toBe(0);
            expect(totp.getTimeRemaining()).toBe(totp.getPeriod());
        });

        test("Should return valid time used for the half of period", () => {
            const totp = new TOTP({ period: 30 });
            const half = totp.getPeriod() / 2;
            
            const timestamp = half * 1000;
            jest.setSystemTime(timestamp);
            
            expect(totp.getTimeUsed()).toBe(half);
            expect(totp.getTimeRemaining()).toBe(half);
        });

        test("Should return valid time used for the end of period", () => {
            const totp = new TOTP({ period: 30 });
            const period = totp.getPeriod();
            
            const timestamp = (period * 1000) - 1;
            jest.setSystemTime(timestamp);
            
            expect(totp.getTimeUsed()).toBe(period - 1);
            expect(totp.getTimeRemaining()).toBe(1);
        });

        test("Should return reset time used for the next period", () => {
            const totp = new TOTP({ period: 30 });
            const period = totp.getPeriod();
            
            const timestamp = period * 1000;
            jest.setSystemTime(timestamp);
            
            expect(totp.getTimeUsed()).toBe(0);
            expect(totp.getTimeRemaining()).toBe(period);
        });
    });

    describe("Verify", () => {
        test("Should success verify the current code", async() => {
            const totp = new TOTP();
            const code = await totp.generate();

            expect(await totp.verifyDelta(code)).toBe(0);
            expect(await totp.verify(code)).toBe(true);
        });

        test("Should success verify the future window code", async() => {
            const totp = new TOTP({ window: [0, 1] });

            jest.setSystemTime(totp.getPeriod() * 1000);
            const code = await totp.generate();
            jest.setSystemTime(0);

            expect(await totp.verifyDelta(code)).toBe(1);
            expect(await totp.verify(code)).toBe(true);
        });

        test("Should success verify the past window code", async() => {
            const totp = new TOTP({ window: [1, 0] });

            jest.setSystemTime(0);
            const code = await totp.generate();
            jest.setSystemTime(totp.getPeriod() * 1000);

            expect(await totp.verifyDelta(code)).toBe(-1);
            expect(await totp.verify(code)).toBe(true);
        });

        test("Should fail verify the future window code", async() => {
            const totp = new TOTP({ window: [1, 0] });

            jest.setSystemTime(totp.getPeriod() * 1000);
            const code = await totp.generate();
            jest.setSystemTime(0);

            expect(await totp.verifyDelta(code)).toBe(null);
            expect(await totp.verify(code)).toBe(false);
        });

        test("Should fail verify the past window code", async() => {
            const totp = new TOTP({ window: [0, 1] });

            jest.setSystemTime(0);
            const code = await totp.generate();
            jest.setSystemTime(totp.getPeriod() * 1000);

            expect(await totp.verifyDelta(code)).toBe(null);
            expect(await totp.verify(code)).toBe(false);
        });

        test("Should success verify all the future window codes", async() => {
            const totp = new TOTP({ window: [0, 5] });
            const [_, future] = totp.getWindow();
            const period = totp.getPeriod();

            for(let i = 1; i <= future; i++) {
                jest.setSystemTime(i * (period * 1000));
                const code = await totp.generate();
                jest.setSystemTime(0);

                expect(await totp.verifyDelta(code)).toBe(i);
                expect(await totp.verify(code)).toBe(true);
            }
        });

        test("Should success verify all the past window codes", async() => {
            const totp = new TOTP({ window: [5, 0] });
            const [past, _] = totp.getWindow();
            const period = totp.getPeriod();

            for(let i = -past; i < 0; i++) {
                jest.setSystemTime(0);
                const code = await totp.generate();
                jest.setSystemTime(Math.abs(i) * (period * 1000));

                expect(await totp.verifyDelta(code)).toBe(i);
                expect(await totp.verify(code)).toBe(true);
            }
        });

        test("Should success verify all the window codes", async() => {
            const totp = new TOTP({ window: [8, 6] });
            const [past, future] = totp.getWindow();
            const period = totp.getPeriod();

            const currentTime = (period * 1000) * past;

            for(let i = -past; i <= future; i++) {
                jest.setSystemTime(currentTime + (i * (period * 1000)));
                const code = await totp.generate();
                jest.setSystemTime(currentTime);

                expect(await totp.verifyDelta(code)).toBe(i);
                expect(await totp.verify(code)).toBe(true);
            }
        });
    });

    describe("RFC 6238 (Appendix B)", () => {
        for(const { secret, algorithm, code, timestamp } of RFC6238TestVectors) {
            test(`Should generate TOTP "${code}"`, async() => {
                const totp = new TOTP({
                    secret: Secret.fromAscii(secret),
                    algorithm: algorithm,
                    period: 30,
                    digits: 8
                });

                jest.setSystemTime(timestamp * 1000);
                const value = await totp.generate();

                expect(value).toBe(code);
                expect(await totp.verify(value)).toBe(true);
                expect(await totp.verifyDelta(value)).not.toBe(null);
            });
        }
    });
});