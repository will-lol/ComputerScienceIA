<script lang="ts">
	import type { artist } from "../parseWorker";

    export let artists: artist[];
</script>

<div class="min-w-[10rem] border border-solid border-gray-300 bg-opacity-75 w-full flex px-4 py-3 rounded shadow bg-gray-50">
    <ol class="list-decimal list-inside">
        {#each artists as artist}
        <li class="mb-2">
            {artist.name}
        </li>
        {/each}
    </ol>
</div>