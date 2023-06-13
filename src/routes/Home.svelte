<script lang="ts">
	import { fetchWithAuth } from '$lib/util/authClient';
	import { onMount } from 'svelte';
	import { retrieveAllDataApiTypeChecker } from '$lib/util/zod';
	import Button from '$lib/components/Button.svelte';
	import parseWorkerCreator from './parseWorker?worker';
	import workerToPromise from '$lib/util/workerToPromise';
	import Ellipses from '$lib/components/Ellipses.svelte';
	import type { dataPackage } from '$lib/util/zod';
	import type { retrieveAllDataApi } from '$lib/util/zod';
	import { dataStore, comparisonDataStore } from '$lib/util/stores';
	import { goto } from '$app/navigation';
	import { allDataFromServerStore } from '$lib/util/stores';

	let uploadXmlUrl = new URL(globalThis.location.origin + '/api/retrieveAllData');
	let buttonState = 'Add an entry';
	let submitState = 'View';
	let loading = false;
	let error = false;
	let files: FileList | undefined;
	let entryCheckboxes: number[] = [];
	$: if (files != undefined) {
		if (files[0]) {
			buttonState = 'Fetching parser';
			addEntry(files[0]);
		}
	}
	let allData: retrieveAllDataApi
	allDataFromServerStore.subscribe((val) => {
		allData = val;
	})

	onMount(async () => {
		loading = true;
		await refreshList();
		loading = false;
	});

	async function refreshList() {
		const datasFromServer = await fetchWithAuth(uploadXmlUrl.href).then((res) => res.json());
		allData = retrieveAllDataApiTypeChecker.parse(datasFromServer);
		allData.sort((a, b) => {
			return a.data.metadata.date.valueOf() - b.data.metadata.date.valueOf();
		});
		allDataFromServerStore.setWithLocalStorage(allData);
	}

	async function addEntry(file: File) {
		const parseWorker = new parseWorkerCreator();
		buttonState = 'Parsing';
		let data: dataPackage;
		try {
			data = (await workerToPromise(parseWorker, await file.text())) as dataPackage;
		} catch {
			buttonState = 'Parser error. Try again.';
			return;
		}

		let uploadXmlUrl = new URL(globalThis.location.origin + '/api/uploadData');
		buttonState = 'Uploading';
		const res = await fetchWithAuth(uploadXmlUrl.href, {
			body: JSON.stringify(data),
			method: 'POST'
		});
		if (res.status == 200) {
			buttonState = 'Uploaded. Refreshing list';
			await refreshList();
			buttonState = 'Add an entry';
		} else {
			buttonState = await res.text();
			error = true;
			setTimeout(() => {
				buttonState = 'Add an entry';
				error = false;
			}, 5000);
		}
	}

	let last: HTMLInputElement | null;
	function checkInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (entryCheckboxes.length > 2) {
			const currentVal = parseInt(event.currentTarget.value);
			const lastVal = parseInt(last!.value);
			entryCheckboxes = [currentVal, 3 - (lastVal + currentVal)]
		}
		last = event.currentTarget;
	}

	function submitHandler(
		e: Event & {
			readonly submitter: HTMLElement | null;
		} & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) {
		const formData = new FormData(e.currentTarget).values();
		const one = formData.next();
		if (!one.value) {
			submitState = 'Select at least one checkbox';
			setTimeout(() => {
				submitState = 'View'
			}, 5000)
			return;
		}
		const oneVal = allData[parseInt(one.value)];
		oneVal.data.fromServer = true;
		const two = formData.next();
		if (two.value) {
			const twoVal = allData[parseInt(two.value)];
			twoVal.data.fromServer = true;
			if (oneVal.data.metadata.date.valueOf() > twoVal.data.metadata.date.valueOf()) {
				dataStore.setWithLocalStorage(oneVal.data);
				comparisonDataStore.setWithLocalStorage(twoVal.data);
			} else {
				dataStore.setWithLocalStorage(twoVal.data);
				comparisonDataStore.setWithLocalStorage(oneVal.data);
			}
		} else {
			dataStore.setWithLocalStorage(allData[parseInt(one.value)].data);
		}
		goto('/results', { replaceState: false });
	}
</script>

<div class="">
	<form on:submit|preventDefault={submitHandler}>
		<input id="file" accept=".xml" type="file" class="hidden" bind:files />
		<fieldset class="flex flex-col border border-solid border-black rounded p-4">
			<legend>Choose a saved entry to view it, or choose two to compare between.</legend>
			{#if loading}
				<div>Loading<Ellipses /></div>
			{/if}
			{#each allData as data, i}
				<div class="flex flex-row justify-between">
					<div>
						<input
							bind:group={entryCheckboxes}
							type="checkbox"
							name={data?.data.metadata.date.toLocaleDateString()}
							id={data.data.metadata.date.toString()}
							value={i}
							on:change={checkInput}
						/>
						<label for={data.data.metadata.date.toString()}
							>{data?.data.metadata.date.toLocaleString()}</label
						>
					</div>
					<button
						type="button"
						on:click={async () => {
							let deleteUrl = new URL(globalThis.location.origin + '/api/deleteData');
							deleteUrl.searchParams.set('id', data.id.toString());
							const res = await fetchWithAuth(deleteUrl.href, { method: 'DELETE' });
							if (res.status == 200) {
								refreshList();
							}
						}}
						class="disabled:opacity-40 disabled:pointer-events-none">Delete</button
					>
				</div>
			{/each}

			<Button type="button" disabled={buttonState != 'Add an entry'}
				><label
					for="file"
					class="cursor-pointer absolute top-0 left-0 w-full h-full flex justify-center items-center"
				>
					{buttonState}
					{#if !(buttonState == 'Add an entry' || buttonState == 'Parser error. Try again.' || error)}
						<Ellipses />
					{/if}
				</label></Button
			>
			<Button disabled={entryCheckboxes.length == 0} primary type="submit">{submitState}</Button>
		</fieldset>
	</form>
</div>
