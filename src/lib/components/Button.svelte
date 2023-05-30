<script lang="ts">
	export let fullWidth: boolean = false;
	export let absoluteBottom: boolean = false;
	export let primary: boolean = false;
	export let transparent: boolean = false;
	let classes: string[] = ['h-10 py-2 px-4 inline-flex items-center justify-center rounded text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'];
	if (fullWidth) {
		classes.push('w-full');
	}
	if (absoluteBottom) {
		classes.push('absolute bottom-0');
	}
	if (primary) {
		classes.push('bg-blue-500 hover:bg-blue-600 text-white shadow');
	} else if (transparent) {
		classes.push('bg-transparent underline')
	} else {
		classes.push('bg-gray-50 bg-opacity-75 hover:bg-gray-100 shadow');
	}
</script>

<button on:click {...$$props}
	class={classes.join(' ')}><slot /></button
>