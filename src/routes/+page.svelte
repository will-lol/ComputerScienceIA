<script lang="ts">
	import Page from '../lib/components/Page.svelte';
	import Content from '../lib/components/Content.svelte';
	import Title from '../lib/components/Title.svelte';
	import ListItem from '../lib/components/ListItem.svelte';
	import OrderedList from '../lib/components/OrderedList.svelte';
	import Button from "../lib/components/Button.svelte";
</script>

<Page>
	<Title title="Easily generate iPod listening statistics" />
	<Content>
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
		<Button fullWidth absoluteBottom primary>I've saved the file!</Button>
	</Content>
</Page>
