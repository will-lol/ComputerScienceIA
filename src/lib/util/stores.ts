import { writable } from "svelte/store";
import type { dataPackage } from "../../routes/parseWorker";
import isServer from '$lib/util/isServer';
import type { auth } from "$lib/util/auth";

function createAuthStore() {
    let defaultValue: auth | null;
    if (isServer()) {
        defaultValue = null;
    } else {
        const sessionStorageAuthString = globalThis.sessionStorage.getItem("auth");
        if (sessionStorageAuthString == null) {
            defaultValue = null;
        } else {
            defaultValue = JSON.parse(sessionStorageAuthString);
        }    
    }

	const { subscribe, set } = writable(defaultValue);

	return {
		subscribe,
        setWithLocalStorage: (value: auth | null) => {
            set(value);
            if (value == null) {
                globalThis.sessionStorage.removeItem("auth");
            } else {
                globalThis.sessionStorage.setItem("auth", JSON.stringify(value))
            }
        }
	};
}

export const dataStore = writable<dataPackage>(undefined);
export const authStore = createAuthStore();