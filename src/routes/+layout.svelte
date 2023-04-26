<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import randIntBetweenInc from '$lib/util/randIntBetweenInc';
	import { createNoise3D } from 'simplex-noise';

	let canvas: HTMLCanvasElement;
	let noiseOverlay: HTMLCanvasElement;

	//position is between 0 and 1
	function gradient(position: number): number[] {
		//colours in rgb format
		const colours = [
			[215, 201, 218],
			[233, 231, 170],
			[248, 207, 195]
		];

		const output = Array<number>(colours[0].length);
		for (let j = 0; j < colours[0].length; j++) {
			output[j] = lerp(
				colours.map((num: number[]) => num[j]),
				position
			);
		}
		return output;
	}

	function lerp(numbers: number[], a: number) {
		const arrayPos = a * (numbers.length - 1);
		const arrayPosTrunc = Math.trunc(arrayPos);
		const relativePos = (a - arrayPosTrunc / (numbers.length - 1)) * (numbers.length - 1);

		return numbers[arrayPosTrunc] * (1 - relativePos) + numbers[arrayPosTrunc + 1] * relativePos;
	}

	onMount(() => {
		const boundingClientRect = canvas.getBoundingClientRect();

		//generate noise overlay
		const noiseCtx = noiseOverlay.getContext('2d')!;
		noiseOverlay.height = boundingClientRect.height;
		noiseOverlay.width = boundingClientRect.width;

		const img = noiseCtx.createImageData(noiseOverlay.width, noiseOverlay.height);

		for (let x = 0; x < img.width; x++) {
			for (let y = 0; y < img.height; y++) {
				const index = (x + y * img.width) * 4;
				const rand = randIntBetweenInc(0, 255);
				img.data[index] = rand;
				img.data[index + 1] = rand;
				img.data[index + 2] = rand;
				img.data[index + 3] = 15;
			}
		}

		noiseCtx.putImageData(img, 0, 0);

		//generate simplex noise and animate
		const ctx = canvas.getContext('2d')!;
		canvas.height = boundingClientRect.height / 20;
		canvas.width = boundingClientRect.width / 20;
		const noise3d = createNoise3D();

		const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		let isReducedMotion = reducedMotionQuery.matches;
		reducedMotionQuery.addEventListener('change', () => {
			isReducedMotion = reducedMotionQuery.matches;
			if (isReducedMotion) {
				frame();
			}
		});

		let timeAxis = 0;
		const divider = 70;

		frame();

		function frame() {
			const img = ctx.createImageData(canvas.width, canvas.height);

			for (let x = 0; x < img.width; x++) {
				for (let y = 0; y < img.height; y++) {
					const index = (x + y * img.width) * 4;
					const colourArray = gradient((noise3d(x / divider, y / divider, timeAxis) + 1) / 2);
					img.data[index] = colourArray[0];
					img.data[index + 1] = colourArray[1];
					img.data[index + 2] = colourArray[2];
					img.data[index + 3] = 255;
				}
			}

			timeAxis = timeAxis + 0.005;
			ctx.putImageData(img, 0, 0);
			if (!isReducedMotion) {
				requestAnimationFrame(frame);
			}
		}
	});
</script>

<canvas bind:this={canvas} class="fixed w-screen h-screen pointer-events-none z-0" />
<canvas bind:this={noiseOverlay} class="fixed w-screen h-screen pointer-events-none z-0" />

<slot />
