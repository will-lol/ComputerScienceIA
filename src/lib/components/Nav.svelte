<script lang="ts">
	import Button from './Button.svelte';
	import { fetchWithAuth } from '$lib/util/auth';
	import { authStore } from '$lib/util/stores';
	import type { githubUser } from '$lib/util/zod';
	import type { auth } from '$lib/util/auth';
	import { pageDataStore } from '$lib/util/stores';

	let userInfo: githubUser | null;
	let authFromStore: auth | null;
	let pageDataFromStore: {
		clientID?: string;
		url?: string;
	};
	authStore.subscribe((val) => {
		authFromStore = val;
	});
	pageDataStore.subscribe((val) => {
		pageDataFromStore = val;
	});
	$: if (authFromStore != null) {
		console.log('fetching with auth');
		fetchWithAuth('https://api.github.com/user').then((res) =>
			res.json().then((res) => {
				if (res.name == undefined) {
					userInfo = null;
				} else {
					userInfo = res as githubUser;
				}
			})
		);
	}
</script>

<nav class="z-10 flex p-4 fixed w-full justify-end items-center">
	{#if authFromStore == null && pageDataFromStore != undefined && pageDataFromStore != undefined && pageDataFromStore.clientID != undefined && pageDataFromStore.url != undefined}
		<a
			class="cursor-pointer"
			href={`https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
				pageDataFromStore.clientID
			)}&redirect_uri=${encodeURIComponent(pageDataFromStore.url)}`}><Button>Login with GitHub</Button></a
		>
	{:else if userInfo != null}
		<div class="mr-4">Logged in as {userInfo?.name}</div>
		<Button on:click={() => authStore.setWithLocalStorage(null)}>Log out</Button>
	{/if}
</nav>
