<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import simplexWorker from './simplexWorker?worker';
	import noiseWorker from './noiseWorker?worker';
	import workerToPromise from '$lib/util/workerToPromise';
	import Nav from '$lib/components/Nav.svelte';

	let simplexCanvas: HTMLCanvasElement;
	let simplexAnimator: SimplexNoiseAnimator;
	let noiseCanvas: HTMLCanvasElement;
	let noiseRenderer: NoiseRenderer;
	let resizeHandler: ResizeHandler;
	let animationController = new AbortController();

	//this onMount is where the background animation functions are called, it runs on client only
	onMount(async () => {
		//generate noise overlay
		noiseRenderer = new NoiseRenderer(noiseCanvas);
		noiseRenderer.renderNoise().then(() => fadeInElem(noiseCanvas));

		//generate simplex noise and animate
		simplexAnimator = new SimplexNoiseAnimator(simplexCanvas, animationController);
		simplexAnimator.startAnimating().then(() => fadeInElem(simplexCanvas));

		//create resize handler
		resizeHandler = new ResizeHandler(() => {
			noiseRenderer.updateSize();
			noiseRenderer.renderNoise();
		}, 100);
	});

	function fadeInElem(elem: HTMLElement) {
		elem.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1000, fill: 'forwards' });
	}

	class ResizeHandler {
		private currentTimeout: number | undefined;
		private callback: Function;
		private duration: number;

		constructor(callback: Function, timeoutDuration: number) {
			this.currentTimeout = 0;
			this.duration = timeoutDuration;
			this.callback = callback;
		}

		resizeHandler() {
			clearTimeout(this.currentTimeout);
			this.currentTimeout = setTimeout(this.callback, this.duration);
		}
	}

	class NoiseRenderer {
		private canvas: HTMLCanvasElement;
		private worker: Worker;
		private ctx: CanvasRenderingContext2D;

		constructor(canvas: HTMLCanvasElement) {
			this.worker = new noiseWorker();
			this.canvas = canvas;
			this.ctx = this.canvas.getContext('2d')!;
			this.updateSize();
		}

		updateSize() {
			const boundingClientRect = this.canvas.getBoundingClientRect();
			this.canvas.height = boundingClientRect.height;
			this.canvas.width = boundingClientRect.width;
		}

		async renderNoise() {
			let imgData: Promise<Uint8ClampedArray> = workerToPromise(this.worker, {
				width: this.canvas.width,
				height: this.canvas.height
			});
			let img = new ImageData(await imgData, this.canvas.width, this.canvas.height);
			this.ctx.putImageData(img, 0, 0);
		}
	}

	class SimplexNoiseAnimator {
		private ctx: CanvasRenderingContext2D;
		private controller: AbortController;
		private canvas: HTMLCanvasElement;
		private worker: Worker;

		constructor(canvas: HTMLCanvasElement, controller: AbortController) {
			const boundingClientRect = canvas.getBoundingClientRect();

			this.worker = new simplexWorker();

			this.canvas = canvas;
			this.controller = controller;
			this.ctx = canvas.getContext('2d')!;

			canvas.height = boundingClientRect.height / 20;
			canvas.width = boundingClientRect.width / 20;

			const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
			reducedMotionQuery.addEventListener('change', async () => {
				if (reducedMotionQuery.matches) {
					this.stopAnimating();
				}
			});

			if (reducedMotionQuery) {
				this.stopAnimating();
			}
		}

		async startAnimating() {
			await this.frame(0, 20);
		}

		stopAnimating() {
			this.controller.abort();
		}

		async frame(timeAxis: number, count: number) {
			if (count == 20 || this.controller.signal.aborted) {
				const imgData: Promise<Uint8ClampedArray> = workerToPromise(this.worker, {
					width: this.canvas.width,
					height: this.canvas.height,
					timeAxis: timeAxis
				});

				const img = new ImageData(await imgData, this.canvas.width, this.canvas.height);

				timeAxis = timeAxis + 0.01;
				this.ctx.putImageData(img, 0, 0);
				count = 0;
			}
			if (!this.controller.signal.aborted) {
				count++;
				requestAnimationFrame(() => this.frame(timeAxis, count));
			}
		}
	}
</script>

<svelte:window on:resize={resizeHandler.resizeHandler} />
<canvas
	bind:this={simplexCanvas}
	class="opacity-0 fixed w-[100lvw] h-[100lvh] pointer-events-none -z-10"
/>
<canvas
	bind:this={noiseCanvas}
	class="opacity-0 fixed w-[100lvw] h-[100lvh] pointer-events-none z-20"
/>

<div class="font-body">
	<Nav />
	<slot />
</div>
