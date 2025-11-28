# @otp-lib

> TOTP (Time-based) and HOTP (HMAC-based) One-Time Password library

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue.svg)](https://www.typescriptlang.org/)

## About

`@otp-lib` is a suite of libraries designed to implement the generation and verification of **HOTP (HMAC-based)**, **TOTP (Time-based)** codes.

Built on top of the native **Web Crypto API**, it ensures cryptographic security and performance across all modern JavaScript environments (Node.js, Deno, Bun, Browsers, Cloudflare Workers).

## Packages

This repository is a monorepo containing the following packages :

**[`@otp-lib/authenticator`](./packages/authenticator)**

Designed to build **Multi-Factor Authentication (MFA)**, **Two-Factor Authentication (2FA)** systems or **Authenticator** applications.
It wraps the core logic with features :

* **Key URI :** Fully supports parsing and generating **Key URI Format** `otpauth://`, enabling seamless integration with QR Codes and compatibility with apps like Google Authenticator, Microsoft Authenticator, Authy, or Yubico Authenticator.
* **Context :** Manages metadata like Issuer (provider name) and Account (user email), which is essential for user-facing applications.

**[`@otp-lib/core`](./packages/core)**

Designed to build strict, compliant implementation of **One-Time Passwords (OTP)** algorithms.

* **Secure :** Uses the native **Web Crypto API** (`crypto.subtle`) for cryptographic operations.
* **Isomorphic :** Works in **Node.js**, **Bun**, **Deno**, **Browsers**, and **Cloudflare Workers**.
* **Type-Safe :** Written in strict **TypeScript** with full type definitions included.
* **Zero Dependencies :** No external **overhead**. Lightweight and fast.
* **Compliant :** Strict implementations of the IETF standards :
    * **[RFC 4226](https://tools.ietf.org/html/rfc4226) :** HMAC-Based One-Time Password (HOTP).
    * **[RFC 6238](https://tools.ietf.org/html/rfc6238) :** Time-Based One-Time Password (TOTP).
    * **[RFC 4648](https://tools.ietf.org/html/rfc4648) :** Base32 and Base64 Data Encodings.

## License

MIT © [Unknown-Robot](https://github.com/Unknown-Robot)