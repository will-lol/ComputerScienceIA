<script lang="ts">
	import Button from './Button.svelte';
	export let clientID: string;
	export let url: string;
	import { fetchWithAuth } from '$lib/util/auth';
	import { authStore } from '$lib/util/stores';
	import type { githubUser } from '$lib/util/zod';
	import type { auth } from '$lib/util/auth';

	let userInfo: githubUser | null;
	let authFromStore: auth | null;
	authStore.subscribe((val) => {
		authFromStore = val;
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
	{#if authFromStore == null}
		<a
			class="cursor-pointer"
			href={`https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
				clientID
			)}&redirect_uri=${encodeURIComponent(url)}`}><Button>Login with GitHub</Button></a
		>
	{:else if userInfo != null}
		<div class="mr-4">Logged in as {userInfo?.name}</div>
		<Button
			on:click={() => authStore.setWithLocalStorage(null)}>Log out</Button
		>
	{/if}
</nav>
