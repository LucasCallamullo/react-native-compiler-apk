/// <reference types="nativewind/types" />
/// <reference types="nativewind/nativewind-env" />

// NOTE: This file provides TypeScript environment declarations for NativeWind v4 in Expo SDK 57.
// It should be committed to your version control alongside your source files.

/**
 * Declares side-effect CSS module imports for TypeScript.
 * Allows importing files like `import "./global.css"` directly in entry points 
 * without triggering module resolution type errors.
 */
declare module "*.css";