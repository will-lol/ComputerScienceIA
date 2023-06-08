import type { LayoutServerLoad } from './$types';
import { CLIENT_ID } from '$env/static/private'
import { uploadData } from '$lib/util/db';

export const load = (( { url } ) => {
    if (CLIENT_ID) {
        return {
            url: url.origin + "/auth",
            clientID: CLIENT_ID
        };
    }
}) satisfies LayoutServerLoad;