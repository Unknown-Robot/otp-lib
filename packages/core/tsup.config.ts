import { defineConfig } from "tsup";
import pkg from "./package.json";

const banner: string = `/**
 * ${pkg.name} v${pkg.version}
 * Copyright (c) ${new Date().getFullYear()} ${pkg.author.name || pkg.author}
 * Licensed under ${pkg.license} License
 * ${pkg.homepage || pkg.repository.url}
 */`;

export default defineConfig([{
    entry: {
        "otp-core": "src/index.ts",
        "utils/index": "src/utils/index.ts"
    },
    format: ["cjs", "esm", "iife"],
    globalName: "OTPCore",
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
    },
    outExtension: ({ format }) => ({
        js: (format === "cjs")? ".cjs": 
            (format === "esm")? ".mjs": 
            ".js"
    })
}, {
    entry: {
        "otp-core": "src/index.ts",
        "utils/index": "src/utils/index.ts"
    },
    format: ["cjs", "esm", "iife"],
    globalName: "OTPCore",
    treeshake: "smallest",
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: false,
    minify: "terser",
    terserOptions: {
        compress: true,
        mangle: true,
        format: {
            preamble: banner,
            comments: false,
            beautify: false
        }
    },
    outExtension: ({ format }) => ({
        js: (format === "cjs")? ".min.cjs": 
            (format === "esm")? ".min.mjs": 
            ".min.js"
    })
}]);