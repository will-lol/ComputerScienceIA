import { authStore } from '$lib/util/stores';
import type { apiOutput } from '../../routes/api/refreshToken/+server';

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

export async function getAuth() {
	if (auth == undefined) {
		//set auth store from session storage
		const sessionStorageAuthString = globalThis.localStorage.getItem('auth');
		if (sessionStorageAuthString) {
			const sessionStorageAuth = JSON.parse(sessionStorageAuthString) as auth;
			authStore.setWithLocalStorage(sessionStorageAuth);
		}
	} else if (auth.token.expires.valueOf() < Date.now()) {
		if (auth.refreshToken.expires.valueOf() > Date.now()) {
			const refreshURL = new URL(globalThis.location.origin + '/api/refreshToken');
			refreshURL.searchParams.set('refresh', auth.refreshToken.data);
			const refreshRes = (await fetch(refreshURL)
				.then((res) => res.json())
				.catch((err) => {
					throw "couldn't refresh token: " + err;
				})) as apiOutput;
			authStore.setWithLocalStorage(refreshRes);
		} else {
			throw 'refresh token expired';
		}
	}
	return auth;
}

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit): Promise<Response> {
	const auth = await getAuth();
	if (auth != undefined) {
		const modifiedInit = {
			...init,
			headers: { ...init?.headers, Authorization: `Bearer ${auth.token.data}` }
		};
		console.log(modifiedInit);
		let res = await fetch(input, modifiedInit);
		return res;
	} else {
		throw 'auth is undefined';
	}
}
