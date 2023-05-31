import type { LayoutServerLoad } from './$types';
import env from "$lib/util/env"

export const load = (( { url } ) => {
    if (env) {
        return {
            url: url.origin + "/auth",
            clientID: env.CLIENT_ID
        };
    }
}) satisfies LayoutServerLoad;