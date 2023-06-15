<script lang="ts">
    export let totalSongs: number;
    export let totalPlays: number;
    export let totalTime: number;
</script>

<div class="min-w-full border border-solid border-gray-300 w-full bg-opacity-75 px-4 py-3 rounded shadow bg-gray-50 text-gray-600">
    Overall, you listened to&#160;<span class="font-mono text-black">{totalSongs}</span>&#160;unique tracks. With&#160;<span class="font-mono text-black">{totalPlays}</span>&#160;plays across these tracks, spanning&#160;<span class="font-mono text-black">{Math.round(totalTime/1000/60)}</span>&#160;minutes.
</div>