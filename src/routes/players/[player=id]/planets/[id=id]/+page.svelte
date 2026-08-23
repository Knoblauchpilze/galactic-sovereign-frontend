<script lang="ts">
	import { formatDuration } from '$lib/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
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
				<dt class="text-sky-400 text-sm font-medium">Fields</dt>
				<dd class="text-white text-sm">
					{data.overview.usedFields}/{data.overview.totalFields}
				</dd>
			</div>
		</dl>

		{#if data.buildingAction}
			<div class="flex items-center justify-between min-h-16 px-5 py-3 border-t border-[#444]">
				<div class="flex flex-col gap-1">
					<div class="flex items-baseline gap-2">
						<span class="text-white font-medium capitalize">{data.buildingAction.buildingName}</span
						>
						<span class="text-gray-400 text-xs uppercase tracking-wider">
							Level {data.buildingAction.currentLevel} → {data.buildingAction.desiredLevel}
						</span>
					</div>
					<span class="text-gray-400 text-xs">
						Remaining: {formatDuration(data.buildingAction.remainingSeconds)}
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
	</section>
</main>
