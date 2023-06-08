<script lang="ts">
	import Page from '$lib/components/Page.svelte';
	import Content from '$lib/components/Content.svelte';
	import Title from '$lib/components/Title.svelte';
	import Stats from './Stats.svelte';
	import { authStore } from '$lib/util/stores';
	import { pageDataStore } from '$lib/util/stores';
	import type { auth } from '$lib/util/auth';
	import { fetchWithAuth } from '$lib/util/auth';

	let authFromStore: auth | null;
	let pageDataFromStore: {
		clientId?: string;
		url?: string;
	};
	authStore.subscribe((val) => {
		authFromStore = val;
	});
	pageDataStore.subscribe((val) => {
		pageDataFromStore = val;
	});
</script>

<Page>
	<Title>Results</Title>
	<Content>
		<Stats />
	</Content>
	{#if authFromStore == null && pageDataFromStore != undefined && pageDataFromStore.clientId != undefined && pageDataFromStore.url != undefined}
		<div
			class="fixed bottom-0 w-full py-1 px-2 shadow text-sm flex text-center items-center justify-center text-white bg-blue-500"
		>
			<a
				href={`https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
					pageDataFromStore.clientId
				)}&redirect_uri=${encodeURIComponent(pageDataFromStore.url)}`}
				><button
					on:click={() => {
						if (authFromStore == null) {
						}
					}}
					class="group hover:underline flex items-center"
				>
					Save your results →
				</button></a
			>
		</div>
	{:else if authFromStore != null}
		<div
			class="fixed bottom-0 w-full py-1 px-2 shadow text-sm flex text-center items-center justify-center text-white bg-blue-500"
		>
			<button
				on:click={() => {
					let uploadXmlUrl = new URL(globalThis.location.origin + '/api/uploadData');
					fetchWithAuth(uploadXmlUrl.href, { body: JSON.stringify(data), method: 'POST' });
				}}
				class="group hover:underline flex items-center"
			>
				Save to your account →
			</button>
		</div>
	{/if}
</Page>
