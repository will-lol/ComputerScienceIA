import type { LayoutServerLoad } from './$types';
import { CLIENT_ID } from '$env/static/private'

export const load = (( { url } ) => {
    if (CLIENT_ID) {
        return {
            url: url.origin + "/auth",
            clientID: CLIENT_ID
        };
    }
}) satisfies LayoutServerLoad;