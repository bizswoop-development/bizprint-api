export interface ApiList<T> {
	data: Array<T>;
	hasMore: boolean;
	totalAll: number;
	totalPages: number;
}
