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

        const redirectFromSession = sessionStorage.getItem("redirect");
        if (redirectFromSession == null) {
            goto('/', { replaceState: false })
        } else {
            const pathname = new URL(redirectFromSession).pathname;
            goto(pathname, { replaceState: false })
        }
    })
</script>

<Page>
	<Title>Authorising<span><Ellipses/></span></Title>
</Page>