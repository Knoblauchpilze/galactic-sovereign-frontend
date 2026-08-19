<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<div class="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#21211f] text-white">
	<p class="text-lg font-medium">Oh noes, something went wrong!</p>
	<p class="text-sm text-red-400">{page.error?.message}</p>
	<a href={resolve('/')} class="text-sm text-blue-400 hover:underline">Return to login</a>
</div>
