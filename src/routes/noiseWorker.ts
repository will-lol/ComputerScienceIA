import randIntBetweenInc from '$lib/util/randIntBetweenInc';

onmessage = (e) => {
	const message = e.data as { width: number; height: number };
	postMessage(noise(message.width, message.height));
};

function noise(width: number, height: number) {
	const img = new Uint8ClampedArray(width * height * 4);
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			const index = (x + y * width) * 4;
			const rand = randIntBetweenInc(0, 255);
			img[index] = rand;
			img[index + 1] = rand;
			img[index + 2] = rand;
			img[index + 3] = 10;
		}
	}
	return img;
}
