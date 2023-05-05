<script lang="ts">
	import ListItem from '../lib/components/ListItem.svelte';
	import OrderedList from '../lib/components/OrderedList.svelte';
	import Button from '../lib/components/Button.svelte';
	import Ellipses from '../lib/components/Ellipses.svelte';
	import TokenReader from "../lib/util/TokenReader";

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
		const buffer = await file.arrayBuffer();
		const reader = new TokenReader(buffer);
		
		for (let i = 0; i < 250000; i++) {
			reader.read();
		}
		console.log("done")
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
