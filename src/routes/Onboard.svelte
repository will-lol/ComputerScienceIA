<script lang="ts">
	import ListItem from '../lib/components/ListItem.svelte';
	import OrderedList from '../lib/components/OrderedList.svelte';
	import Button from '../lib/components/Button.svelte';
	import Ellipses from '../lib/components/Ellipses.svelte';
	import parseWorkerCreator from './parseWorker?worker';
	import workerToPromise from '../lib/util/workerToPromise';
	import { dataStore } from './stores';
	import { goto } from '$app/navigation';
	import type { dataPackage } from './parseWorker';

	let state = "I've saved the file!";

	let files: FileList | undefined;
	$: if (files != undefined) {
		if (files[0]) {
			state = 'Fetching parser';
			parse(files[0]);
		}
	}

	async function parse(file: File) {
		const parseWorker = new parseWorkerCreator();
		state = 'Parsing';
		const data = await workerToPromise(parseWorker, await file.text()) as dataPackage;
		dataStore.set(data);
		globalThis.localStorage.setItem("data", JSON.stringify(data));
		state = 'Parsed. Redirecting';
		goto("/results", { replaceState: false });
	}
</script>

<OrderedList>
	<ListItem>Open the Apple Music app on your Mac</ListItem>
	<ListItem>Find the menu bar item 'File'</ListItem>
	<ListItem>Go to 'Library'</ListItem>
	<ListItem>Click 'Export Library...'</ListItem>
	<ListItem>Save the file</ListItem>
</OrderedList>
<input id="file" accept=".xml" type="file" class="hidden" bind:files />
<Button disabled={state != "I've saved the file!"} fullWidth primary absoluteBottom
	><label
		for="file"
		class="cursor-pointer absolute top-0 left-0 w-full h-full flex justify-center items-center"
	>
		{state}
		{#if state != "I've saved the file!"}
			<Ellipses />
		{/if}
	</label></Button
>
