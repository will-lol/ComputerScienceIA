<script lang="ts">
	import { onMount } from 'svelte';
	import Page from '$lib/components/Page.svelte';
	import Title from '$lib/components/Title.svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import Ellipses from '$lib/components/Ellipses.svelte';
	import authClient from '$lib/util/authClient';
	export let data: PageData;

	onMount(() => {
		authClient.setAuth(data);
		
		const redirectFromSession = sessionStorage.getItem('redirect');
		if (redirectFromSession == null) {
			goto('/', { replaceState: false });
		} else {
			const pathname = new URL(globalThis.location.origin + redirectFromSession).pathname;
			goto(pathname, { replaceState: false });
		}
	});
</script>

<Page>
	<Title>Authorising<span><Ellipses /></span></Title>
</Page>
