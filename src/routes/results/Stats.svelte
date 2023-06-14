<script lang="ts">
	import type { dataPackage, song, album, artist, overallStats } from '$lib/util/zod';
	import { stringDefault, playCountDefault, durationDefault, ratingDefault } from '$lib/util/defaultType'
	import isServer from '$lib/util/isServer';
	import BinarySearchTree from '$lib/util/binarySearchTree';
	import InOrderTreeCursor from '$lib/util/treeCursor';
	import Song from './Song.svelte';
	import TopAlbums from './TopAlbums.svelte';
	import TopArtists from './TopArtists.svelte';
	import padNum from '$lib/util/padNum';
	import Overall from './Overall.svelte';
	import IPod from './iPod.svelte';
	import Button from '$lib/components/Button.svelte';

	export let songs: song[];
	let songCount: number = 0;
	let topTracks: song[] = Array(10);
	let trackCursor: InOrderTreeCursor<song>;
	let topAlbums: album[] = [];
	let topArtists: artist[] = [];
	let overall: overallStats = { totalPlays: 0, totalTime: 0, totalSongs: 0 };

	function songComparatorRating(songOne: song, songTwo: song) {
		return playCountDefault(songTwo.playCount) * ratingDefault(songTwo.rating) - playCountDefault(songOne.playCount) * ratingDefault(songOne.rating);
	}
	function songComparatorPlay(songOne: song, songTwo: song) {
		return playCountDefault(songTwo.playCount) - playCountDefault(songOne.playCount);
	}
	let playTree: BinarySearchTree<song>;

	function albumComparatorPlay(albumOne: album, albumTwo: album) {
		return playCountDefault(albumTwo.plays) - playCountDefault(albumOne.plays);
	}
	function albumComparatorName(albumOne: album, albumTwo: album) {
		return stringDefault(albumTwo.name).localeCompare(stringDefault(albumOne.name));
	}
	function artistComparatorName(artistOne: artist, artistTwo: artist) {
		return stringDefault(artistOne.name).localeCompare(stringDefault(artistTwo.name));
	}
	function artistComparatorPlay(artistOne: artist, artistTwo: artist) {
		return playCountDefault(artistTwo.plays) - playCountDefault(artistOne.plays);
	}

	if (!isServer()) {
		songCount = songs.length;
		let numberOfSongsWithRatings = 0;
		for (const song of songs) {
			if (song.rating != undefined) {
				numberOfSongsWithRatings++;
			}
		}
		const ratingRatio = numberOfSongsWithRatings / songs.length;
		if (ratingRatio > 0.3) {
			playTree = new BinarySearchTree(songComparatorRating);
		} else {
			playTree = new BinarySearchTree(songComparatorPlay);
		}

		const albumNameTree = new BinarySearchTree(albumComparatorName);
		const artistNameTree = new BinarySearchTree(artistComparatorName);

		for (const song of songs) {
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
