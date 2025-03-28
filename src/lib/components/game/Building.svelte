<script lang="ts">
	import { StyledText } from '@totocorpsoftwareinc/frontend-toolkit';
	import { ConfirmationButton } from '$lib/components';
	import type {
		PlanetBuildingUiDto,
		PlanetBuildingCostUiDto
	} from '$lib/communication/ui/planetBuildingUiDto';
	import type { PlanetResourceUiDto } from '$lib/communication/ui/planetResourceUiDto';

	interface Props {
		building: PlanetBuildingUiDto;
		availableResources: PlanetResourceUiDto[];
		buildingActionAlreadyRunning: boolean;
	}

	let { building, availableResources, buildingActionAlreadyRunning }: Props = $props();

	// https://kit.svelte.dev/docs/images#sveltejs-enhanced-img-dynamically-choosing-an-image
	// https://github.com/vitejs/vite/issues/9599#issuecomment-1209333753
	const modules = import.meta.glob<Record<string, string>>('$lib/assets/buildings/*.webp', {
		eager: true,
		query: {
			enhanced: true
		}
	});

	function canAfford(
		cost: PlanetBuildingCostUiDto,
		availableResources: PlanetResourceUiDto[]
	): boolean {
		const maybeResource = availableResources.find((r) => r.name === cost.resource);
		return maybeResource === undefined || maybeResource.amount >= cost.cost;
	}

	function textColor(
		cost: PlanetBuildingCostUiDto,
		availableResources: PlanetResourceUiDto[]
	): string {
		const affordable = canAfford(cost, availableResources);
		if (affordable) {
			return 'text-enabled';
		}
		return 'text-disabled';
	}

	// https://stackoverflow.com/questions/49296458/capitalize-first-letter-of-a-string-using-angular-or-typescript
	let title = $derived(building.name[0].toUpperCase() + building.name.slice(1));

	// https://stackoverflow.com/questions/68060723/glob-import-of-image-urls-in-sveltekit
	// https://stackoverflow.com/questions/423376/how-to-get-the-file-name-from-a-full-path-using-javascript
	let images = $derived(
		Object.keys(modules).map((imagePath) => {
			return {
				building: imagePath
					.replace(/^.*[\\/]/, '')
					.replace(/\..*$/, '')
					.replace(/_/, ' '),
				data: modules[imagePath].default
			};
		})
	);

	let costs = $derived(
		building.costs.map((c) => ({
			resource: c.resource,
			cost: c.cost,
			color: textColor(c, availableResources)
		}))
	);

	let gains = $derived(
		building.resourcesProduction.map((rp) => ({
			resource: rp.resource,
			nextProduction: rp.nextProduction,
			gain: rp.gain
		}))
	);
	let needsGainsSection = $derived(gains.length > 0);

	let buildingImage = $derived(images.find((image) => image.building === building.name));

	const isAffordable = building.costs.reduce(
		(currentlyAffordable, cost) => currentlyAffordable && canAfford(cost, availableResources),
		true
	);
</script>

<div class="bg-overlay m-2 p-4">
	<StyledText text="{title} (level {building.level})" styling="font-bold" />
	{#if buildingImage !== undefined}
		<enhanced:img src={buildingImage.data} alt="Building visual" width="150" height="150" />
	{/if}
	<StyledText text="Required for level {building.level + 1}:" textColor="text-white" />
	<table>
		<tbody>
			{#each costs as cost (cost.resource)}
				<tr>
					<td class="text-white capitalize">{cost.resource}:</td>
					<td class={cost.color}>{cost.cost}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	{#if needsGainsSection}
		<StyledText text="Production:" textColor="text-white" />
		<table>
			<tbody>
				{#each gains as gain (gain.resource)}
					<tr>
						<td class="text-white capitalize">{gain.resource}:</td>
						<td class="text-enabled">{gain.nextProduction}(+{gain.gain})</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
	<!-- https://kit.svelte.dev/docs/form-actions#default-actions -->
	<form method="POST" action="?/createBuildingAction">
		<input class="hidden" id="planet" name="planet" value={building.planet} />
		<input class="hidden" id="building" name="building" value={building.id} />
		<ConfirmationButton text="Upgrade" enabled={isAffordable && !buildingActionAlreadyRunning} />
	</form>
</div>
