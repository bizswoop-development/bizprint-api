import type { JsonObject } from '#@/utilities/Json.ts';

export type JobCreateData = {
	printerId: number;
	printOption?: JsonObject;
	url: string;
	description: string;
};
