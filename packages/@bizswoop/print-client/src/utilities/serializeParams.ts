/**
 * Serializes query params the way the API expects (and the way axios 0.x did):
 * nested filters as JSON strings, dates as ISO strings, top-level arrays as `key[]`.
 * axios 1.x would send `id[gte]=20` instead of `id={"gte":20}`.
 */
export const serializeParams = (params: Record<string, unknown>): string => {
	const query = new URLSearchParams();

	for (const [key, value] of Object.entries(params ?? {})) {
		if (value === null || value === undefined) continue;

		if (Array.isArray(value)) {
			for (const item of value) query.append(`${key}[]`, serializeValue(item));
		} else {
			query.append(key, serializeValue(value));
		}
	}

	return query.toString();
};

const serializeValue = (value: unknown): string => {
	if (value instanceof Date) return value.toISOString();
	if (value !== null && typeof value === 'object') return JSON.stringify(value);
	return String(value);
};
