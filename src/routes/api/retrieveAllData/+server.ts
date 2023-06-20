import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isAuthorised } from '$lib/util/authServer';
import { retreiveFromDB } from '$lib/util/db';
import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
	runtime: 'nodejs18.x'
};

export const GET = (async ({ request }) => {
	const auth = await isAuthorised(request);
	if (auth.authorised) {
		const data = await retreiveFromDB(auth.username);
		return json(data);
	} else {
		throw error(401);
	}
}) satisfies RequestHandler;
