<script lang="ts">
	import Button from './Button.svelte';
	import authClient from '$lib/util/authClient';
	import type { githubUser } from '$lib/util/zod';
	import { dataStore } from '$lib/util/stores';
	import type { dataPackage } from '$lib/util/zod';
	import AuthLink from './AuthLink.svelte';
	import { goto } from '$app/navigation';
	import retry from '$lib/util/retry';

	let data: dataPackage | null;
	const auth = authClient.externalAuth;

	dataStore.subscribe((val) => {
		data = val;
	});

	async function getLogin() {
		return await retry(
			() =>
				authClient.fetchWithAuth('https://api.github.com/user').then((res) =>
					res.json().then((res) => {
						if (res.login == undefined) {
							return null;
						} else {
							const userInfo = res as githubUser;
							return userInfo;
						}
					})
				),
			5000,
			2
		);
	}
</script>

<nav class="z-10 flex sm:p-4 pt-4 px-4 sticky top-0 sm:fixed w-full justify-between items-center">
	<button on:click={() => goto('/', { replaceState: true })}> Home </button>
	{#if $auth == null}
		<AuthLink>
			<Button>Login with GitHub</Button>
		</AuthLink>
	{:else}
		<div class="flex items-center">
			{#await getLogin()}
				<div class="mr-4">Logged in</div>
				<Button on:click={() => authClient.logout()}>Log out</Button>
			{:then login}
				<div class="mr-4">Logged in as {login?.login}</div>
				<Button on:click={() => authClient.logout()}>Log out</Button>
			{:catch}
				<div>Couldn't fetch login information</div>
				<Button on:click={() => authClient.logout()}>Log out</Button>
			{/await}
		</div>
	{/if}
</nav>
