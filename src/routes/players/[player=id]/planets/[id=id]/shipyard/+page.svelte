<script lang="ts">
	import { formatAmount } from '$lib/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<main class="flex flex-col gap-4 px-6 py-6">
	{#each data.ships as ship (ship.id)}
		<div class="flex items-center px-5 py-4 bg-[#2a2a27] border border-[#444] rounded">
			<div class="flex flex-col gap-2">
				<div class="flex items-baseline gap-2">
					<span class="text-white font-medium capitalize">{ship.name}</span>
					<span class="text-gray-400 text-xs uppercase tracking-wider"
						>{formatAmount(ship.available)} available</span
					>
				</div>
				<div
					class="flex flex-col items-start gap-0.5 px-3 py-1.5 bg-[#333] border border-[#444] rounded w-fit"
				>
					<span class="text-gray-400 text-[10px] uppercase tracking-wider">Required:</span>
					<div class="flex flex-col items-start gap-0.5">
						{#each ship.costs as cost (cost.name)}
							<span
								class="text-xs {cost.available >= cost.cost ? 'text-green-400' : 'text-red-400'}"
							>
								<span class="capitalize">{cost.name}</span>: {formatAmount(cost.cost)}
							</span>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/each}
</main>
