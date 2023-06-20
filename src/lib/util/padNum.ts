export default function padNum(num: number, len: number): string {
	const figs = Math.trunc(Math.log10(num)) + 1;
	if (num == 0) {
		return '0'.repeat(len);
	} else if (figs > len) {
		return num.toString();
	} else {
		return '0'.repeat(len - figs) + num.toString();
	}
}
