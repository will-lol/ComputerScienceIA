<script lang="ts">
	import Page from '$lib/components/Page.svelte';
	import Content from '$lib/components/Content.svelte';
	import Title from '$lib/components/Title.svelte';
	import Onboard from './Onboard.svelte';
	import authClient from '$lib/util/authClient';
	import Home from './Home.svelte';
	import Notification from '$lib/components/Notification.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import isServer from '$lib/util/isServer';

	let alreadyLoaded: boolean;
	const auth = authClient.externalAuth;

	onMount(() => {
		alreadyLoaded = localStorage.getItem('data') != null;
	});
</script>

<Page>
	<Title>Easily generate iPod listening statistics</Title>
	<Content>
		{#if $auth == null}
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
		{:else if !isServer()}
			<Home />
		{/if}
	</Content>
</Page>
