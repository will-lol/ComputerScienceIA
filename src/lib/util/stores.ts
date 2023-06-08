import { writable } from "svelte/store";
import type { dataPackage } from "../../routes/parseWorker";
import isServer from '$lib/util/isServer';
import type { auth } from "$lib/util/authClient";

function createAuthStore() {
    let defaultValue: auth | null;
    if (isServer()) {
        defaultValue = null;
    } else {
        const sessionStorageAuthString = globalThis.localStorage.getItem("auth");
        if (sessionStorageAuthString == null) {
            defaultValue = null;
        } else {
            defaultValue = JSON.parse(sessionStorageAuthString);
            if (defaultValue) {
                defaultValue.token.expires = new Date(defaultValue.token.expires);
                defaultValue.refreshToken.expires = new Date(defaultValue.refreshToken.expires);
            }
        }    
    }

	const { subscribe, set } = writable(defaultValue);

	return {
		subscribe,
        setWithLocalStorage: (value: auth | null) => {
            set(value);
            if (value == null) {
                globalThis.localStorage.removeItem("auth");
            } else {
                globalThis.localStorage.setItem("auth", JSON.stringify(value))
            }
        }
	};
}

export const pageDataStore = writable<{ clientID?: string, url?: string }>(undefined);
export const dataStore = writable<dataPackage>(undefined);
export const authStore = createAuthStore();