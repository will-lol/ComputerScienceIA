<script lang="ts">
	export let fullWidth: boolean = false;
	export let absoluteBottom: boolean = false;
	export let primary: boolean = false;
	export let transparent: boolean = false;
	export let small: boolean = false;
	export let destructive: boolean = false;
	let classes: string[] = [
		'inline-flex items-center justify-center rounded font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'
	];
	if (fullWidth) {
		classes.push('w-full');
	}
	if (absoluteBottom) {
		classes.push('absolute bottom-0');
	} else {
		classes.push('relative');
	}
	if (small) {
		classes.push('py-0 px-2 text-xs h-6');
	} else {
		classes.push('py-2 px-4 text-sm h-10');
	}
	if (primary) {
		classes.push('bg-blue-500 hover:bg-blue-600 text-white shadow');
	} else if (transparent) {
		classes.push('bg-transparent underline');
	} else if (destructive) {
		classes.push(
			'bg-red-500 hover:bg-red-600 text-white border border-solid border-red-600 shadow'
		);
	} else {
		classes.push(
			'bg-gray-50 bg-opacity-75 border border-solid border-gray-200 hover:bg-gray-100 shadow'
		);
	}
</script>

<button on:click {...$$props} class={classes.join(' ')}><slot /></button>
