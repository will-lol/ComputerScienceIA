<script lang="ts">
	import ListItem from '../lib/components/ListItem.svelte';
	import OrderedList from '../lib/components/OrderedList.svelte';
	import Button from '../lib/components/Button.svelte';
	import Ellipses from '../lib/components/Ellipses.svelte';
	import parseWorkerCreator from './parseWorker?worker';
	import workerToPromise from '../lib/util/workerToPromise';
	import type Parser from 'web-tree-sitter';

	let processing: boolean = false;

	let files: FileList | undefined;
	$: if (files != undefined) {
		if (files[0]) {
			processing = true;
			parse(files[0]);
		}
	}

	type metadata = {
		data: Date;
	};

	type song = {
		name: string;
		artist: string;
		album: string;
		genre: string;
		time: number;
		playCount: number;
		skipCount: number;
		rating?: number;
	};

	async function parse(file: File) {
		const parseWorker = new parseWorkerCreator();
		console.log(await workerToPromise(parseWorker, await file.text()));
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
<Button disabled={processing} fullWidth primary absoluteBottom
	><label
		for="file"
		class="cursor-pointer absolute top-0 left-0 w-full h-full flex justify-center items-center"
	>
		{#if !processing}
			I've saved the file!
		{:else}
			Processing<Ellipses />
		{/if}
	</label></Button
>
