<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import simplexWorkerCreator from './simplexWorker?worker';
	import noiseWorkerCreator from './noiseWorker?worker';
	import workerToPromise from '$lib/util/workerToPromise';
	import isServer from '$lib/util/isServer';
	import Nav from '$lib/components/Nav.svelte';

	let simplexWorker: Worker;
	let noiseWorker: Worker;

	//workers can only be created on client
	if (!isServer()) {
		simplexWorker = new simplexWorkerCreator();
		noiseWorker = new noiseWorkerCreator();
	}

	let canvas: HTMLCanvasElement;
	let noiseOverlay: HTMLCanvasElement;
	let animationController = new AbortController();

	//this onMount is where the background animation functions are called, it runs on client only
	onMount(async () => {
		//generate noise overlay
		renderNoise(noiseOverlay);
		fadeIn(noiseOverlay);

		//generate simplex noise and animate
		const animator = new SimplexNoiseAnimator(canvas, animationController);
		animator.startAnimating();

		fadeIn(canvas);
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

	class SimplexNoiseAnimator {
		ctx: CanvasRenderingContext2D;
		controller: AbortController;
		canvas: HTMLCanvasElement;

		constructor(canvas: HTMLCanvasElement, controller: AbortController) {
			const boundingClientRect = canvas.getBoundingClientRect();

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

		startAnimating() {
			this.frame(0, 20);
		}

		stopAnimating() {
			this.controller.abort();
		}

		async frame(timeAxis: number, count: number) {
			if (count == 20 || this.controller.signal.aborted) {
				const imgData: Promise<Uint8ClampedArray> = workerToPromise(simplexWorker, {
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

	let timeoutID: number;

	function resize() {
		clearTimeout(timeoutID);
		timeoutID = setTimeout(() => {
			renderNoise(noiseOverlay);
		}, 100);
	}
</script>

<svelte:window on:resize={resize} />
<canvas
	bind:this={canvas}
	class="opacity-0 fixed w-[100lvw] h-[100lvh] pointer-events-none -z-10"
/>
<canvas
	bind:this={noiseOverlay}
	class="opacity-0 fixed w-[100lvw] h-[100lvh] pointer-events-none z-20"
/>

<div class="font-body">
	<Nav />
	<slot />
</div>
