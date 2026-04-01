type FflateModule = {
  strFromU8: (data: Uint8Array, latin1?: boolean) => string
  strToU8: (value: string, latin1?: boolean) => Uint8Array
  unzipSync: (data: Uint8Array) => Record<string, Uint8Array>
  zipSync: (data: Record<string, Uint8Array>) => Uint8Array
}

// The app already has fflate installed transitively. This local wrapper gives us
// a typed import path that works in the current pnpm workspace layout.
const fflate = require("../../../node_modules/.pnpm/fflate@0.8.2/node_modules/fflate/lib/browser.cjs") as FflateModule

export const strFromU8 = fflate.strFromU8
export const strToU8 = fflate.strToU8
export const unzipSync = fflate.unzipSync
export const zipSync = fflate.zipSync
