<script lang="ts">
	import { type Snippet } from 'svelte';

	import { FlexContainer, Footer, StyledLink } from '@totocorpsoftwareinc/frontend-toolkit';

	import activeScreen from '$lib/stores/activeScreen';
	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<FlexContainer
	vertical={false}
	extensible={false}
	justify="center"
	align="stretch"
	styling="w-[90%] h-[90%]"
>
	<FlexContainer extensible={false} justify="start">
		<FlexContainer extensible={false}>
			<StyledLink
				text="Overview"
				link="overview"
				showAsButton={true}
				disabled={$activeScreen === 'overview'}
			/>
			<StyledLink
				text="Buildings"
				link="buildings"
				showAsButton={true}
				disabled={$activeScreen === 'buildings'}
			/>
		</FlexContainer>
	</FlexContainer>

	{@render children?.()}

	<Footer height="h-1/30">
		<p>
			Meet the <StyledLink text="author" link="https://github.com/Knoblauchpilze" /> on github!
		</p>
		<p>
			Found an issue? Report it <StyledLink
				text="here"
				link="https://github.com/Knoblauchpilze/galactic-sovereign/issues"
			/>
		</p>
	</Footer>
</FlexContainer>
