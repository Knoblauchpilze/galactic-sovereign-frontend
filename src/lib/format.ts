export function formatAmount(amount: number): string {
	return Math.round(amount).toLocaleString('en-US');
}

export function formatProduction(production: number): string {
	const rounded = Math.round(production);
	const sign = rounded < 0 ? '-' : '+';
	return `${sign}${Math.abs(rounded).toLocaleString('en-US')}/h`;
}

export function formatStorage(storage: number): string {
	if (Math.abs(storage) < 10_000) {
		return formatAmount(storage);
	}
	return `${Math.round(storage / 1_000).toLocaleString('en-US')}k`;
}

export function formatDuration(seconds: number): string {
	const clamped = Math.max(0, Math.floor(seconds));
	const days = Math.floor(clamped / 86400);
	const hours = Math.floor((clamped % 86400) / 3600);
	const minutes = Math.floor((clamped % 3600) / 60);
	const secs = clamped % 60;

	if (days > 0) {
		return `${days}d ${hours}h ${minutes}m ${secs}s`;
	}
	if (hours > 0) {
		return `${hours}h ${minutes}m ${secs}s`;
	}
	if (minutes > 0) {
		return `${minutes}m ${secs}s`;
	}
	return `${secs}s`;
}
