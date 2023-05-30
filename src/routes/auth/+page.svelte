<script lang="ts">
	import { onMount } from 'svelte';
	import Page from '../../lib/components/Page.svelte';
	import Title from '../../lib/components/Title.svelte';
    import type { PageData } from './$types';
    import { authStore } from '../stores';
    import { goto } from '$app/navigation';
    export let data: PageData;
    authStore.set(data);
    
    onMount(() => {
        globalThis.sessionStorage.setItem("auth", JSON.stringify(data));
        goto('/results', { replaceState: false })
    })
</script>

<Page>
	<Title>Authorising...</Title>
</Page>
