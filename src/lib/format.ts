export function formatAmount(amount: number): string {
	return Math.round(amount).toLocaleString('en-US');
}
