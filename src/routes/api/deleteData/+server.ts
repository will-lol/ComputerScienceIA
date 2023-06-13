import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { deleteData } from '$lib/util/db';
import { isAuthorised } from '$lib/util/authServer';

export const DELETE = (async ({ url, request }) => {
    const idParam = url.searchParams.get("id");
    if (!idParam) {
        throw error(400)
    }
    const id = parseInt(idParam);
    const auth = await isAuthorised(request);
    if (auth.authorised) {
        await deleteData(id);
        return new Response(null, {status: 200});    
    } else {
        throw error(401)
    }
}) satisfies RequestHandler;