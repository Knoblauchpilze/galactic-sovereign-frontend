<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="relative flex flex-col items-center w-full min-h-screen bg-[#21211f] px-4 py-12">
	<form method="POST" action="/logout" class="absolute top-4 right-4">
		<input type="hidden" name="userId" value={data.apiUserId} />
		<button
			type="submit"
			class="px-4 py-2 rounded text-sm font-medium text-gray-400 bg-[#333] border border-[#444] hover:bg-[#444] hover:text-white transition-colors cursor-pointer"
		>
			Logout
		</button>
	</form>

	<h1 class="text-white text-3xl mb-2">Galactic Sovereign</h1>
	<p class="text-gray-400 text-base mb-10">Welcome back, Commander</p>

	<div class="w-1/2 min-w-80 flex flex-col gap-4 mb-8">
		{#each data.players as { id, universe, player, homeworld } (universe)}
			<div
				class="flex items-center justify-between px-5 py-4 bg-[#2a2a27] border border-[#444] rounded"
			>
				<div class="flex flex-col gap-1">
					<span class="text-gray-400 text-xs uppercase tracking-wider">Universe</span>
					<span class="text-white font-medium">{universe}</span>
					<span class="text-gray-400 text-xs uppercase tracking-wider mt-2">Player</span>
					<span class="text-white font-medium">{player}</span>
				</div>
				<a
					href={resolve('/players/[player=id]/planets/[id=id]', { player: id, id: homeworld })}
					class="px-5 py-2 bg-[#444] text-white border-0 rounded text-sm font-medium cursor-pointer transition-colors hover:bg-[#555] active:bg-[#333]"
				>
					Play
				</a>
			</div>
		{/each}
	</div>

	{#if data.hasJoinedAllUniverses}
		<button
			disabled
			class="px-6 py-2 bg-[#444] text-white border-0 rounded text-base font-medium opacity-50 cursor-not-allowed"
		>
			Join a new universe
		</button>
	{:else}
		<a
			href={resolve('/[api_user=id]/join', { api_user: data.apiUserId })}
			class="px-6 py-2 bg-[#444] text-white border-0 rounded text-base font-medium transition-colors hover:bg-[#555] active:bg-[#333] cursor-pointer"
		>
			Join a new universe
		</a>
	{/if}
</div>
