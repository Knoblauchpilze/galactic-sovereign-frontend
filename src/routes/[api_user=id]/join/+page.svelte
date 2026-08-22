<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let playerName = $state('');
</script>

<div class="relative flex flex-col items-center w-full min-h-screen bg-[#21211f] px-4 py-12">
	<div
		class="w-1/2 min-w-80 flex flex-col items-center gap-8 px-5 py-8 bg-[#2a2a27] border border-[#444] rounded"
	>
		<h1 class="text-white text-2xl">Join a new universe</h1>

		<label class="flex items-center gap-3 text-gray-400 text-sm font-medium">
			Choose universe
			<select
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
				bind:value={playerName}
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
				disabled={playerName.trim().length === 0}
				class="px-6 py-2 bg-green-600 text-white border-0 rounded text-base font-medium transition-colors hover:enabled:bg-green-400 active:enabled:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer"
			>
				Join
			</button>
		</div>
	</div>
</div>
