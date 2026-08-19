<script lang="ts">
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
	</section>
</main>
