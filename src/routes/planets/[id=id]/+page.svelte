<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const formatNumber = (value: number) => new Intl.NumberFormat('de-DE').format(value);
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
				<dt class="text-sky-400 text-sm font-medium">Diameter</dt>
				<dd class="text-white text-sm">
					{formatNumber(data.overview.diameter)}km
					<span class="text-gray-400">
						({data.overview.usedFields}/{data.overview.totalFields})
					</span>
				</dd>
			</div>
		</dl>
	</section>
</main>
