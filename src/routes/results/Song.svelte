<script lang="ts">
	export let songAlbum: string;
	export let songTitle: string;
	export let songArtist: string;
	export let num: number;
	export let plays: number;
	export let rating: number | undefined;
	import padNum from '../../lib/util/padNum';

	let imageSource = new URL(globalThis.location.origin + '/api/albumArt');
	imageSource.searchParams.set('album', songAlbum);
	imageSource.searchParams.set('artist', songArtist);
</script>

<div
	class="mb-2 min-w-[10rem] border border-solid border-gray-300 w-full flex items-center px-4 py-2 rounded shadow bg-gray-50"
>
	<span class="pr-4 text-gray-500 font-mono">{padNum(num, 2)}</span>
	<img
		src={imageSource.href}
		class="aspect-square w-14 border border-solid border-gray-300 shadow-xs flex text-center text-xs items-center justify-center"
		alt="Album art"
	/>
	<div class="flex flex-col mx-4">
		<div class="font-medium">{songTitle}</div>
		<div class="text-xs">{songArtist}</div>
	</div>
	<div class="grow flex flex-col items-end">
		<div class="mb-1">
			<span class="font-mono grow">{plays}</span><span class="text-xs text-gray-600"
				>&#160;plays</span
			>
		</div>
		{#if rating != undefined}
			<div class="flex">
				<svg class="hidden">
					<path   id="star"
							d="M16 1L19.5922 12.0557H31.2169L21.8123 18.8885L25.4046 29.9443L16 23.1115L6.59544 29.9443L10.1877 18.8885L0.783095 12.0557H12.4078L16 1Z"
						/>
				</svg>
				{#each { length: 5 - rating/20 } as _}
					<svg
						width="14"
						height="14"
						viewBox="0 0 32 32"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<use href="#star" fill="#CCC"></use>
					</svg>
				{/each}
				{#each { length: rating/20 } as _}
					<svg
						width="14"
						height="14"
						viewBox="0 0 32 32"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<use href="#star" fill="#000"></use>
					</svg>
				{/each}
			</div>
		{/if}
	</div>
</div>
