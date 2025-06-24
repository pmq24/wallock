// Declaring types for `import.meta.env`
// https://vite.dev/guide/env-and-mode#intellisense-for-typescript

/// <reference types="vite/client" />

interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
