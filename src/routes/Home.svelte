<script lang="ts">
	import { fetchWithAuth } from '$lib/util/authClient';
	import { onMount } from 'svelte';
	import { retrieveAllDataApiTypeChecker, dataPackageTypeChecker } from '$lib/util/zod';
	import Button from '$lib/components/Button.svelte';
	import parseWorkerCreator from './parseWorker?worker';
	import workerToPromise from '$lib/util/workerToPromise';
	import Ellipses from '$lib/components/Ellipses.svelte';
	import type { retrieveAllDataApi, dataPackage } from '$lib/util/zod';
	import { dataStore, comparisonDataStore } from '$lib/util/stores';
	import { goto } from '$app/navigation';
	import { allDataFromServerStore } from '$lib/util/stores';
	import timeElapsedString from '$lib/util/timeElapsedString';
	import retry from '$lib/util/retry';

	let uploadXmlUrl = new URL(globalThis.location.origin + '/api/retrieveAllData');
	let buttonState = 'Add an entry';
	let submitState = 'View';
	let loading = false;
	let files: FileList | undefined;
	let labelFileUpload: HTMLLabelElement;
	let entryCheckboxes: number[] = [];
	$: if (files != undefined) {
		if (files[0]) {
			buttonState = 'Fetching parser';
			addEntry(files[0]);
		}
	}
	let allData: retrieveAllDataApi;
	allDataFromServerStore.subscribe((val) => {
		allData = val;
	});

	onMount(async () => {
		loading = true;
		await refreshList();
		loading = false;
	});

	async function refreshList() {
		const datasFromServer = await retry(async () => await fetchWithAuth(uploadXmlUrl.href).then((res) => res.json()), 5000, 2);
		allData = retrieveAllDataApiTypeChecker.parse(datasFromServer);
		allData.sort((a, b) => {
			return a.date.valueOf() - b.date.valueOf();
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
			setTimeout(() => {
				buttonState = 'Add an entry';
			}, 5000);
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
			setTimeout(() => {
				buttonState = 'Add an entry';
			}, 5000);
		}
	}

	async function fetchStatistics(s3Key: string) {
		const url = new URL(globalThis.location.origin + '/api/getFromS3');
		url.searchParams.set('key', s3Key);
		return await fetchWithAuth(url.href)
			.then((res) => res.json().then((res) => dataPackageTypeChecker.parse(res)))
			.catch(() => {
				throw 'Statistics sent by server are unexpected.';
			});
	}

	async function submitHandler(
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
				submitState = 'View';
			}, 5000);
			return;
		}

		submitState = 'Loading statistics from server';
		const oneVal = await fetchStatistics(allData[parseInt(one.value)].s3Key).catch((e) => {
			submitState = e;
			setTimeout(() => {
				submitState = 'View';
			}, 5000);
			throw e;
		});
		oneVal.fromServer = true;

		const two = formData.next();
		if (two.value) {
			const twoVal = await fetchStatistics(allData[parseInt(two.value)].s3Key).catch((e) => {
				submitState = e;
				setTimeout(() => {
					submitState = 'View';
				}, 5000);
				throw e;
			});

			submitState = 'Redirecting';
			twoVal.fromServer = true;
			if (oneVal.metadata.date.valueOf() > twoVal.metadata.date.valueOf()) {
				dataStore.setWithLocalStorage(oneVal);
				comparisonDataStore.setWithLocalStorage(twoVal);
			} else {
				dataStore.setWithLocalStorage(twoVal);
				comparisonDataStore.setWithLocalStorage(oneVal);
			}
		} else {
			dataStore.setWithLocalStorage(oneVal);
			comparisonDataStore.setWithLocalStorage(null);
		}
		goto('/results', { replaceState: false });
	}
</script>

<form on:submit|preventDefault={submitHandler}>
	<input id="file" accept=".xml" type="file" class="hidden" bind:files />
	<div class="flex flex-col gap-3 bg-white border border-solid border-gray-300 shadow rounded p-4">
		<h2 class="text-sm text-gray-600">Choose a saved entry to view it, or choose two to compare between.</h2>
		{#if loading}
			<div>Loading<Ellipses /></div>
		{/if}
		<fieldset class="flex flex-col gap-2">
			{#each allData as data, i}
				<div class="flex flex-row justify-between">
					<div class="flex items-center">
						<input
							bind:group={entryCheckboxes}
							type="checkbox"
							class="w-5 h-5 mr-2"
							name={data.date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
							id={data.date.toString()}
							value={i}
							disabled={!entryCheckboxes.includes(i) && entryCheckboxes.length == 2}
						/>
						<label class="" for={data.date.toString()}>{data.date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</label>
					</div>
					<Button
						type="button"
						destructive
						small
						on:click={async () => {
							let deleteUrl = new URL(globalThis.location.origin + '/api/deleteData');
							deleteUrl.searchParams.set('id', data.id.toString());
							const res = await fetchWithAuth(deleteUrl.href, { method: 'DELETE' });
							if (res.status == 200) {
								refreshList();
							}
						}}
					>Delete</Button>
				</div>
			{/each}
		</fieldset>

		<Button on:click={() => labelFileUpload.click()} type="button" disabled={buttonState != 'Add an entry'}
			><label
				bind:this={labelFileUpload}
				for="file"
				class="cursor-pointer absolute top-0 left-0 w-full h-full flex justify-center items-center"
			>
				{buttonState}
				{#if !(buttonState == 'Add an entry' || buttonState == 'Parser error. Try again.')}
					<Ellipses />
				{/if}
			</label></Button
		>
		<Button disabled={entryCheckboxes.length == 0 || submitState != 'View'} primary type="submit">
			{submitState}
			{#if !(submitState == 'View' || submitState == 'Select at least one checkbox' || submitState == 'Statistics sent by server are unexpected.')}
				<Ellipses />
			{:else if submitState == 'View'}
				{#if entryCheckboxes.length == 2}
					{timeElapsedString(allData[entryCheckboxes[0]].date, allData[entryCheckboxes[1]].date)}
				{/if}
			{/if}
		</Button>
	</div>
</form>
