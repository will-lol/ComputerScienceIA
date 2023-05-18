<script lang="ts">
	import { dataStore } from '../stores';
	import type { dataPackage, song } from '../parseWorker';
	import isServer from '../../lib/util/isServer';
	import BinarySearchTree from '../../lib/util/binarySearchTree';
	import Song from '../../lib/components/Song.svelte';

	let data: dataPackage | undefined = undefined;
	let topTracks: song[] = [];
	if (!isServer()) {
		dataStore.subscribe((value) => (data = value));
		if (!data) {
			console.log('couldnt find data in svelte store. falling back to localstorage...');
			const stringedData = globalThis.localStorage.getItem('data');
			if (stringedData) {
				data = JSON.parse(stringedData) as dataPackage;
			} else {
				throw('no data found in local storage');
			}
		}
		const songArray = data.songs;
		function songPlayComparator(songOne: song, songTwo: song) {
			let one = songOne.playCount;
			let two = songTwo.playCount;
			let oneRating = songOne.rating;
			let twoRating = songTwo.rating;
			if (one == undefined) {
				one = 0;
			} 
			if (two == undefined) {
				two = 0;
			}

			if (oneRating == undefined) {
				oneRating = 2.5;
			} 
			if (twoRating == undefined) {
				twoRating = 2.5;
			}

			return (two * twoRating) - (one * oneRating);
		}
		const playTree = new BinarySearchTree(songPlayComparator);
		let totalTime = 0;
		for (const song of songArray) {
			playTree.insert(song);
			if (song.playCount && song.time) {
				totalTime += song.playCount * song.time;
			}
		}
		topTracks = playTree.inOrderTraverse(10);
	}

	function removeAmbiguity(string: string | undefined): string {
		if (string == undefined) {
			return "";
		} else {
			return string;
		}
	}
</script>

<div class="grid sm:grid-cols-3 grid-rows-3 w-full gap-4">
	<div class="row-span-3">
		<h2 class="text-sm mb-2">iPod</h2> 
	</div>
	<div class="row-span-3">
		<h2 class="text-sm mb-2">Top tracks</h2>
		{#each topTracks as track, i}
			<Song num={i+1} songArtist={removeAmbiguity(track.artist)} songTitle={removeAmbiguity(track.name)} songAlbum={removeAmbiguity(track.album)}></Song>
		{/each}
	</div>
	<div class="">
		<h2 class="text-sm mb-2">Top albums</h2>
	</div>
	<div class="">
		<h2 class="text-sm mb-2">Top artists</h2>
	</div>
	<div class="">
		<h2 class="text-sm mb-2">Overall</h2>
	</div>
</div>
