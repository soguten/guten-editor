import { defineConfig, normalizePath } from "npm:vite";
import { fileURLToPath, URL } from "node:url";

const srcPath = normalizePath(fileURLToPath(new URL("./src/", import.meta.url)));

export default defineConfig({
    resolve: {
        alias: [
            { find: "@/", replacement: `${srcPath}/` },
            { find: "@core/", replacement: `${srcPath}/core/` },
            { find: "@design-system/", replacement: `${srcPath}/design-system/` },
            { find: "@components/", replacement: `${srcPath}/components/` },
            { find: "@plugins/", replacement: `${srcPath}/plugins/` },
            { find: "@utils/", replacement: `${srcPath}/utils/` },
        ],
    },
    root: "demo",
    publicDir: "public",
    build: {
        outDir: "dist",
        emptyOutDir: true,
        minify: "esbuild",
        sourcemap: true,
    },
    esbuild: {
        jsx: "automatic",
        jsxImportSource: "@core/jsx",
        keepNames: false,
        minifyIdentifiers: true,
    },
});
