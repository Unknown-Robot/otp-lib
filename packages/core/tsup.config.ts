import { defineConfig } from "tsup";
import pkg from "./package.json";

const banner: string = `/**
 * ${pkg.name} v${pkg.version}
 * Copyright (c) ${new Date().getFullYear()} ${pkg.author.name || pkg.author}
 * Licensed under ${pkg.license} License
 * ${pkg.homepage || pkg.repository.url}
 */`;

export default defineConfig([{
    entry: ["src/index.ts", "src/utils/index.ts"],
    format: ["cjs", "esm"],
    treeshake: "smallest",
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
    minify: "terser",
    terserOptions: {
        compress: false,
        mangle: false,
        format: {
            preamble: banner,
            comments: false,
            beautify: true
        }
    }
}, {
    globalName: "OTPAuth",
    entry: {
        "otp-auth": "src/index.ts", 
    },
    format: ["iife"],
    treeshake: "smallest",
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: false,
    minify: "terser",
    terserOptions: {
        compress: false,
        mangle: false,
        format: {
            preamble: banner,
            comments: false,
            beautify: true
        }
    },
    outExtension: () => ({
        js: ".js"
    })
}, {
    globalName: "OTPAuth",
    entry: {
        "otp-auth": "src/index.ts", 
    },
    format: ["iife"],
    treeshake: "smallest",
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: false,
    minify: "terser",
    terserOptions: {
        compress: false,
        mangle: false,
        format: {
            preamble: banner,
            comments: false,
            beautify: false
        }
    },
    outExtension: () => ({
        js: ".min.js"
    })
}]);