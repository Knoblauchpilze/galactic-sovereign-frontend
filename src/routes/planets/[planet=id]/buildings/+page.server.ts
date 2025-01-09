import { loadAllCookiesOrRedirectToLogin } from '$lib/cookies';

import { HOMEPAGE_TITLE } from '$lib/stores/ui/pageTitle';

import { logout } from '$lib/actions/logout';
import { backToLobby } from '$lib/actions/backToLobby';
import {
	requestCreateBuildingAction,
	requestDeleteBuildingAction
} from '$lib/actions/buildingAction';
import { getUniverse } from '$lib/services/universes';
import { handleApiError, redirectToLoginIfNeeded } from '$lib/rest/api';
import { HttpStatus, parseApiResponseAsSingleValue } from '@totocorpsoftwareinc/frontend-toolkit';
import { UniverseResponseDto } from '$lib/communication/api/universeResponseDto';
import { error } from '@sveltejs/kit';
import { getPlanet } from '$lib/services/planets';
import { PlanetResponseDto } from '$lib/communication/api/planetResponseDto';
import { planetResourceResponseDtoToPlanetResourceUiDto } from '$lib/converters/resourceConverter';
import { buildingResponseDtoToPlanetResourceUiDto } from '$lib/converters/buildingConverter';
import { buildingActionResponseDtoToBuildingActionUiDto } from '$lib/converters/buildingActionConverter';

export async function load({ params, cookies, depends }) {
	const allCookies = loadAllCookiesOrRedirectToLogin(cookies);

	// https://learn.svelte.dev/tutorial/custom-dependencies
	depends('data:planet');

	let apiResponse = await getUniverse(allCookies.game.universeId, allCookies.session.apiKey);
	redirectToLoginIfNeeded(apiResponse);
	handleApiError(apiResponse);

	const universeDto = parseApiResponseAsSingleValue(apiResponse, UniverseResponseDto);
	if (universeDto === undefined) {
		error(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to get server data');
	}

	apiResponse = await getPlanet(allCookies.session.apiKey, params.planet);
	redirectToLoginIfNeeded(apiResponse);
	handleApiError(apiResponse);

	const planetDto = parseApiResponseAsSingleValue(apiResponse, PlanetResponseDto);
	if (planetDto === undefined) {
		error(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to get server data');
	}

	const resources = universeDto.resources.map((r) =>
		planetResourceResponseDtoToPlanetResourceUiDto(r, planetDto)
	);
	const buildings = universeDto.buildings.map((b) =>
		buildingResponseDtoToPlanetResourceUiDto(b, universeDto.resources, planetDto)
	);
	const actions = planetDto.buildingActions.map((a) => {
		const building = universeDto.buildings.find((b) => b.id === a.building);
		return buildingActionResponseDtoToBuildingActionUiDto(a, building);
	});

	return {
		wepageTitle: HOMEPAGE_TITLE + ' - ' + planetDto.name,

		universeName: universeDto.name,
		playerName: allCookies.game.playerName,
		planetName: planetDto.name,

		resources: resources,
		buildings: buildings,
		buildingActions: actions
	};
}

export const actions = {
	logout: logout,
	backToLobby: backToLobby,
	createBuildingAction: requestCreateBuildingAction,
	deleteBuildingAction: requestDeleteBuildingAction
};
