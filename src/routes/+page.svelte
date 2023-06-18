<script lang="ts">
	import Page from '$lib/components/Page.svelte';
	import Content from '$lib/components/Content.svelte';
	import Title from '$lib/components/Title.svelte';
	import Onboard from './Onboard.svelte';
	import type { auth } from '$lib/util/authClient';
	import { authStore } from '$lib/util/stores';
	import Home from './Home.svelte';
	import Notification from '$lib/components/Notification.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let authFromStore: auth | null;
	let alreadyLoaded: boolean;
	authStore.subscribe((val) => {
		authFromStore = val;
	});

	onMount(() => {
		alreadyLoaded = localStorage.getItem('data') != null;
	});
</script>

<Page>
	<Title>Easily generate iPod listening statistics</Title>
	<Content>
		{#if authFromStore == null}
			<Onboard />
			{#if alreadyLoaded}
				<Notification>
					<button
						class="hover:underline"
						on:click={() => goto('/results', { replaceState: false })}
					>
						We saved your statistics from last time →
					</button>
				</Notification>
			{/if}
		{:else}
			<Home />
		{/if}
	</Content>
</Page>
