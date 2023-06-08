<script lang="ts">
	import Page from '$lib/components/Page.svelte';
	import Content from '$lib/components/Content.svelte';
	import Title from '$lib/components/Title.svelte';
	import Onboard from './Onboard.svelte';
	import type { auth } from '$lib/util/auth';
	import { authStore } from '$lib/util/stores';
	import Home from './Home.svelte';

	let authFromStore: auth | null;
	authStore.subscribe((val) => {
		authFromStore = val;
	});
</script>

<Page>
	<Title>Easily generate iPod listening statistics</Title>
	<Content>
		{#if authFromStore == null}
			<Onboard />
		{:else}
			<Home/>
		{/if}
	</Content>
</Page>
