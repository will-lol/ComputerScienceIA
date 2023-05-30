<script lang="ts">
    import Button from "./Button.svelte";
    export let clientID: string;
    export let url: string;


</script>

<nav class="z-10 flex p-4 fixed w-full justify-end">
    <a href={`https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(clientID)}&redirect_uri=${encodeURIComponent(url)}`}><Button>Login with GitHub</Button></a>
</nav>