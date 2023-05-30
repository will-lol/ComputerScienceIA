import { writable } from "svelte/store";
import type { dataPackage } from "./parseWorker";
import type { auth } from "./auth/+page.server";

export const dataStore = writable<dataPackage>(undefined);
export const authStore = writable<auth>(undefined);