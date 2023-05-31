<script lang="ts">
	import { onMount } from 'svelte';
	let ellipses: string = '';
	onMount(() => {
		frame(1, 0);
		function frame(count: number, rafCount: number) {
			if (rafCount == 20) {
				ellipses = '.'.repeat(count);
				count++;
				if (count > 4) {
					count = 1;
				}
				rafCount = 0;
			}

			rafCount++;

			requestAnimationFrame(() => {
				frame(count, rafCount), 1000;
			});
		}
	});
</script>

<div class="w-4 text-left">
	{ellipses}
</div>
