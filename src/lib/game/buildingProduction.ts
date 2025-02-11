export function computeProductionForLevel(
	production: number,
	progress: number,
	level: number
): number {
	return level === 0 ? 0 : Math.floor(production * (level - 1) * Math.pow(progress, level - 1));
}
