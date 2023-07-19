import { writable } from 'svelte/store';
import type { dataPackage, retrieveAllDataApi } from '$lib/util/zod';
import { retrieveAllDataApiTypeChecker } from '$lib/util/zod';
import isServer from '$lib/util/isServer';

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
	};
}

function createAllDataFromServer(key: string) {
	let defaultValue: retrieveAllDataApi = [];
	if (!isServer()) {
		console.log('couldnt find data in svelte store. falling back to localstorage...');
		const stringedData = globalThis.localStorage.getItem(key);
		if (stringedData) {
			defaultValue = retrieveAllDataApiTypeChecker.parse(JSON.parse(stringedData));
		}
	}

	const { subscribe, set } = writable(defaultValue);
	return {
		subscribe,
		setWithLocalStorage: (value: retrieveAllDataApi) => {
			set(value);
			if (value == null) {
				globalThis.localStorage.removeItem(key);
			} else {
				globalThis.localStorage.setItem(key, JSON.stringify(value));
			}
		}
	};
}

export const dataStore = createDataStore('data');
export const comparisonDataStore = createDataStore('comparison');
export const allDataFromServerStore = createAllDataFromServer('all');
