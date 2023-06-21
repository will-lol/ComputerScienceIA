export default function padNum(num: number, len: number, ch?: string): string {
	const figs = Math.trunc(Math.log10(num)) + 1;
	if (num == 0) {
		return '0'.repeat(len);
	} else if (figs > len) {
		return num.toString();
	} else {
		return (ch == undefined ? '0' : ch).repeat(len - figs) + num.toString();
	}
}

function padString(str: string, len: number, ch?: string): string {
	if (str.length >= len) {
		return str;
	} else {
		return (ch == undefined ? '0' : ch).repeat(len - str.length) + str;
	}
}

function randomLetter(): string {
	const chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
	const rand = Math.trunc(Math.random() * chars.length);
	if (rand >= 25) {
		rand + 6;
	} 
	return chars[rand] ;
}