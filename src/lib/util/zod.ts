import { z } from 'zod';

export const githubAuthTypeChecker = z.object({
	access_token: z.string(),
	expires_in: z.number(),
	refresh_token: z.string(),
	refresh_token_expires_in: z.number(),
	token_type: z.string(),
	scope: z.string()
});
export type githubAuth = z.infer<typeof githubAuthTypeChecker>;

export const githubAuthErrorTypeChecker = z.object({
	error: z.string(),
	error_description: z.string(),
	error_uri: z.string()
});
export type githubAuthError = z.infer<typeof githubAuthErrorTypeChecker>;

const stringOrDateToDate = z
	.string()
	.or(z.date())
	.transform((arg) => new Date(arg));

export const refreshApiTypeChecker = z.object({
	token: z.object({
		data: z.string(),
		expires: stringOrDateToDate
	}),
	refreshToken: z.object({
		data: z.string(),
		expires: stringOrDateToDate
	})
});
export type refreshApiType = z.infer<typeof refreshApiTypeChecker>;

export const songTypeChecker = z.object({
	name: z.optional(z.string()),
	artist: z.optional(z.string()),
	album: z.optional(z.string()),
	genre: z.optional(z.string()),
	time: z.optional(z.number()),
	playCount: z.optional(z.number()),
	skipCount: z.optional(z.number()),
	rating: z.optional(z.number())
});
export type song = z.infer<typeof songTypeChecker>;

export const albumTypeChecker = z.object({
	name: z.optional(z.string()),
	artist: z.optional(z.string()),
	plays: z.optional(z.number())
});
export type album = z.infer<typeof albumTypeChecker>;

export const artistTypeChecker = z.object({
	name: z.optional(z.string()),
	plays: z.optional(z.number())
});
export type artist = z.infer<typeof artistTypeChecker>;

export const metadataTypeChecker = z.object({
	date: stringOrDateToDate
});
export type metadata = z.infer<typeof metadataTypeChecker>;

export const overallStatsTypeChecker = z.object({
	totalSongs: z.number(),
	totalPlays: z.number(),
	totalTime: z.number()
});
export type overallStats = z.infer<typeof overallStatsTypeChecker>;

export const dataPackageTypeChecker = z.object({
	metadata: metadataTypeChecker,
	songs: z.array(songTypeChecker),
	fromServer: z.optional(z.boolean())
});
export type dataPackage = z.infer<typeof dataPackageTypeChecker>;
export const retrieveAllDataApiPackage = z.object({
	data: dataPackageTypeChecker,
	id: z.number()
});
export const retrieveAllDataApiTypeChecker = z.array(retrieveAllDataApiPackage);
export type retrieveAllDataApi = z.infer<typeof retrieveAllDataApiTypeChecker>;

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
});
export type githubUser = z.infer<typeof githubUserTypeChecker>;
