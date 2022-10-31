import { ApiListOptionsPagination } from '@/utilities/ApiListOptionsPagination';

export type StationsListOptions = ApiListOptionsPagination &
	(StationsListOptionsId | StationsListOptionsDate | {});

type StationsListOptionsId = {
	id: {
		gt: number;
	};
};

type StationsListOptionsDate = {
	createdAt: {
		gt: string;
	};
};
