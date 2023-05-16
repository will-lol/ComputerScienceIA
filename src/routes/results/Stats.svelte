<script lang="ts">
	import { dataStore } from '../stores';
	import type { dataPackage } from '../parseWorker';
	import isServer from '../../lib/util/isServer';

	let data;
	if (!isServer()) {
		dataStore.subscribe((value) => (data = value));
		if (!data) {
			console.log('couldnt find data in svelte store. falling back to localstorage...');
			const stringedData = globalThis.localStorage.getItem('data');
			if (stringedData) {
				data = JSON.parse(stringedData) as dataPackage;
			} else {
				console.log('no data found in local storage');
			}
		}
	}
</script>

<div class="grid grid-cols-3 grid-rows-3 w-full">
	<div class="bg-red-500 h-96 row-span-3" />
	<div class="bg-green-500 row-span-3" />
	<div class="bg-purple-500" />
	<div class="bg-yellow-500" />
	<div class="bg-white" />
</div>
