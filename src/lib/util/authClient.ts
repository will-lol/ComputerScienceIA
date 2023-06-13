import { authStore } from '$lib/util/stores';
import { refreshApiTypeChecker } from '$lib/util/zod';

let auth: auth | null;
authStore.subscribe((val) => {
	auth = val;
});

export type auth = {
	token: {
		data: string;
		expires: Date;
	};
	refreshToken: {
		data: string;
		expires: Date;
	};
};

let refreshing: Promise<auth> | undefined;
refreshing = undefined;
async function refresh() {
	if (auth == null) {
		throw 'no auth to refresh';
	}
	if (auth.refreshToken.expires.valueOf() > Date.now()) {
		const refreshURL = new URL(globalThis.location.origin + '/api/refreshToken');
		refreshURL.searchParams.set('refresh', auth.refreshToken.data);
		const refreshRes = await fetch(refreshURL)
			.then((res) => res.json())
			.catch((err) => {
				throw "couldn't refresh token: " + err;
			});
		const refreshParsed = refreshApiTypeChecker.parse(refreshRes);
		authStore.setWithLocalStorage(refreshParsed);
		return refreshParsed;
	} else {
		throw 'refresh token expired';
	}
}

export async function getAuth() {
	if (auth == null) {
		throw 'no auth available';
	}
	if (auth.token.expires.valueOf() < Date.now()) {
		if (refreshing != undefined) {
			return(await refreshing);
		} else {
			refreshing = refresh();
			return(await refreshing.then((res) => {refreshing = undefined; return res;}));
		}
	}
	return auth;
}

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit): Promise<Response> {
	const auth = await getAuth().catch((e) => {
		authStore.setWithLocalStorage(null);
	});
	if (auth != undefined) {
		const modifiedInit = {
			...init,
			headers: { ...init?.headers, Authorization: `Bearer ${auth.token.data}` }
		};
		let res = await fetch(input, modifiedInit);
		return res;
	} else {
		throw 'auth is undefined';
	}
}
