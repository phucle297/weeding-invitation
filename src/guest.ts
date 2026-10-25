export function getGuestName(search: string): string {
	return new URLSearchParams(search).get("name")?.trim() || "Quý khách";
}
