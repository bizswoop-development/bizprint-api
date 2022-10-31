export type Job = {
	id: number;
	description: string;
	status: JobStatus;
	url: string;
	printerId: number;
	createdAt: string;
	updatedAt: string;
};

export type JobStatus =
	| 'pending'
	| 'processing'
	| 'done'
	| 'failed'
	| 'connecting-to-printer'
	| 'archived';
