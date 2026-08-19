<script lang="ts">
	import { formatAmount } from '$lib/format';
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
			<button
				class="px-5 py-2 bg-[#444] text-white border-0 rounded text-sm font-medium cursor-pointer transition-colors hover:bg-[#555] active:bg-[#333]"
			>
				Upgrade
			</button>
		</div>
	{/each}
</main>
