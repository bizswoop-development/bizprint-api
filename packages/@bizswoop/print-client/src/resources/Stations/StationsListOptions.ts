import { ApiListOptionsPagination } from '@/utilities/ApiListOptionsPagination';

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
