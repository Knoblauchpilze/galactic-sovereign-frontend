<script lang="ts">
	import { formatAmount, formatDuration } from '$lib/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<main class="flex flex-col gap-4 px-6 py-6">
	{#each data.buildings as building (building.name)}
		<div
			class="flex items-center justify-between px-5 py-4 bg-[#2a2a27] border border-[#444] rounded"
		>
			<div class="flex flex-col gap-1">
				<div class="flex items-baseline gap-2">
					<span class="text-white font-medium capitalize">{building.name}</span>
					<span class="text-gray-400 text-xs uppercase tracking-wider">Level {building.level}</span>
				</div>
				<div class="flex flex-wrap gap-x-4 gap-y-1">
					{#each building.costs as cost (cost.name)}
						<span class="text-xs {cost.available >= cost.cost ? 'text-green-400' : 'text-red-400'}">
							<span class="capitalize">{cost.name}</span>: {formatAmount(cost.cost)}
						</span>
					{/each}
				</div>
			</div>
			<div class="flex items-center gap-4">
				{#if building.id === data.actionBuildingId && data.actionRemainingSeconds !== null}
					<div
						class="flex flex-col items-center gap-0.5 px-3 py-1.5 bg-[#333] border border-[#444] rounded"
					>
						<span class="text-gray-400 text-[10px] uppercase tracking-wider"
							>Upgrade complete in</span
						>
						<span class="text-white text-sm font-medium">
							{formatDuration(data.actionRemainingSeconds)}
						</span>
					</div>
				{/if}
				<form
					method="POST"
					action={building.id === data.actionBuildingId ? '?/cancel' : '?/upgrade'}
				>
					<input type="hidden" name="building" value={building.id} />
					<button
						type="submit"
						disabled={building.id !== data.actionBuildingId &&
							(data.actionBuildingId !== null || !building.affordable)}
						class="px-5 py-2 text-white border-0 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer {building.id ===
						data.actionBuildingId
							? 'bg-red-800 hover:enabled:bg-red-400 active:enabled:bg-red-600'
							: building.affordable
								? 'bg-green-600 hover:enabled:bg-green-400 active:enabled:bg-green-600'
								: 'bg-red-800 hover:enabled:bg-red-400 active:enabled:bg-red-600'}"
					>
						{building.id === data.actionBuildingId ? 'Cancel' : 'Upgrade'}
					</button>
				</form>
			</div>
		</div>
	{/each}
</main>
