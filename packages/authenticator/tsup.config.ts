import { defineConfig } from "tsup";
import pkg from "./package.json";

const banner: string = `/**
 * ${pkg.name} v${pkg.version}
 * Copyright (c) ${new Date().getFullYear()} ${pkg.author.name || pkg.author}
 * ${pkg.homepage || pkg.repository.url}
 * ${pkg.license} License
 */`;

export default defineConfig([{
    entry: {
        "otp-auth": "src/index.ts"
    },
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
    },
    outExtension: ({ format }) => ({
        js: (format === "cjs")? ".cjs": 
            (format === "esm")? ".mjs": 
            ".js"
    })
}, {
    entry: {
        "otp-auth": "src/index.ts"
    },
    format: ["esm", "iife"],
    noExternal: Object.keys(
        pkg.peerDependencies
    ),
    globalName: "OTPAuth",
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
    outExtension: ({ format }) => ({
        js: `.${format}.js`
    })
}, {
    entry: {
        "otp-auth": "src/index.ts"
    },
    format: ["esm", "iife"],
    noExternal: Object.keys(
        pkg.peerDependencies
    ),
    globalName: "OTPAuth",
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
        js: `.${format}.min.js`
    })
}]);