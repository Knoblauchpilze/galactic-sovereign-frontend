<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { formatDuration } from '$lib/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let buildingRemainingSeconds = $state<number>();
	let shipNextRemainingSeconds = $state<number>();
	let shipTotalRemainingSeconds = $state<number>();

	$effect(() => {
		const buildingAction = data.buildingAction;
		const activeShipAction = data.shipActions.active;

		if (!buildingAction && !activeShipAction) {
			buildingRemainingSeconds = undefined;
			shipNextRemainingSeconds = undefined;
			shipTotalRemainingSeconds = undefined;
			return;
		}

		let invalidated = false;
		const buildingCompletedAt = buildingAction
			? new Date(buildingAction.completedAt).getTime()
			: null;
		const shipNextCompletionAt = activeShipAction
			? new Date(activeShipAction.nextCompletionAt).getTime()
			: null;

		const updateTimers = () => {
			const now = Date.now();

			if (buildingCompletedAt !== null) {
				buildingRemainingSeconds = Math.max(0, (buildingCompletedAt - now) / 1000);
				if (!invalidated && buildingRemainingSeconds === 0) {
					invalidated = true;
					void invalidateAll();
				}
			} else {
				buildingRemainingSeconds = undefined;
			}

			if (shipNextCompletionAt !== null && activeShipAction) {
				shipNextRemainingSeconds = Math.max(0, (shipNextCompletionAt - now) / 1000);
				shipTotalRemainingSeconds =
					shipNextRemainingSeconds +
					Math.max(0, activeShipAction.count - 1) * activeShipAction.unitCompletionSeconds;

				if (!invalidated && shipNextRemainingSeconds === 0) {
					invalidated = true;
					void invalidateAll();
				}
			} else {
				shipNextRemainingSeconds = undefined;
				shipTotalRemainingSeconds = undefined;
			}
		};

		updateTimers();

		const interval = window.setInterval(updateTimers, 1000);

		return () => {
			window.clearInterval(interval);
		};
	});
</script>

<main class="flex flex-col gap-4 px-6 py-6">
	<section class="bg-[#2a2a27] border border-[#444] rounded">
		<header class="px-5 py-3 border-b border-[#444]">
			<h1 class="text-white font-medium">
				{data.overview.name} [{data.overview.coordinates}]
			</h1>
		</header>

		<dl class="flex flex-col">
			<div class="flex items-center justify-between px-5 py-3">
				<dt class="text-sky-400 text-base font-medium">Fields</dt>
				<dd class="text-white text-sm">
					{data.overview.usedFields}/{data.overview.totalFields}
				</dd>
			</div>
		</dl>

		<header class="px-5 py-3 border-t border-[#444]">
			<h2 class="text-sky-400 text-base font-medium">Building action</h2>
		</header>

		{#if data.buildingAction}
			<div class="flex items-center justify-between min-h-16 px-5 py-3 border-t border-[#444]">
				<div class="flex flex-col gap-1">
					<div class="flex items-baseline gap-2">
						<span class="text-white text-sm font-medium capitalize"
							>{data.buildingAction.buildingName}</span
						>
						<span class="text-gray-400 text-xs uppercase tracking-wider">
							Level {data.buildingAction.currentLevel} → {data.buildingAction.desiredLevel}
						</span>
					</div>
					<span class="text-gray-400 text-xs">
						Remaining: {formatDuration(
							buildingRemainingSeconds ?? data.buildingAction.remainingSeconds
						)}
					</span>
				</div>
				<form method="POST" action="?/cancel">
					<button
						type="submit"
						class="px-5 py-2 bg-red-800 text-white border-0 rounded text-sm font-medium cursor-pointer transition-colors hover:bg-red-400 active:bg-red-600"
					>
						Cancel
					</button>
				</form>
			</div>
		{:else}
			<div class="flex items-center min-h-16 px-5 py-3 border-t border-[#444]">
				<span class="text-gray-400 text-sm">No building action at the moment</span>
			</div>
		{/if}

		<header class="px-5 py-3 border-t border-[#444]">
			<h2 class="text-sky-400 text-base font-medium">Ship actions</h2>
		</header>

		{#if data.shipActions.active}
			<div class="flex items-center justify-between min-h-16 px-5 py-3 border-t border-[#444]">
				<div class="flex flex-col gap-1">
					<div class="flex items-baseline gap-2">
						<span class="text-white text-sm font-medium capitalize"
							>{data.shipActions.active.shipName}</span
						>
						<span class="text-gray-400 text-xs uppercase tracking-wider">
							Amount: {data.shipActions.active.count}
						</span>
					</div>
					<div class="flex flex-col gap-0.5 text-xs text-gray-400">
						<span>
							Next completion: {formatDuration(
								shipNextRemainingSeconds ?? data.shipActions.active.nextRemainingSeconds
							)}
						</span>
						<span>
							Total remaining: {formatDuration(
								shipTotalRemainingSeconds ?? data.shipActions.active.totalRemainingSeconds
							)}
						</span>
					</div>
				</div>
			</div>

			{#each data.shipActions.queued as shipAction, index (index)}
				<div class="flex items-center justify-between min-h-16 px-5 py-3 border-t border-[#444]">
					<div class="flex flex-col gap-1">
						<div class="flex items-baseline gap-2">
							<span class="text-white text-sm font-medium capitalize">{shipAction.shipName}</span>
							<span class="text-gray-400 text-xs uppercase tracking-wider">
								Amount: {shipAction.count}
							</span>
						</div>
						<div class="flex flex-col gap-0.5 text-xs text-gray-400">
							<span>Total duration: {formatDuration(shipAction.totalDurationSeconds)}</span>
						</div>
					</div>
				</div>
			{/each}
		{:else}
			<div class="flex items-center min-h-16 px-5 py-3 border-t border-[#444]">
				<span class="text-gray-400 text-sm">No ship action at the moment</span>
			</div>
		{/if}
	</section>
</main>
