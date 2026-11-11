import type { ApiListOptionsPagination } from '#@/utilities/ApiListOptionsPagination.ts';

export type StationsListOptions = ApiListOptionsPagination &
	(StationsListOptionsId | StationsListOptionsDate | {});

type StationsListOptionsId = {
	id: {
		gte: number;
	};
};

type StationsListOptionsDate = {
	createdAt: {
		gte: string | Date;
	};
};
