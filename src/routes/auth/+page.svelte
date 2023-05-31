<script lang="ts">
	import { onMount } from 'svelte';
	import Page from '$lib/components/Page.svelte';
	import Title from '$lib/components/Title.svelte';
    import type { PageData } from './$types';
    import { authStore } from '$lib/util/stores';
    import { goto } from '$app/navigation';
    import Ellipses from '$lib/components/Ellipses.svelte';
    export let data: PageData;
    
    onMount(() => {
        authStore.setWithLocalStorage(data);
        goto('/results', { replaceState: false })
    })
</script>

<Page>
	<Title>Authorising<Ellipses/></Title>
</Page>
