<script lang="ts">
    export let songAlbum: string;
    export let songTitle: string;
    export let songArtist: string;
    export let num: number | undefined = undefined;
    import { onMount } from "svelte";

    let imageSource = new URL(globalThis.location.origin + "/api/albumArt");
    imageSource.searchParams.set("album", songAlbum);
    imageSource.searchParams.set("artist", songArtist);
    

</script>

<div class="mb-2 min-w-[10rem] w-full flex items-center bg-gray-100 px-4 py-2 rounded shadow">
    {#if num != undefined} 
        <span class="pr-3 font-mono">{num}</span>
    {/if}
    <img src={imageSource.href} class="aspect-square w-14 border border-solid border-gray-300 shadow-xs flex text-center text-xs items-center justify-center" alt="Album art">
    <div class="flex flex-col mx-4">
        <div class="font-medium">{songTitle}</div>
        <div class="text-xs">{songArtist}</div>    
    </div>
</div>