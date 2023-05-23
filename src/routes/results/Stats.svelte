<script lang="ts">
	import { dataStore } from '../stores';
	import type { dataPackage, song, album } from '../parseWorker';
	import isServer from '../../lib/util/isServer';
	import BinarySearchTree from '../../lib/util/binarySearchTree';
	import Song from './Song.svelte';
	import TopAlbums from './TopAlbums.svelte';
	import TopArtists from './TopArtists.svelte';
	import Overall from './Overall.svelte';

	let data: dataPackage | undefined = undefined;
	let topTracks: song[] = [];
	let topAlbums: album[] = [];
	
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
		let numberOfSongsWithRatings = 0;
		for (const song of songArray) {
			if (song.rating != undefined) {
				numberOfSongsWithRatings++
			}
		}
		const ratingRatio = numberOfSongsWithRatings/songArray.length;
		function songComparatorRating(songOne: song, songTwo: song) {
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

			return (two * ratingDefault(twoRating)) - (one * ratingDefault(oneRating));
		}

		function songComparatorPlay(songOne: song, songTwo: song) {
			let one = songOne.playCount;
			let two = songTwo.playCount;
			if (one == undefined) {
				one = 0;
			} 
			if (two == undefined) {
				two = 0;
			}

			return two - one;
		}
		let playTree: BinarySearchTree<song>;
		
		function albumComparatorPlay(albumOne: album, albumTwo: album) {
			let one = albumOne.plays;
			let two = albumTwo.plays;
			if (one == undefined) {
				one = 0;
			} 
			if (two == undefined) {
				two = 0;
			}
			return two - one;
		}
		function albumComparatorName(albumOne: album, albumTwo: album) {
			let one = albumOne.name;
			let two = albumTwo.name;
			if (one == undefined) {
				one = ""
			} 
			if (two == undefined) {
				two = ""
			}
			return two.localeCompare(one);
		}
		const albumNameTree = new BinarySearchTree(albumComparatorName);
		if (ratingRatio > 0.3) {
			playTree = new BinarySearchTree(songComparatorRating);
		} else {
			playTree = new BinarySearchTree(songComparatorPlay);
		}
		let totalTime = 0;
		for (const song of songArray) {
			playTree.insert(song);
			if (song.playCount && song.time) {
				totalTime += song.playCount * song.time;
			}

			const searchResult = albumNameTree.search({ name: song.album, plays: undefined, artist: undefined });
			if (searchResult != undefined) {
				if (song.playCount) {
					searchResult.plays = (searchResult.plays != undefined ? searchResult.plays : 0) + song.playCount;
				}
			} else {
				const albumObj = { name: song.album, artist: song.artist, plays: song.playCount };
				albumNameTree.insert(albumObj);
			}
		}

		const albumPlayTree = new BinarySearchTree(albumComparatorPlay);
		albumNameTree.copyTo(albumPlayTree);

		topAlbums = albumPlayTree.inOrderTraverse(10);
		console.log(topAlbums);
		topTracks = playTree.inOrderTraverse(10);
	}

	function stringDefault(thing: string | undefined): string {
		if (thing == undefined) {
			return "";
		} else {
			return thing;
		}
	}

	function numberDefault(thing: number | undefined): number {
		if (thing == undefined) {
			return 0;
		} else {
			return thing;
		}
	}

	function ratingDefault(thing: number | undefined): number {
		if (thing == undefined) {
			return 2.5;
		} else {
			return thing/20;
		}
	}

	
</script>

<div class="grid lg:grid-cols-[auto_auto_auto] grid-rows-3 w-full gap-4">
	<div class="row-span-3">
		<h2 class="text-sm mb-2">iPod</h2> 
	</div>
	<div class="row-span-3">
		<h2 class="text-sm mb-2">Top tracks</h2>
		{#each topTracks as track, i}
			<Song rating={track.rating} plays={numberDefault(track.playCount)} num={i+1} songArtist={stringDefault(track.artist)} songTitle={stringDefault(track.name)} songAlbum={stringDefault(track.album)}></Song>
		{/each}
	</div>
	<div class="">
		<h2 class="text-sm mb-2">Top albums</h2>
		<TopAlbums albums={topAlbums}/>
	</div>
	<div class="">
		<h2 class="text-sm mb-2">Top artists</h2>
		<TopArtists/>
	</div>
	<div class="">
		<h2 class="text-sm mb-2">Overall</h2>
		<Overall/>
	</div>
</div>
