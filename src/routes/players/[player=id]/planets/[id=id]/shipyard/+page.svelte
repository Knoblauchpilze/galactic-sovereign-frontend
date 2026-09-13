<script lang="ts">
	import { page } from '$app/state';
	import { formatAmount, formatDuration } from '$lib/format';
	import type { Ship } from '$lib/server/mappers/ship';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let buildQuantities: Record<string, number | undefined> = $state({});
	let errorMessage = $state('');
	let showError = $state(false);

	$effect(() => {
		if (page.form?.message) {
			errorMessage = page.form.message;
			showError = true;

			const timer = window.setTimeout(() => {
				showError = false;
			}, 5000);

			return () => window.clearTimeout(timer);
		}
	});

	function maxBuildable(ship: Ship): number {
		const limits = ship.costs
			.filter((cost) => cost.cost > 0)
			.map((cost) => Math.floor(cost.available / cost.cost));
		return limits.length > 0 ? Math.min(...limits) : Infinity;
	}

	function sanitizeQuantityInput(ship: Ship, event: Event & { currentTarget: HTMLInputElement }) {
		const digitsOnly = event.currentTarget.value.replace(/\D/g, '');
		const capped = digitsOnly ? Math.min(Number(digitsOnly), maxBuildable(ship)) : undefined;
		event.currentTarget.value = capped?.toString() ?? '';
		buildQuantities[ship.id] = capped;
	}
</script>

<main class="flex flex-col gap-4 px-6 py-6">
	{#if showError}
		<div class="px-4 py-3 bg-red-900/30 border border-red-600 rounded text-red-200 text-sm">
			{errorMessage}
		</div>
	{/if}

	{#each data.ships as ship (ship.id)}
		<div
			class="flex items-center justify-between px-5 py-4 bg-[#2a2a27] border border-[#444] rounded"
		>
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
			<div class="flex items-center gap-4">
				<div
					class="flex flex-col items-center gap-0.5 px-3 py-1.5 bg-[#333] border border-[#444] rounded"
				>
					<span class="text-gray-400 text-[10px] uppercase tracking-wider">Completion time</span>
					<span class="text-white text-sm font-medium">
						{formatDuration(ship.completionSeconds)}
					</span>
				</div>
				<form method="POST" action="?/build" class="flex flex-col gap-2">
					<input type="hidden" name="ship" value={ship.id} />
					<input
						type="text"
						name="count"
						inputmode="numeric"
						pattern="[0-9]*"
						placeholder="Count"
						value={buildQuantities[ship.id] ?? ''}
						oninput={(event) => sanitizeQuantityInput(ship, event)}
						disabled={maxBuildable(ship) === 0 || !ship.requirementsMet}
						class="w-20 px-2 py-1.5 bg-white border border-[#444] rounded text-black text-sm text-center focus:outline-none focus:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
					/>
					<button
						type="submit"
						disabled={!buildQuantities[ship.id] || !ship.requirementsMet}
						class="w-20 px-4 py-1.5 text-white border-0 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer {buildQuantities[
							ship.id
						]
							? 'bg-green-600 hover:enabled:bg-green-400 active:enabled:bg-green-600'
							: 'bg-red-800 hover:enabled:bg-red-400 active:enabled:bg-red-600'}"
					>
						Build
					</button>
				</form>
			</div>
		</div>
	{/each}
</main>
