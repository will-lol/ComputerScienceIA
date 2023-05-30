import type { LayoutServerLoad } from './$types';
import dotenv from 'dotenv'

export type envObj = {
    CLIENT_ID: "string",
    CLIENT_SECRET: "string"
}

const env = dotenv.config().parsed as envObj | undefined;

export const load = (( { url } ) => {
    if (env) {
        return {
            url: url.origin + "/auth",
            clientID: env.CLIENT_ID
        };
    }
}) satisfies LayoutServerLoad;