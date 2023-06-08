import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { uploadData } from '$lib/util/db';
import { isAuthorised } from '$lib/util/authServer';

export const POST = (async ({ request }) => {
    const auth = await isAuthorised(request);
    if (auth.authorised) {
        const data = await request.arrayBuffer().then((res) => new Uint8Array(res));
        await uploadData(auth.username, data).catch((e) => {if (e == "data not found") {throw error(406, e)} else {throw error(500, e)}});
        return new Response(null, {status: 200});    
    } else {
        throw error(401)
    }
}) satisfies RequestHandler;