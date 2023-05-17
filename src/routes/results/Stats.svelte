<script lang="ts">
	import { dataStore } from '../stores';
	import type { dataPackage, song } from '../parseWorker';
	import isServer from '../../lib/util/isServer';
	import BinarySearchTree from '../../lib/util/binarySearchTree';

	let data: dataPackage | undefined = undefined;
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
			if (songOne.playCount == undefined || songTwo.playCount == undefined) {
				return 0;
			}
			return songOne.playCount - songTwo.playCount;
		}
		const playTree = new BinarySearchTree(songPlayComparator);
		let totalTime = 0;
		for (const song of songArray) {
			playTree.insert(song);
			if (song.playCount && song.time) {
				totalTime += song.playCount * song.time;
			}
		}
		console.log(playTree.inOrderTraverse(5));
	}

	async function getAlbumArtURL(albumName: string, artistName: string) {
		const query = `artist:${artistName} AND release-group:${albumName}`;
		let albumId: string;
		try {
			albumId = await fetch(
				`https://musicbrainz.org/ws/2/release-group?query=${encodeURIComponent(query)}&fmt=json`
			).then((res) => res.json().then((res) => res['release-groups'][0].id));
		} catch {
			throw 'album not found';
		}
		let albumArtURL;
		try {
			albumArtURL = await fetch(`https://coverartarchive.org/release-group/${albumId}`).then(
				(res) => res.json().then((res) => res.images[0].thumbnails['250'])
			);
		} catch {
			throw 'album art not found';
		}
		return albumArtURL;
	}
</script>

<div class="grid sm:grid-cols-3 grid-rows-3 w-full">
	<div class="row-span-3">iPod</div>
	<div class="row-span-3">Top tracks</div>
	<div class="">Top albums</div>
	<div class="">Top artists</div>
	<div class="">Overall</div>
</div>
