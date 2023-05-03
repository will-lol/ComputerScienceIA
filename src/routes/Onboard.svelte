<script lang="ts">
	import ListItem from '../lib/components/ListItem.svelte';
	import OrderedList from '../lib/components/OrderedList.svelte';
	import Button from "../lib/components/Button.svelte";

    let files: FileList | undefined;
</script>

<OrderedList>
    <ListItem>
        Open the Apple Music app on your Mac
    </ListItem>
    <ListItem>
        Find the menu bar item 'File'
    </ListItem>
    <ListItem>
        Go to 'Library'
    </ListItem>
    <ListItem>
        Click 'Export Library...'
    </ListItem>
    <ListItem>
        Save the file
    </ListItem>
</OrderedList>
<input type="file" bind:files/> <Button fullWidth absoluteBottom primary>I've saved the file!</Button>