import { ApiListOptionsInFilter } from '@/utilities/ApiListOptionsInFilter';
import { ApiListOptionsPagination } from '@/utilities/ApiListOptionsPagination';

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
