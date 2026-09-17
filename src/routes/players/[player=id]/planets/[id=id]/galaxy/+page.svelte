<script lang="ts">
	let galaxy = $state(0);
	let solarSystem = $state(0);

	function changeValue(value: number, amount: number) {
		return Math.max(0, value + amount);
	}
</script>

<main class="flex flex-col gap-4 px-6 py-6">
	<section class="flex flex-wrap items-center gap-4 bg-[#2a2a27] border border-[#444] rounded px-5 py-4">
		<div class="flex items-center gap-2">
			<label for="galaxy" class="text-gray-400 text-sm font-medium">Galaxy</label>
			<div class="flex items-center">
				<button
					type="button"
					aria-label="Previous galaxy"
					onclick={() => (galaxy = changeValue(galaxy, -1))}
					class="flex items-center justify-center w-9 h-9 rounded-l text-white bg-[#333] border border-[#444] hover:bg-[#444] cursor-pointer"
				>
					&#8592;
				</button>
				<input
					id="galaxy"
					type="number"
					min="0"
					bind:value={galaxy}
					class="w-16 h-9 appearance-none text-center text-white bg-[#21211f] border-y border-[#444] outline-none"
				/>
				<button
					type="button"
					aria-label="Next galaxy"
					onclick={() => (galaxy = changeValue(galaxy, 1))}
					class="flex items-center justify-center w-9 h-9 rounded-r text-white bg-[#333] border border-[#444] hover:bg-[#444] cursor-pointer"
				>
					&#8594;
				</button>
			</div>
		</div>

		<div class="flex items-center gap-2">
			<label for="solar-system" class="text-gray-400 text-sm font-medium">Solar system</label>
			<div class="flex items-center">
				<button
					type="button"
					aria-label="Previous solar system"
					onclick={() => (solarSystem = changeValue(solarSystem, -1))}
					class="flex items-center justify-center w-9 h-9 rounded-l text-white bg-[#333] border border-[#444] hover:bg-[#444] cursor-pointer"
				>
					&#8592;
				</button>
				<input
					id="solar-system"
					type="number"
					min="0"
					bind:value={solarSystem}
					class="w-16 h-9 appearance-none text-center text-white bg-[#21211f] border-y border-[#444] outline-none"
				/>
				<button
					type="button"
					aria-label="Next solar system"
					onclick={() => (solarSystem = changeValue(solarSystem, 1))}
					class="flex items-center justify-center w-9 h-9 rounded-r text-white bg-[#333] border border-[#444] hover:bg-[#444] cursor-pointer"
				>
					&#8594;
				</button>
			</div>
		</div>
	</section>

	<section class="flex flex-col bg-[#2a2a27] border border-[#444] rounded">
		{#each Array(5) as _, index (index)}
			<div class="h-14 border-b border-[#444] last:border-b-0"></div>
		{/each}
	</section>
</main>

<style>
	:global(input[type='number']::-webkit-inner-spin-button),
	:global(input[type='number']::-webkit-outer-spin-button) {
		-webkit-appearance: none;
		margin: 0;
	}

	:global(input[type='number']) {
		appearance: textfield;
		-moz-appearance: textfield;
	}
</style>
