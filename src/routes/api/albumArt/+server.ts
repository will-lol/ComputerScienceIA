import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async ({ url }) => {
	const album = url.searchParams.get('album');
	const artist = url.searchParams.get('artist');
	if (!album || !artist) {
		return new Response(null, { status: 400 });
	}

	let href: string;
	try {
		href = await getAlbumArtURL(album, artist);
	} catch {
		return new Response(
			`<svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="256" height="256" fill="#CBD5E1"/><path d="M140.6 195.2C140.6 198.4 138.8 200 135.2 200H111.4C109.8 200 108.667 199.667 108 199C107.467 198.333 107.2 197.267 107.2 195.8V171C107.2 168.6 108.267 167.4 110.4 167.4H137.8C139.667 167.4 140.6 168.467 140.6 170.6V195.2ZM77.4 84.4C76.3333 84.1333 75.7333 83.5333 75.6 82.6C75.4667 81.6667 75.5333 80.8 75.8 80C80.0667 70.2667 86.6 62.8 95.4 57.6C104.2 52.2667 114.667 49.6 126.8 49.6C136.8 49.6 145.4 51.2 152.6 54.4C159.933 57.4667 165.6 61.6667 169.6 67C173.733 72.2 175.8 78.0667 175.8 84.6C175.8 90.8667 174.467 96.2 171.8 100.6C169.133 105 165.867 108.933 162 112.4C158.133 115.867 154.2 119.333 150.2 122.8C146.333 126.133 143.067 129.867 140.4 134C137.733 138.133 136.4 143.2 136.4 149.2C136.4 150.267 136 151.2 135.2 152C134.533 152.667 133.6 153 132.4 153H116C113.2 153 111.8 151.467 111.8 148.4C111.8 141.333 112.933 135.267 115.2 130.2C117.467 125.133 120.267 120.733 123.6 117C126.933 113.133 130.2 109.6 133.4 106.4C136.733 103.2 139.533 100 141.8 96.8C144.2 93.6 145.4 90.0667 145.4 86.2C145.4 81.4 143.6 77.6 140 74.8C136.4 72 131.933 70.6 126.6 70.6C123.133 70.6 119.733 71.2667 116.4 72.6C113.067 73.9333 110.133 75.8667 107.6 78.4C105.067 80.9333 103.067 83.8667 101.6 87.2C101.067 88.2667 100.533 88.9333 100 89.2C99.4667 89.3333 98.6 89.3333 97.4 89.2L77.4 84.4Z" fill="#94A3B8"/></svg>`,
			{ status: 200, headers: { 'content-type': 'image/svg+xml' } }
		);
	}

	throw redirect(303, href);
}) satisfies RequestHandler;

async function releaseGroupQuery(albumName: string, artistName: string) {
	const query = `artist:${artistName} AND release-group:${albumName}`;
	const searchResults = await fetch(
		`https://musicbrainz.org/ws/2/release-group?query=${encodeURIComponent(query)}&fmt=json`
	)
		.then((res) => res.json())
		.catch(() => {
			throw 'couldnt connect to search results';
		});
	if (searchResults.count > 0) {
		return searchResults['release-groups'];
	} else {
		throw 'album not found';
	}
}

async function releaseQuery(albumName: string, artistName: string) {
	const query = `artist:${artistName} AND release:${albumName}`;
	const searchResults = await fetch(
		`https://musicbrainz.org/ws/2/release?query=${encodeURIComponent(query)}&fmt=json`
	)
		.then((res) => res.json())
		.catch(() => {
			throw 'couldnt connect to search results';
		});
	if (searchResults.count > 0) {
		return searchResults.releases;
	} else {
		throw 'album not found';
	}
}

async function getAlbumArtURL(albumName: string, artistName: string) {
	let albumArtURL: string;
	try {
		const albumId = await releaseQuery(albumName, artistName).catch(() => {
			throw 'album not found';
		});
		albumArtURL = await fetchAlbumArtUrl(albumId, 'release').catch(() => {throw 'album not found'});
	} catch {
		const albumId = await releaseGroupQuery(albumName, artistName).catch(() => {
			throw 'album not found';
		});
		console.log(albumName);
		albumArtURL = await fetchAlbumArtUrl(albumId, 'release-group').catch(() => {throw 'album not found'});
	}
	return albumArtURL;
}

async function fetchAlbumArtUrl(albumArr: any, type: string) {
	if (albumArr.length > 0) {
		for (let i = 0; i < (albumArr.length > 2 ? 2 : albumArr.length); i++) {
			try {
				console.log(albumArr);
				let albumArtURL = await fetch(`https://coverartarchive.org/${type}/${albumArr[0].id}`)
				.then((res) => res.json().then((res) => res.images[0].thumbnails.small))
				return albumArtURL;
			} catch {}
		}
		throw ('album art not found')
	}
}