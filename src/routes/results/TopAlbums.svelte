<script lang="ts">
	import type { album } from "../parseWorker";

    export let albums: album[];
</script>

<div class="min-w-[10rem] border border-solid border-gray-300 bg-opacity-75 w-full flex px-4 py-3 rounded shadow bg-gray-50">
    <ol class="list-decimal list-inside">
        {#each albums as album}
        <li class="mb-1 mt-1">
            {album.name}
        </li>
        {/each}
    </ol>
</div>