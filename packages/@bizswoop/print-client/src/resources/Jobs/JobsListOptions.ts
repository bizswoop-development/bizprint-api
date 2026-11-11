import type { ApiListOptionsInFilter } from '#@/utilities/ApiListOptionsInFilter.ts';
import type { ApiListOptionsPagination } from '#@/utilities/ApiListOptionsPagination.ts';

import type { JobStatus } from './Job.ts';

export type JobsListOptions = ApiListOptionsPagination &
	(JobsListOptionsDate | JobsListOptionsId | JobsListOptionsStatus | {});

type JobsListOptionsDate = {
	createdAt: {
		gte: string | Date;
	};
};

type JobsListOptionsId = {
	id: {
		gte: number;
	};
};

type JobsListOptionsStatus = ApiListOptionsInFilter<'status', JobStatus>;
