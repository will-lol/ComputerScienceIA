<script lang="ts">
	import ListItem from '$lib/components/ListItem.svelte';
	import OrderedList from '$lib/components/OrderedList.svelte';
	import Button from '$lib/components/Button.svelte';
	import Ellipses from '$lib/components/Ellipses.svelte';
	import parseWorkerCreator from './parseWorker?worker';
	import workerToPromise from '$lib/util/workerToPromise';
	import { dataStore } from '$lib/util/stores';
	import type { dataPackage } from '$lib/util/zod';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let state = "I've saved the file!";
	let alreadyLoaded: boolean;
	let labelFileUpload: HTMLLabelElement;

	let files: FileList | undefined;
	$: if (files != undefined) {
		if (files[0]) {
			state = 'Fetching parser';
			parse(files[0]);
		}
	}

	onMount(() => {
		alreadyLoaded = localStorage.getItem("data") != null;
	})

	async function parse(file: File) {
		const parseWorker = new parseWorkerCreator();
		state = 'Parsing';
		let data: dataPackage;
		try {
			data = (await workerToPromise(parseWorker, await file.text())) as dataPackage;
			dataStore.setWithLocalStorage(data);
			state = 'Parsed. Redirecting';
			goto('/results', { replaceState: false });
		} catch {
			state = 'Parser error. Try reloading this page and exporting and adding the XML file again.';
		}
	}
</script>

<div class="sm:my-20">
	<OrderedList>
		<ListItem>Open the Apple Music app on your Mac</ListItem>
		<ListItem>Find the menu bar item 'File'</ListItem>
		<ListItem>Go to 'Library'</ListItem>
		<ListItem>Click 'Export Library...'</ListItem>
		<ListItem>Save the file</ListItem>
	</OrderedList>
</div>
<input id="file" accept=".xml" type="file" class="hidden" bind:files />
<Button on:click={() => labelFileUpload.click()} disabled={state != "I've saved the file!"} fullWidth primary absoluteBottom
		><label
			bind:this={labelFileUpload}
			for="file"
			class="cursor-pointer absolute top-0 left-0 w-full h-full flex justify-center items-center"
		>
			{state}
			{#if state == "Parsing"}
				<Ellipses />
			{/if}
		</label></Button
>
