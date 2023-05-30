import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import dotenv from 'dotenv'
import type { envObj } from '../+layout.server';
import { z } from "zod";

const env = dotenv.config().parsed as envObj | undefined;

const authTypeChecker = z.object({
    access_token: z.string(),
    expires_in: z.number(),
    refresh_token: z.string(),
    refresh_token_expires_in: z.number(),
    token_type: z.string(),
    scope: z.string()
})

export type auth = z.infer<typeof authTypeChecker>

const authErrorTypeChecker = z.object({
    error: z.string(),
    error_description: z.string(),
    error_uri: z.string()
})

export const load = (async ({ url }) => {
    const code = url.searchParams.get("code");
    if (!code) {
        throw error(400, "Request must include code param");
    }
    if (!env) {
        throw error(500, "Invalid environment variables");
    }
    const oauthURL = new URL("https://github.com/login/oauth/access_token");

    oauthURL.searchParams.set("client_id", env.CLIENT_ID);
    oauthURL.searchParams.set("client_secret", env.CLIENT_SECRET);
    oauthURL.searchParams.set("code", code);

    const result = await fetch(oauthURL.href, { 
        headers: {
            "Accept": "application/json"
        } 
    }).then((res) => res.json());

    const auth = authTypeChecker.safeParse(result);
    let authError: z.infer<typeof authErrorTypeChecker>
    if (!auth.success) {
        try {
            authError = authErrorTypeChecker.parse(result);
        } catch {
            throw error(500, "Couldn't parse error")
        }
        throw error(500, authError.error_description)
    }
    return auth.data
}) satisfies PageServerLoad;