<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import simplexWorkerCreator from './simplexWorker?worker';
	import noiseWorkerCreator from './noiseWorker?worker';
	import workerToPromise from '../lib/util/workerToPromise';

	let simplexWorker: Worker;
	let noiseWorker: Worker;

	const onServer = typeof process === 'object';
	if (!onServer) {
		simplexWorker = new simplexWorkerCreator();
		noiseWorker = new noiseWorkerCreator();
	}

	let canvas: HTMLCanvasElement;
	let noiseOverlay: HTMLCanvasElement;
	let animationController = new AbortController();

	onMount(async () => {
		//generate noise overlay
		if (!onServer) {
			renderNoise(noiseOverlay);
			fadeIn(noiseOverlay);
		}

		//generate simplex noise and animate
		const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotionQuery.addEventListener('change', async () => {
			if (reducedMotionQuery.matches) {
				animationController.abort();
				renderSimplexNoise(canvas, animationController);
			}
		});

		if (!onServer) {
			renderSimplexNoise(canvas, animationController);
			fadeIn(canvas);
		}
	});

	function fadeIn(elem: HTMLElement) {
		elem.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1000, fill: 'forwards' });
	}

	async function renderNoise(canvas: HTMLCanvasElement) {
		const boundingClientRect = canvas.getBoundingClientRect();
		const ctx = canvas.getContext('2d')!;
		noiseOverlay.height = boundingClientRect.height;
		noiseOverlay.width = boundingClientRect.width;

		let imgData: Promise<Uint8ClampedArray>;
		let img: ImageData;

		imgData = workerToPromise(noiseWorker, {
			width: noiseOverlay.width,
			height: noiseOverlay.height
		});
		img = new ImageData(await imgData, noiseOverlay.width, noiseOverlay.height);
		ctx.putImageData(img, 0, 0);
	}

	function renderSimplexNoise(canvas: HTMLCanvasElement, controller: AbortController) {
		const boundingClientRect = canvas.getBoundingClientRect();
		canvas.height = boundingClientRect.height / 20;
		canvas.width = boundingClientRect.width / 20;
		const ctx = canvas.getContext('2d')!;

		if (!controller.signal.aborted) {
			const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
			if (reducedMotionQuery.matches) {
				controller.abort();
			}
		}

		frame(ctx, canvas.width, canvas.height, 0, 0, controller.signal);
	}

	let timeoutID: number;

	function resize() {
		clearTimeout(timeoutID);
		timeoutID = setTimeout(() => {
			renderNoise(noiseOverlay);
		}, 100);
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
			const imgData: Promise<Uint8ClampedArray> = workerToPromise(simplexWorker, {
				width: canvas.width,
				height: canvas.height,
				timeAxis: timeAxis
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
