<script lang="ts">
	import {
		FlexContainer,
		FormField,
		StyledButton,
		StyledError,
		StyledLink,
		StyledText,
		StyledTitle
	} from '@totocorpsoftwareinc/frontend-toolkit';

	import heroImage, { HOMEPAGE_HERO_IMAGE } from '$lib/stores/ui/heroImage';
	import heroContainer, { HOMEPAGE_HERO_CONTAINER_PROPS } from '$lib/stores/ui/heroContainer';

	let { form = $bindable(), data } = $props();

	function resetFormError() {
		if (!form) {
			return;
		}
		form.message = '';
	}

	heroImage.set(HOMEPAGE_HERO_IMAGE);
	heroContainer.set(HOMEPAGE_HERO_CONTAINER_PROPS);
</script>

<FlexContainer>
	<div class="fixed top-4 right-4">
		<p class="text-secondary">
			Back to the <StyledLink text="lobby" link="/lobby" />
		</p>
	</div>

	<FlexContainer extensible={false} styling="h-1/5">
		<StyledTitle text="Galactic Sovereign" />
		<StyledText text="Join new universe" />
	</FlexContainer>

	<FlexContainer extensible={false} styling="h-3/5">
		{#if data.universes.length > 0}
			<form method="POST" action="?/register" class="flex flex-1 flex-col justify-evenly">
				<FormField label="universe:" labelId="universe" labelStyling="text-secondary">
					<select id="universe" name="universe" class="bg-white">
						{#each data.universes as universe (universe.id)}
							<option value={universe.id}>{universe.name}</option>
						{/each}
					</select>
				</FormField>
				<FormField label="player:" labelId="player" labelStyling="text-secondary">
					<input
						id="player"
						type="text"
						name="player"
						placeholder="Choose a name"
						required
						value={form?.player ?? ''}
						oninput={resetFormError}
						class="bg-white"
					/></FormField
				>
				<StyledButton text="Start" />
			</form>
		{:else}
			<StyledError text="You already have an account in all universes, please login!" />
			<StyledLink text="Login" link="/lobby/login" showAsButton={true} />
		{/if}

		{#if form?.message}
			<div class="fixed bottom-4">
				<StyledError text="Failed to register in universe: {form.message}" />
			</div>
		{/if}
	</FlexContainer>
</FlexContainer>
