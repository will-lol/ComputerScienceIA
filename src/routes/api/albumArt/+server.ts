import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = ( async ({url}) => {
    const album = url.searchParams.get("album");
    const artist = url.searchParams.get("artist");
    if (!album || !artist) {
        return new Response(null, { status: 400 })
    }

    let href: string;
    try {
        href = await getAlbumArtURL(album, artist);
    } catch {
        return new Response(null, {status: 404})
    }
     
    throw redirect(303, href);

}) satisfies RequestHandler;

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
            (res) => res.json().then((res) => res.images[0].thumbnails.small)
        );
    } catch {
        throw 'album art not found';
    }
    return albumArtURL;
}