import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { githubAuthTypeChecker, githubAuthErrorTypeChecker } from "$lib/util/zod";
import type { githubAuthError } from "$lib/util/zod";
import { CLIENT_ID, CLIENT_SECRET } from '$env/static/private';
import type { auth } from '$lib/util/authClient';

export type apiOutput = auth;

export const GET = (async ({ url })  => {
    const refreshToken = url.searchParams.get("refresh");

    if (refreshToken == null) {
        throw error(400)
    }

    const refreshUrl = new URL("https://github.com/login/oauth/access_token");
    refreshUrl.searchParams.set("client_id", CLIENT_ID);
    refreshUrl.searchParams.set("client_secret", CLIENT_SECRET);
    refreshUrl.searchParams.set("grant_type", "refresh_token");
    refreshUrl.searchParams.set("refresh_token", refreshToken);
    const refresh = await fetch(refreshUrl.href, {
        headers: {
            "Accept": "application/json"
        }
    }).then((res) => res.json());

    const auth = githubAuthTypeChecker.safeParse(refresh);
    let authError: githubAuthError
    if (!auth.success) {
        try {
            authError = githubAuthErrorTypeChecker.parse(refresh);
        } catch {
            throw error(500, "Couldn't parse error")
        }
        throw error(500, authError.error_description)
    }

    const result = JSON.stringify({
		token: { data: auth.data.access_token, expires: new Date(Date.now() + auth.data.expires_in) },
		refreshToken: {
			data: auth.data.refresh_token,
			expires: new Date(Date.now() + auth.data.refresh_token_expires_in)
		}
	});
	return new Response(result);
}) satisfies RequestHandler;