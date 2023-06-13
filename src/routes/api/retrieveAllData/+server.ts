import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isAuthorised } from '$lib/util/authServer';
import { retreiveData } from '$lib/util/db';
import type { dataPackage } from '$lib/util/zod';
import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
    runtime: 'nodejs18.x'
};

export const GET = (async ({ request }) => {
    const auth = await isAuthorised(request);
	if (auth.authorised) {
		const data = await retreiveData(auth.username);
		const decoder = new TextDecoder();
		const typedData = data.map((elem) => {
			if (elem != undefined) {
				return {data: JSON.parse(decoder.decode(elem.data)) as dataPackage, id: elem.id}
			} else {
				return undefined
			}
		})
		return json(typedData);
	} else {
		throw error(401);
	}
}) satisfies RequestHandler;