<script lang="ts">
	import { FlexContainer, StyledLink, StyledTitle } from '@totocorpsoftwareinc/frontend-toolkit';

	import heroImage, { HOMEPAGE_HERO_IMAGE } from '$lib/stores/ui/heroImage';
	import heroContainer, { HOMEPAGE_HERO_CONTAINER_PROPS } from '$lib/stores/ui/heroContainer';

	heroImage.set(HOMEPAGE_HERO_IMAGE);
	heroContainer.set(HOMEPAGE_HERO_CONTAINER_PROPS);
</script>

<FlexContainer>
	<div class="fixed top-4 right-4">
		<form method="POST" action="?/logout">
			<button class="text-white hover:underline">Logout</button>
		</form>
	</div>

	<FlexContainer extensible={false} styling="h-1/5">
		<StyledTitle text="Galactic Sovereign" />
	</FlexContainer>

	<FlexContainer extensible={false} styling="h-3/5">
		<StyledLink text="Join new universe" link="/lobby/register" showAsButton={true} />

		<StyledLink text="Resume existing session" link="/lobby/login" showAsButton={true} />
	</FlexContainer>
</FlexContainer>
