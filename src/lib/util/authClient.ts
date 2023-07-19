//This file includes all of the auth logic that lives on client.
import { refreshApiTypeChecker } from '$lib/util/zod';
import isServer from './isServer';
import { writable, readonly } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';

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

class ClientAuth {
	private authStore: Writable<auth | null>;
	externalAuth: Readable<auth | null>;
	private authAccessor: auth | null;
	private authPromiseWhileRefreshing: Promise<auth> | undefined;

	constructor() {
		this.authStore = writable(null);
		this.authAccessor = null;
		this.authStore.subscribe((val) => this.authAccessor = val);
		this.externalAuth = readonly(this.authStore);

		if (!isServer()) {
			const sessionStorageAuthString = globalThis.localStorage.getItem('auth');
			if (sessionStorageAuthString != null) {
				let parsedAuth = JSON.parse(sessionStorageAuthString);

				if (parsedAuth) {
					parsedAuth.token.expires = new Date(parsedAuth.token.expires);
					parsedAuth.refreshToken.expires = new Date(parsedAuth.refreshToken.expires);
				}

				this.authStore.set(parsedAuth);
			}	
		}
	}

	setAuth(auth: auth) {
		this.authStore.set(auth);
		globalThis.localStorage.setItem("auth", JSON.stringify(this.authAccessor));
	}

	async fetchWithAuth(input: RequestInfo, init?: RequestInit): Promise<Response> {
		if (this.authAccessor == null) {
			throw 'auth must not be null';
		}

		await this.validateAuth(this.authAccessor)
			.then((res) => this.setAuth(res))
			.catch(() => this.logout());

		if (this.authAccessor != undefined) {
			//The modifiedInit is a new RequestInit object with the authentication details included.
			const modifiedInit = {
				...init,
				headers: { ...init?.headers, Authorization: `Bearer ${this.authAccessor.token.data}` }
			};
			let res = await fetch(input, modifiedInit);
			return res;
		} else {
			throw 'auth is undefined';
		}
	}
	
	logout() {
		this.authStore.set(null);
		globalThis.localStorage.removeItem("auth");
		globalThis.location.reload();
	}

	private async validateAuth(auth: auth) {
		if (auth.token.expires.valueOf() < Date.now()) {
			//Sometimes the validateAuth is called again before the previous call resolved, so check if a refersh has already been sent
			if (this.authPromiseWhileRefreshing != undefined) {
				return await this.authPromiseWhileRefreshing;
			} else {
				this.authPromiseWhileRefreshing = this.refresh();
				return await this.authPromiseWhileRefreshing.then((res) => {
					this.authPromiseWhileRefreshing = undefined;
					return res;
				});
			}
		} else {
			return auth;
		}
	}

	private async refresh() {
		if (this.authAccessor == null) {
			throw 'no auth to refresh';
		}

		if (this.authAccessor.refreshToken.expires.valueOf() > Date.now()) {
			const refreshURL = new URL(globalThis.location.origin + '/api/refreshToken');
			refreshURL.searchParams.set('refresh', this.authAccessor.refreshToken.data);
			const refreshRes = await fetch(refreshURL)
				.then((res) => res.json())
				.catch((err) => {
					throw "couldn't refresh token: " + err;
				});
			const refreshParsed = refreshApiTypeChecker.parse(refreshRes);
			this.setAuth(refreshParsed);
			return refreshParsed;
		} else {
			throw 'refresh token expired';
		}
	}
}

export default new ClientAuth();