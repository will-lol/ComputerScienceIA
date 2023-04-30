<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import simplexWorkerCreator from './simplexWorker?worker';
	import noiseWorkerCreator from './noiseWorker?worker';

	let canvas: HTMLCanvasElement;
	let noiseOverlay: HTMLCanvasElement;
	let simplexWorker: Worker;
	let noiseWorker: Worker;
	const onServer = typeof process === 'object';
	if (!onServer) {
		simplexWorker = new simplexWorkerCreator();
		noiseWorker = new noiseWorkerCreator();
	}

	onMount(async () => {
		const boundingClientRect = canvas.getBoundingClientRect();

		//generate noise overlay
		const noiseCtx = noiseOverlay.getContext('2d')!;
		noiseOverlay.height = boundingClientRect.height;
		noiseOverlay.width = boundingClientRect.width;

		let imgData: Promise<Uint8ClampedArray>;
		let img: ImageData;

		if (!onServer) {
			imgData = new Promise((resolve, reject) => {
				noiseWorker.postMessage({ width: noiseOverlay.width, height: noiseOverlay.height });
				noiseWorker.onmessage = (e) => {
					resolve(e.data as Uint8ClampedArray);
				};
				noiseWorker.onmessageerror = (e) => {
					reject();
				};
			});
			img = new ImageData(await imgData, noiseOverlay.width, noiseOverlay.height);
			noiseCtx.putImageData(img, 0, 0);
		}

		//generate simplex noise and animate
		const ctx = canvas.getContext('2d')!;
		canvas.height = boundingClientRect.height / 20;
		canvas.width = boundingClientRect.width / 20;

		const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		let isReducedMotion = reducedMotionQuery.matches;
		reducedMotionQuery.addEventListener('change', () => {
			isReducedMotion = reducedMotionQuery.matches;
			if (isReducedMotion) {
				frame(canvas.width, canvas.height, 0, 0);
			}
		});

		if (!onServer) {
			await frame(canvas.width, canvas.height, 0, 0);
			fadeIn(canvas);
			fadeIn(noiseOverlay);
		}

		function fadeIn(elem: HTMLElement) {
			elem.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1000, fill: 'forwards' });
		}

		async function frame(width: number, height: number, timeAxis: number, count: number) {
			if (count == 10) {
				const imgData: Promise<Uint8ClampedArray> = new Promise((resolve, reject) => {
					simplexWorker.postMessage({
						width: canvas.width,
						height: canvas.height,
						timeAxis: timeAxis
					});
					simplexWorker.onmessage = (e) => {
						resolve(e.data as Uint8ClampedArray);
					};
					simplexWorker.onmessageerror = (e) => {
						reject();
					};
				});

				const img = new ImageData(await imgData, width, height);

				timeAxis = timeAxis + 0.03;
				ctx.putImageData(img, 0, 0);
				count = 0;
			}
			if (!isReducedMotion) {
				count++;
				requestAnimationFrame(() => frame(width, height, timeAxis, count));
			}
		}
	});
</script>

<canvas bind:this={canvas} class="opacity-0 fixed w-screen h-screen pointer-events-none -z-10" />
<canvas
	bind:this={noiseOverlay}
	class="opacity-0 fixed w-screen h-screen pointer-events-none -z-10"
/>

<div class="font-body">
	<slot />
</div>
