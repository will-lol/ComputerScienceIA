<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import simplexWorkerCreator from './simplexWorker?worker';
	import noiseWorkerCreator from './noiseWorker?worker';

	let simplexWorker: Worker;
	let noiseWorker: Worker;

	const onServer = typeof process === 'object';
	if (!onServer) {
		simplexWorker = new simplexWorkerCreator();
		noiseWorker = new noiseWorkerCreator();
	}

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let noiseOverlay: HTMLCanvasElement;
	let animationController = new AbortController();

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
			fadeIn(noiseOverlay);
		}

		//generate simplex noise and animate
		ctx = canvas.getContext('2d')!;
		const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotionQuery.addEventListener('change', async () => {
			if (reducedMotionQuery.matches) {
				animationController.abort();
				renderSimplexNoise(ctx, animationController);
			}
		});

		if (!onServer) {
			await renderSimplexNoise(ctx, animationController);
			fadeIn(canvas);
		}

		function fadeIn(elem: HTMLElement) {
			elem.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1000, fill: 'forwards' });
		}
	});

	async function renderSimplexNoise(ctx: CanvasRenderingContext2D, controller: AbortController) {
		const boundingClientRect = canvas.getBoundingClientRect();
		canvas.height = boundingClientRect.height / 20;
		canvas.width = boundingClientRect.width / 20;

		if (!controller.signal.aborted) {
			const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
			if (reducedMotionQuery.matches) {
				controller.abort();
			}
		}

		await frame(ctx, canvas.width, canvas.height, 0, 0, controller.signal);
	}

	let timeoutID: number;
	
	function resize() {
		clearTimeout(timeoutID);
		timeoutID = setTimeout(() => {
			animationController.abort();
			animationController = new AbortController();
			renderSimplexNoise(ctx, animationController);
		}, 100)
	}

	async function frame(
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number,
		timeAxis: number,
		count: number,
		signal: AbortSignal
	) {
		if (count == 10 || signal.aborted) {
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
		if (!signal.aborted) {
			count++;
			requestAnimationFrame(() => frame(ctx, width, height, timeAxis, count, signal));
		}
	}
</script>

<svelte:window on:resize={resize} />
<canvas bind:this={canvas} class="opacity-0 fixed w-screen h-screen pointer-events-none -z-10" />
<canvas
	bind:this={noiseOverlay}
	class="opacity-0 fixed w-[100lvw] h-[100lvh] pointer-events-none -z-10"
/>

<div class="font-body">
	<slot />
</div>
