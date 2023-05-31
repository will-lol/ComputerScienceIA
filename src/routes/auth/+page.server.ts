import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import env from '$lib/util/env';
import { githubAuthTypeChecker, githubAuthErrorTypeChecker } from '$lib/util/zod';
import type { githubAuthError } from '$lib/util/zod';
import type { auth } from '$lib/util/auth';

export const load = (async ({ url }): Promise<auth> => {
	const code = url.searchParams.get('code');
	if (!code) {
		throw error(400, 'Request must include code param');
	}
	if (!env) {
		throw error(500, 'Invalid environment variables');
	}
	const oauthURL = new URL('https://github.com/login/oauth/access_token');

	oauthURL.searchParams.set('client_id', env.CLIENT_ID);
	oauthURL.searchParams.set('client_secret', env.CLIENT_SECRET);
	oauthURL.searchParams.set('code', code);

	const result = await fetch(oauthURL.href, {
		headers: {
			Accept: 'application/json'
		}
	}).then((res) => res.json());

	const auth = githubAuthTypeChecker.safeParse(result);
	let authError: githubAuthError;
	if (!auth.success) {
		try {
			authError = githubAuthErrorTypeChecker.parse(result);
		} catch {
			throw error(500, "Couldn't parse error");
		}
		throw error(500, authError.error_description);
	}
    let output = {
		token: { data: auth.data.access_token, expires: new Date(Date.now() + auth.data.expires_in) },
		refreshToken: {
			data: auth.data.refresh_token,
			expires: new Date(Date.now() + auth.data.refresh_token_expires_in)
		}
	}
    console.log(output);
	return output;
}) satisfies PageServerLoad;
