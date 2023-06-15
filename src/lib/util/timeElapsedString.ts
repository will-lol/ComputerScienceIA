function stringCreator(word: string, count: number): string {
	if (count > 1) {
		return count + ' ' + word + 's';
	} else return count + ' ' + word;
}

//this function converts a date object into a string describing how long ago it was.
export default function timeElapsedString(dateOne: Date, dateTwo: Date): string {
	const seconds = Math.abs((dateTwo.valueOf() - dateOne.valueOf()) / 1000);

	if (seconds < 60) {
		return stringCreator('second', Math.floor(seconds));
	} else if (seconds < 60 * 60) {
		return stringCreator('minute', Math.floor(seconds / 60));
	} else if (seconds < 60 * 60 * 24) {
		return stringCreator('hour', Math.floor(seconds / 60 / 60));
	} else if (seconds < 60 * 60 * 24 * 7) {
		return stringCreator('day', Math.floor(seconds / 60 / 60 / 24));
	} else if (seconds < 60 * 60 * 24 * 7 * 4.34814285714) {
		return stringCreator('week', Math.floor(seconds / 60 / 60 / 24 / 7));
	} else if (seconds < 60 * 60 * 24 * 7 * 4.34814285714 * 12) {
		return stringCreator('month', Math.floor(seconds / 60 / 60 / 24 / 7 / 4.34814285714));
	} else {
		return stringCreator('year', Math.floor(seconds / 60 / 60 / 24 / 7 / 4.34814285714 / 12));
	}
}
