import { JsonObject } from 'type-fest';

export type JobCreateData = {
	printerId: number;
	printOption?: JsonObject;
	url: string;
	description: string;
};
