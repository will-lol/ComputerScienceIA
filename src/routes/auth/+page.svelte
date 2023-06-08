<script lang="ts">
	import { onMount } from 'svelte';
	import Page from '$lib/components/Page.svelte';
	import Title from '$lib/components/Title.svelte';
    import type { PageData } from './$types';
    import { goto } from '$app/navigation';
    import Ellipses from '$lib/components/Ellipses.svelte';
    import { authStore } from '$lib/util/stores';
    export let data: PageData;
    
    onMount(() => {
        authStore.setWithLocalStorage(data);
        goto('/', { replaceState: false })
    })
</script>

<Page>
	<Title>Authorising<span><Ellipses/></span></Title>
</Page>