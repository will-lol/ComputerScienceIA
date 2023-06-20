import * as wasm from "./brotli_wasm_bg.wasm";
import { __wbg_set_wasm } from "./brotli_wasm_bg.js";
__wbg_set_wasm(wasm);
export * from "./brotli_wasm_bg.js";
