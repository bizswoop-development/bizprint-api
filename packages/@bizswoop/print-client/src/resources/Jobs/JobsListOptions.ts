import { ApiListOptionsInFilter } from '@/utilities/ApiListOptionsInFilter';
import { ApiListOptionsPagination } from '@/utilities/ApiListOptionsPagination';

import { JobStatus } from './Job';

export type JobsListOptions = ApiListOptionsPagination &
	(JobsListOptionsDate | JobsListOptionsId | JobsListOptionsStatus | {});

type JobsListOptionsDate = {
	createdAt: {
		gt: string;
	};
};

type JobsListOptionsId = {
	id: {
		gt: number;
	};
};

type JobsListOptionsStatus = ApiListOptionsInFilter<'status', JobStatus>;
