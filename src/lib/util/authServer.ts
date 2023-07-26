import type { githubUser } from '$lib/util/zod';

//The extent of our server auth is just checking if a requesting user is authorised to make their request.
export async function isAuthorised(
	request: Request
): Promise<{ authorised: true; username: string } | { authorised: false }> {
	const token = request.headers.get('Authorization');
	if (token == null) {
		return { authorised: false };
	}
	const user = await fetch('https://api.github.com/user', { headers: { Authorization: token } });
	if (user.status != 200) {
		return { authorised: false };
	}
	const username = ((await user.json()) as githubUser).login;
	return { authorised: true, username: username };
}
