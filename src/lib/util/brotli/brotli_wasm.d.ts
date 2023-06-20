/* tslint:disable */
/* eslint-disable */
/**
* @param {Uint8Array} input
* @param {number} buffer_size
* @param {number} quality
* @param {number} lgwin
* @returns {Uint8Array}
*/
export function compress(input: Uint8Array, buffer_size: number, quality: number, lgwin: number): Uint8Array;
/**
* @param {Uint8Array} input
* @param {number} buffer_size
* @returns {Uint8Array}
*/
export function decompress(input: Uint8Array, buffer_size: number): Uint8Array;
