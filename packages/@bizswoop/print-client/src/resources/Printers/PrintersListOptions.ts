import type { ApiListOptionsInFilter } from '#@/utilities/ApiListOptionsInFilter.ts';
import type { ApiListOptionsPagination } from '#@/utilities/ApiListOptionsPagination.ts';

export type PrintersListOptions = ApiListOptionsPagination &
	(
		| PrintersListOptionsId
		| PrintersListOptionsDate
		| PrintersListOptionsStationId
		| PrintersListOptionsStatus
		| {}
	);

type PrintersListOptionsId = {
	id: {
		gte: number;
	};
};

type PrintersListOptionsDate = {
	createdAt: {
		gte: string | Date;
	};
};

type StationId = number;

type PrintersListOptionsStationId = ApiListOptionsInFilter<'stationId', StationId>;

type PrintersListOptionsStatus = {
	status: 'online' | 'offline' | 'all';
};
