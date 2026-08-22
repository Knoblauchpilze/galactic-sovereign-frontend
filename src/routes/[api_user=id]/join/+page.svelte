<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="relative flex flex-col items-center w-full min-h-screen bg-[#21211f] px-4 py-12">
	<div
		class="w-1/2 min-w-80 flex flex-col items-center gap-8 px-5 py-8 bg-[#2a2a27] border border-[#444] rounded"
	>
		<h1 class="text-white text-2xl">Join a new universe</h1>

		<a
			href={resolve('/[api_user=id]/lobby', { api_user: data.apiUserId })}
			class="px-6 py-2 bg-[#444] text-white border-0 rounded text-base font-medium cursor-pointer transition-colors hover:bg-[#555] active:bg-[#333]"
		>
			Back to lobby
		</a>
	</div>
</div>
