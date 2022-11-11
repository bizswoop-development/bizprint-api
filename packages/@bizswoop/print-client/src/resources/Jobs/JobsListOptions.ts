import { ApiListOptionsInFilter } from '@/utilities/ApiListOptionsInFilter';
import { ApiListOptionsPagination } from '@/utilities/ApiListOptionsPagination';

import { JobStatus } from './Job';

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
