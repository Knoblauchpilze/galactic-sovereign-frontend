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

	interface Props {
		form: HTMLFormElement;
	}

	let { form = $bindable() }: Props = $props();

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
	<FlexContainer extensible={false} styling="h-1/5">
		<StyledTitle text="Galactic Sovereign" />
	</FlexContainer>

	<p class="text-white">
		Already have an account yet? Click <StyledLink text="here" link="/login" /> to login!
	</p>

	<FlexContainer extensible={false} styling="h-3/5">
		<StyledText text="Sign up" />
		<form method="POST" action="?/signup" class="flex flex-1 flex-col justify-evenly">
			<FormField label="email:" labelId="email" labelStyling="text-secondary">
				<input
					id="email"
					type="text"
					name="email"
					placeholder="Enter your email address"
					required
					value={form?.email ?? ''}
					oninput={resetFormError}
					class="bg-white"
				/>
			</FormField>
			<FormField label="password:" labelId="password" labelStyling="text-secondary">
				<input
					id="password"
					type="text"
					name="password"
					placeholder="Enter your password"
					required
					oninput={resetFormError}
					class="bg-white"
				/></FormField
			>
			<StyledButton text="Sign up" />
		</form>

		{#if form?.message}
			<div class="fixed bottom-4">
				<StyledError text="Failed to sign up: {form.message}" />
			</div>
		{/if}
	</FlexContainer>
</FlexContainer>
