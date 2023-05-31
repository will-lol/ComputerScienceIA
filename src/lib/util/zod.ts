import { z } from "zod";

export const githubAuthTypeChecker = z.object({
    access_token: z.string(),
    expires_in: z.number(),
    refresh_token: z.string(),
    refresh_token_expires_in: z.number(),
    token_type: z.string(),
    scope: z.string()
})

export type githubAuth = z.infer<typeof githubAuthTypeChecker>

export const githubAuthErrorTypeChecker = z.object({
    error: z.string(),
    error_description: z.string(),
    error_uri: z.string()
})

export type githubAuthError = z.infer<typeof githubAuthErrorTypeChecker>

export const githubUserTypeChecker = z.object({
    login: z.string(),
    id: z.number(),
    node_id: z.string(),
    avatar_url: z.string(),
    gravatar_id: z.string(),
    url: z.string(),
    html_url: z.string(),
    followers_url: z.string(),
    following_url: z.string(),
    gists_url: z.string(),
    starred_url: z.string(),
    subscriptions_url: z.string(),
    organizations_url: z.string(),
    repos_url: z.string(),
    events_url: z.string(),
    received_events_url: z.string(),
    type: z.string(),
    site_admin: z.boolean(),
    name: z.string().nullable(),
    company: z.string().nullable(),
    blog: z.string(),
    location: z.string().nullable(),
    email: z.string().nullable(),
    hireable: z.string().nullable(),
    bio: z.string().nullable(),
    twitter_username: z.string().nullable(),
    public_repos: z.number(),
    public_gists: z.number(),
    followers: z.number(),
    following: z.number(),
    created_at: z.date(),
    updated_at: z.date()
})

export type githubUser = z.infer<typeof githubUserTypeChecker>