import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isAuthorised } from '$lib/util/authServer';

export const GET = (async ({ request }) => {
    const auth = await isAuthorised(request);
	if (auth.authorised) {
		
	} else {
		throw error(401);
	}
	return new Response();
}) satisfies RequestHandler;