import { createNoise3D } from 'simplex-noise';
const noise3d = createNoise3D();

onmessage = (e) => {
	const message = e.data as { width: number; height: number; timeAxis: number };
	postMessage(simplex(message.width, message.height, message.timeAxis));
};

function simplex(width: number, height: number, timeAxis: number) {
	const divider = width > 50 ? 70 : 40;
	const img = new Uint8ClampedArray(width * height * 4);
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			const index = (x + y * width) * 4;
			const colourArray = gradient((noise3d(x / divider, y / divider, timeAxis) + 1) / 2);
			img[index] = colourArray[0];
			img[index + 1] = colourArray[1];
			img[index + 2] = colourArray[2];
			img[index + 3] = 255;
		}
	}
	return img;
}

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
