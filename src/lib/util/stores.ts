import { writable } from "svelte/store";
import type { dataPackage } from "$lib/util/zod";
import isServer from '$lib/util/isServer';
import type { auth } from "$lib/util/authClient";

function createAuthStore() {
    let defaultValue: auth | null;
    defaultValue = null;
    if (!isServer()) {
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

function createDataStore(key: string) {
    let defaultValue: dataPackage | null = null;
    if (!isServer()) {
        console.log('couldnt find data in svelte store. falling back to localstorage...');
        const stringedData = globalThis.localStorage.getItem(key);
        if (stringedData) {
            defaultValue = JSON.parse(stringedData) as dataPackage;
        }
    }

    const { subscribe, set } = writable(defaultValue);
    return {
        subscribe,
        setWithLocalStorage: (value: dataPackage | null) => {
            set(value);
            if (value == null) {
                globalThis.localStorage.removeItem(key);
            } else {
                globalThis.localStorage.setItem(key, JSON.stringify(value));
            }
        }
    }
}

export const dataStore = createDataStore("data");
export const comparisonDataStore = createDataStore("comparison");
export const authStore = createAuthStore();
export const newStore = writable(undefined);