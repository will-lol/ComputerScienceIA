import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isAuthorised } from '$lib/util/authServer';
import { retreiveFromDB, getFromS3 } from '$lib/util/db';
import type { dataPackage } from '$lib/util/zod';
import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
    runtime: 'nodejs18.x'
};

export const GET = (async ({ url, request }) => {
    const s3key = url.searchParams.get("key");
    if (s3key == undefined) {
        throw error(400);
    }
    const auth = await isAuthorised(request);
	if (auth.authorised) {
		const data = await getFromS3(s3key);
		return new Response(data);
	} else {
		throw error(401);
	}
}) satisfies RequestHandler;