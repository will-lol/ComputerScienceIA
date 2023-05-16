import { writable } from "svelte/store";
import type { dataPackage } from "./parseWorker";

export const dataStore = writable<dataPackage>(undefined);