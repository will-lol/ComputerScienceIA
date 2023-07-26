import type { dataPackage } from './zod';
import pkg from 'protobufjs';
import { compress, decompress } from '$lib/util/brotli/brotli_wasm';

const jsonProtoDef = {
	nested: {
		main: {
			nested: {
				dataPackage: {
					fields: {
						metadata: {
							type: 'metadata',
							id: 1
						},
						songs: {
							rule: 'repeated',
							type: 'song',
							id: 2
						}
					}
				},
				song: {
					fields: {
						name: {
							rule: 'optional',
							type: 'string',
							id: 1
						},
						artist: {
							rule: 'optional',
							type: 'string',
							id: 2
						},
						album: {
							rule: 'optional',
							type: 'string',
							id: 3
						},
						genre: {
							rule: 'optional',
							type: 'string',
							id: 4
						},
						time: {
							rule: 'optional',
							type: 'int32',
							id: 5
						},
						playCount: {
							rule: 'optional',
							type: 'int32',
							id: 6
						},
						skipCount: {
							rule: 'optional',
							type: 'int32',
							id: 7
						},
						rating: {
							rule: 'optional',
							type: 'int32',
							id: 8
						}
					}
				},
				metadata: {
					fields: {
						date: {
							type: 'uint64',
							id: 1
						}
					}
				}
			}
		}
	}
};

const dataPackageParser = pkg.Root.fromJSON(jsonProtoDef).lookupType('main.dataPackage');

function removeUseless(input: dataPackage): dataPackage {
	input.songs = input.songs.filter((song) => song.playCount != undefined && song.playCount > 0);
	return input;
}

export function toBinary(input: dataPackage): Uint8Array {
	const transformed: any = removeUseless(input);
	transformed.metadata.date = input.metadata.date.valueOf();
	const val = dataPackageParser.encode(dataPackageParser.fromObject(transformed)).finish();
	return compress(val, val.byteLength, 10, 22);
}

export function fromBinary(input: Uint8Array): dataPackage {
	const transformed = dataPackageParser.decode(decompress(input, input.byteLength)).toJSON();
	transformed.metadata.date = new Date(parseInt(transformed.metadata.date));
	return transformed as dataPackage;
}
