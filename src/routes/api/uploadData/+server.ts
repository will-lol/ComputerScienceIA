import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { uploadData } from '$lib/util/db';
import { isAuthorised } from '$lib/util/authServer';
import type { Config } from '@sveltejs/adapter-vercel';
import { dataPackageTypeChecker } from '$lib/util/zod';

export const config: Config = {
	runtime: 'nodejs18.x'
};

export const POST = (async ({ request }) => {
	const auth = await isAuthorised(request);
	if (auth.authorised) {
		const data = dataPackageTypeChecker.safeParse(await request.json());
		if (!data.success) {
			throw error(400, 'Unexpected data shape');
		}
		const date = data.data.metadata.date;
		await uploadData(auth.username, data.data, date).catch((e) => {
			if (e == 'data not found') {
				throw error(406, e);
			} else {
				throw error(500, e);
			}
		});
		return new Response(null, { status: 200 });
	} else {
		throw error(401);
	}
}) satisfies RequestHandler;
