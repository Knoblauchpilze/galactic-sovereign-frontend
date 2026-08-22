<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let playerName = $state('');
	let errorMessage = $state('');

	const errorReasons: Record<string, string> = {
		name_taken: 'This player name is already taken',
		invalid_input: 'Please check the universe and player name',
		server_error: 'Server error. Please try again later'
	};

	$effect(() => {
		if (page.form?.reason) {
			errorMessage = errorReasons[page.form.reason] || 'An error occurred';
		}
	});

	function clearError() {
		errorMessage = '';
	}
</script>

<div class="relative flex flex-col items-center w-full min-h-screen bg-[#21211f] px-4 py-12">
	<form
		method="POST"
		class="w-1/2 min-w-80 flex flex-col items-center gap-8 px-5 py-8 bg-[#2a2a27] border border-[#444] rounded"
	>
		<h1 class="text-white text-2xl">Join a new universe</h1>

		{#if errorMessage}
			<div class="px-4 py-3 bg-red-900/30 border border-red-600 rounded text-red-200 text-sm">
				{errorMessage}
			</div>
		{/if}

		<label class="flex items-center gap-3 text-gray-400 text-sm font-medium">
			Choose universe
			<select
				name="universe"
				class="px-3 py-2 bg-[#333] text-white border border-[#444] rounded text-sm cursor-pointer"
			>
				{#each data.availableUniverses as universe (universe.id)}
					<option value={universe.id}>{universe.name}</option>
				{/each}
			</select>
		</label>

		<label class="flex items-center gap-3 text-gray-400 text-sm font-medium">
			Player name
			<input
				type="text"
				name="name"
				bind:value={playerName}
				oninput={clearError}
				class="px-3 py-2 bg-[#333] text-white border border-[#444] rounded text-sm"
			/>
		</label>

		<div class="flex items-center gap-4">
			<a
				href={resolve('/[api_user=id]/lobby', { api_user: data.apiUserId })}
				class="px-6 py-2 bg-red-800 text-white border-0 rounded text-base font-medium cursor-pointer transition-colors hover:bg-red-400 active:bg-red-600"
			>
				Back to lobby
			</a>

			<button
				type="submit"
				disabled={playerName.trim().length === 0}
				class="px-6 py-2 bg-green-600 text-white border-0 rounded text-base font-medium transition-colors hover:enabled:bg-green-400 active:enabled:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer"
			>
				Join
			</button>
		</div>
	</form>
</div>
