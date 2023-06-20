export function stringDefault(thing: string | undefined): string {
	if (thing == undefined) {
		return '';
	} else {
		return thing;
	}
}

export function playCountDefault(thing: number | undefined): number {
	if (thing == undefined) {
		return 0;
	} else {
		return thing;
	}
}

export function durationDefault(thing: number | undefined): number {
	if (thing == undefined) {
		return 0;
	} else {
		return thing;
	}
}

export function ratingDefault(thing: number | undefined): number {
	if (thing == undefined) {
		return 2.5;
	} else {
		return thing / 20;
	}
}
