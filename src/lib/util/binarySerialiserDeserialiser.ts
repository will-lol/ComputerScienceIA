import type { dataPackage } from './zod';
import pkg from 'protobufjs';

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
			},
		}
	}
};

const dataPackageParser = pkg.Root.fromJSON(jsonProtoDef).lookupType("main.dataPackage");

export function toBinary(input: dataPackage): Uint8Array {
    const transformed: any = input;
    transformed.metadata.date = input.metadata.date.valueOf();
	return dataPackageParser.encode(dataPackageParser.fromObject(transformed)).finish();
}

export function fromBinary(input: Uint8Array): dataPackage {
    const transformed = dataPackageParser.decode(input).toJSON();
    transformed.metadata.date = new Date(parseInt(transformed.metadata.date));
	return transformed as dataPackage;
}