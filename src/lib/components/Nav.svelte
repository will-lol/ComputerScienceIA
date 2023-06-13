<script lang="ts">
	import Button from './Button.svelte';
	import { fetchWithAuth } from '$lib/util/authClient';
	import { authStore } from '$lib/util/stores';
	import type { githubUser } from '$lib/util/zod';
	import type { auth } from '$lib/util/authClient';
	import { dataStore } from '$lib/util/stores';
	import type { dataPackage } from '$lib/util/zod';
	import AuthLink from './AuthLink.svelte';
	import { goto } from '$app/navigation';

	let userInfo: githubUser | null;
	let authFromStore: auth | null;
	let data: dataPackage | null;
	authStore.subscribe((val) => {
		authFromStore = val;
	});
	dataStore.subscribe((val) => {
		data = val;
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

<nav class="z-10 flex p-4 fixed w-full justify-between items-center">
	<button on:click={() => goto("/", {replaceState: true})}>
		Home
	</button>
	{#if authFromStore == null}
		<AuthLink>
			<Button>Login with GitHub</Button>
		</AuthLink>
	{:else if userInfo != null}
		<div class="flex items-center">
			<div class="mr-4">Logged in as {userInfo?.name}</div>
			<Button on:click={() => authStore.setWithLocalStorage(null)}>Log out</Button>	
		</div>	
	{/if}
</nav>
