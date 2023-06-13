<script lang="ts">
	import Page from '$lib/components/Page.svelte';
	import Content from '$lib/components/Content.svelte';
	import Title from '$lib/components/Title.svelte';
	import Stats from './Stats.svelte';
	import { authStore } from '$lib/util/stores';
	import type { auth } from '$lib/util/authClient';
	import { fetchWithAuth } from '$lib/util/authClient';
	import AuthLink from '$lib/components/AuthLink.svelte';
	import type { dataPackage, song } from '$lib/util/zod';
	import { dataStore, comparisonDataStore } from '$lib/util/stores';
	import Ellipses from '$lib/components/Ellipses.svelte';
	import Notification from '$lib/components/Notification.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import BinarySearchTree from '$lib/util/binarySearchTree';
	import { stringDefault, playCountDefault } from "$lib/util/defaultType";
	
	let authFromStore: auth | null;
	authStore.subscribe((val) => {
		authFromStore = val;
	});
	let data: dataPackage | null;
	const dataUnsubscribe = dataStore.subscribe((val) => {
		data = val;
	});
	let comparisonData: dataPackage | null;
	comparisonDataStore.subscribe((val) => {
		comparisonData = val;
	});
	let state = 'idle';
	let songArray: song[];

	onMount(() => {
		if (data == null || data.songs == null) {
			setTimeout(() => {
				goto('/', { replaceState: false });
			}, 1000)
			return;
		} else if (comparisonData != null) {
			const compareTree = new BinarySearchTree((one: song, two: song) => {
				return stringDefault(two.name).localeCompare(stringDefault(one.name));
			})
			for (const song of comparisonData.songs) {
				compareTree.insert(song);
			}
			if (!data) {
				throw 'cannot compare without initial data'
			}
			dataUnsubscribe();
			for (const song of data.songs) {
				const res = compareTree.search(song);
				if (res != undefined) {
					song.playCount = playCountDefault(song.playCount) - playCountDefault(res.playCount);
				}
			}
		} 
		songArray = data.songs;
	});
</script>

{#if !songArray || !data }
	Please add upload some data for display.
{:else}
	<Page>
		<Title>Results</Title>
		<Content>
			<Stats songs={songArray} />
		</Content>
		{#if authFromStore == null}
			<Notification>
				<AuthLink>
					<button class="group hover:underline flex items-center">
						Login to save your statistics for comparison later on →
					</button>
				</AuthLink>
			</Notification>
		{:else if authFromStore != null && state != 'completed'}
			{#if !data.fromServer}
				<Notification>
					<button
						on:click={async () => {
							let uploadXmlUrl = new URL(globalThis.location.origin + '/api/uploadData');
							state = 'uploading';
							const res = await fetchWithAuth(uploadXmlUrl.href, {
								body: JSON.stringify(data),
								method: 'POST'
							});
							if (res.status == 200) {
								state = 'uploaded';
								setTimeout(() => {
									state = 'completed';
								}, 5000);
							} else {
								state = await res.text();
							}
						}}
						class="group hover:underline flex items-center disabled:opacity-50 disabled:pointer-events-none"
						disabled={!(state == 'idle')}
					>
						{#if state == 'idle'}
							Save to your account →
						{:else if state == 'uploading'}
							Uploading<Ellipses />
						{:else if state == 'uploaded'}
							Uploaded.
						{:else}
							Error: {state}
						{/if}
					</button>
				</Notification>
			{/if}
		{/if}
	</Page>
{/if}
