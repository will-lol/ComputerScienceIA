<script lang="ts">
	import { PUBLIC_CLIENT_ID } from '$env/static/public';
	import { page } from '$app/stores';

	let currentUrl: URL;
	page.subscribe((val) => {
		currentUrl = val.url;
	});
</script>

<a
	on:click={() => {
		sessionStorage.setItem('redirect', currentUrl.href);
	}}
	href={`https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
		PUBLIC_CLIENT_ID
	)}&redirect_uri=${encodeURIComponent(currentUrl.origin + `/auth`)}`}><slot /></a
>
