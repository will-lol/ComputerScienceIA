<script lang="ts">
	import { dataStore } from '../stores';
	import type { dataPackage, song, album, artist, overallStats } from '../parseWorker';
	import isServer from '../../lib/util/isServer';
	import BinarySearchTree from '../../lib/util/binarySearchTree';
	import InOrderTreeCursor from '../../lib/util/treeCursor';
	import Song from './Song.svelte';
	import TopAlbums from './TopAlbums.svelte';
	import TopArtists from './TopArtists.svelte';
	import Overall from './Overall.svelte';
	import IPod from './iPod.svelte';
	import Button from '../../lib/components/Button.svelte';

	let data: dataPackage | undefined = undefined;
	let songCount: number = 0;
	let topTracks: song[] = Array(10);
	let trackCursor: InOrderTreeCursor<song>;
	let topAlbums: album[] = [];
	let topArtists: artist[] = [];
	let overall: overallStats = { totalPlays: 0, totalTime: 0, totalSongs: 0 };

	function stringDefault(thing: string | undefined): string {
		if (thing == undefined) {
			return '';
		} else {
			return thing;
		}
	}

	function playCountDefault(thing: number | undefined): number {
		if (thing == undefined) {
			return 0;
		} else {
			return thing;
		}
	}

	function durationDefault(thing: number | undefined): number {
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
			return thing / 20;
		}
	}

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

		return two * ratingDefault(twoRating) - one * ratingDefault(oneRating);
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
			one = '';
		}
		if (two == undefined) {
			two = '';
		}
		return two.localeCompare(one);
	}
	function artistComparatorName(artistOne: artist, artistTwo: artist) {
		let one = artistOne.name;
		let two = artistTwo.name;
		if (one == undefined) {
			one = '';
		}
		if (two == undefined) {
			two = '';
		}
		return two.localeCompare(one);
	}
	function artistComparatorPlay(artistOne: artist, artistTwo: artist) {
		let one = artistOne.plays;
		let two = artistTwo.plays;
		if (one == undefined) {
			one = 0;
		}
		if (two == undefined) {
			two = 0;
		}
		return two - one;
	}

	if (!isServer()) {
		dataStore.subscribe((value) => (data = value));
		if (!data) {
			console.log('couldnt find data in svelte store. falling back to localstorage...');
			const stringedData = globalThis.localStorage.getItem('data');
			if (stringedData) {
				data = JSON.parse(stringedData) as dataPackage;
			} else {
				throw 'no data found in local storage';
			}
		}

		let songArray = data.songs;
		songCount = songArray.length;
		let numberOfSongsWithRatings = 0;
		for (const song of songArray) {
			if (song.rating != undefined) {
				numberOfSongsWithRatings++;
			}
		}
		const ratingRatio = numberOfSongsWithRatings / songArray.length;
		if (ratingRatio > 0.3) {
			playTree = new BinarySearchTree(songComparatorRating);
		} else {
			playTree = new BinarySearchTree(songComparatorPlay);
		}

		const albumNameTree = new BinarySearchTree(albumComparatorName);
		const artistNameTree = new BinarySearchTree(artistComparatorName);

		for (const song of songArray) {
			playTree.insert(song);
			if (song.playCount) {
				overall.totalPlays += song.playCount;
				if (song.playCount > 0) {
					overall.totalSongs++;
				}
				if (song.time) {
					overall.totalTime += song.playCount * song.time;
				}
			}

			const albumSearchResult = albumNameTree.search({
				name: song.album,
				plays: undefined,
				artist: undefined
			});
			if (albumSearchResult != undefined) {
				if (song.playCount) {
					albumSearchResult.plays =
						(albumSearchResult.plays != undefined ? albumSearchResult.plays : 0) + song.playCount;
				}
			} else {
				const albumObj = { name: song.album, artist: song.artist, plays: song.playCount };
				albumNameTree.insert(albumObj);
			}

			const artistSearchResult = artistNameTree.search({ name: song.artist, plays: undefined });
			if (artistSearchResult != undefined) {
				if (song.playCount) {
					artistSearchResult.plays =
						(artistSearchResult.plays != undefined ? artistSearchResult.plays : 0) + song.playCount;
				}
			} else {
				const artistObj = { name: song.artist, plays: song.playCount };
				artistNameTree.insert(artistObj);
			}
		}

		const albumPlayTree = new BinarySearchTree(albumComparatorPlay);
		const artistPlayTree = new BinarySearchTree(artistComparatorPlay);

		albumNameTree.copyTo(albumPlayTree);
		artistNameTree.copyTo(artistPlayTree);

		topAlbums = albumPlayTree.inOrderTraverse(10);
		topArtists = artistPlayTree.inOrderTraverse(5);
		trackCursor = new InOrderTreeCursor(playTree);

		playTree.inOrderTraverse(10);
		for (let i = 0; i < topTracks.length; i++) {
			topTracks[i] = trackCursor.next();
		}
	}
</script>

<div class="grid lg:grid-cols-[auto_auto_auto] w-full gap-4">
	<div class="flex">
		<div class="w-full">
			<h2 class="text-sm mb-1">iPod</h2>
			{#if topTracks[0] != undefined}
				<IPod
					duration={durationDefault(topTracks[0].time)}
					totalSongs={songCount}
					songArtist={stringDefault(topTracks[0].artist)}
					songTitle={stringDefault(topTracks[0].name)}
					songAlbum={stringDefault(topTracks[0].album)}
				/>
			{/if}
		</div>
	</div>
	<div>
		<h2 class="text-sm mb-1">Top tracks</h2>
		<div class="flex flex-col gap-2">
			{#if topTracks[0] != undefined}
				{#each topTracks as track, i}
					<Song
						rating={track.rating}
						plays={playCountDefault(track.playCount)}
						num={i + 1}
						songArtist={stringDefault(track.artist)}
						songTitle={stringDefault(track.name)}
						songAlbum={stringDefault(track.album)}
					/>
				{/each}
			{/if}
			<Button transparent on:click={() => {
				for (let i = 0; i < 10; i ++) {
					topTracks.push(trackCursor.next())
				}
				topTracks = topTracks;
			}} >Show more</Button>
		</div>
	</div>
	<div class="flex flex-col gap-2">
		<div>
			<h2 class="text-sm mb-1">Top albums</h2>
			<TopAlbums albums={topAlbums} />
		</div>
		<div>
			<h2 class="text-sm mb-1">Top artists</h2>
			<TopArtists artists={topArtists} />
		</div>
		<div>
			<h2 class="text-sm mb-1">Overall</h2>
			<Overall
				totalPlays={overall.totalPlays}
				totalSongs={overall.totalSongs}
				totalTime={overall.totalTime}
			/>
		</div>
	</div>
</div>
