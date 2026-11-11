import { describe, it, expect } from 'vitest';

import PrintClient from '#@/PrintClient.ts';

import JobCreatingInvalidPrinterError from '#@/resources/Jobs/errors/JobCreatingInvalidPrinterError.ts';
import JobCreatingInvalidRequestError from '#@/resources/Jobs/errors/JobCreatingInvalidRequestError.ts';
import JobCreatingPrintJobLimitError from '#@/resources/Jobs/errors/JobCreatingPrintJobLimitError.ts';

import AccessForbiddenError from '#@/errors/AccessForbiddenError.ts';
import NotFoundError from '#@/errors/NotFoundError.ts';

import { catchError } from '#~/test/helpers.ts';

describe('Jobs', () => {
	const client = new PrintClient({
		publicKey: 'c321430d35c6d425799db9f85a11d50b',
		secretKey: '321430d35c6d425799db9f85a11d50b0',
		baseUrl: 'http://localhost:8000/api/connect-application/v1/',
	});

	it('should create an instance', () => {
		expect(client.Jobs).toBeTruthy();
	});

	it('should fetch jobs pagination by promise, page 3', async () => {
		const jobs = await client.Jobs.list({ perPage: 10, page: 3 });

		expect(jobs.data.length).toBe(10);
	});

	it('should fetch jobs pagination by promise, page 4', async () => {
		const jobs = await client.Jobs.list({ perPage: 10, page: 4 });

		expect(jobs.data.length).toBe(4);
	});

	it('should fetch all jobs by async iterator', async () => {
		let allJobs = [];
		for await (let jobs of client.Jobs.list()) {
			allJobs = allJobs.concat(jobs.data);
		}

		expect(allJobs.length).toBe(34);
	});

	it('should fetch all jobs filtering, gt id', async () => {
		let allJobs = [];
		for await (let jobs of client.Jobs.list({ id: { gte: 20 } })) {
			allJobs = allJobs.concat(jobs.data);
		}

		expect(allJobs.length).toBe(15);
	});

	it('should fetch all jobs filtering, single status done', async () => {
		let allJobs = [];
		for await (let jobs of client.Jobs.list({ status: 'done' })) {
			allJobs = allJobs.concat(jobs.data);
		}

		expect(allJobs.length).toBe(5);
	});

	it('should fetch all jobs filtering, multiple status done and failed', async () => {
		let allJobs = [];
		for await (let jobs of client.Jobs.list({
			status: { in: ['done', 'processing'] },
		})) {
			allJobs = allJobs.concat(jobs.data);
		}

		expect(allJobs.length).toBe(18);
	});

	it('should fetch all jobs filtering, multiple status not done', async () => {
		let allJobs = [];
		for await (let jobs of client.Jobs.list({
			status: { notIn: 'done' },
		})) {
			allJobs = allJobs.concat(jobs.data);
		}

		expect(allJobs.length).toBe(29);
	});

	it('should fetch all jobs filtering, multiple status not done and connecting-to-printer', async () => {
		let allJobs = [];
		for await (let jobs of client.Jobs.list({
			status: { notIn: ['done', 'connecting-to-printer'] },
		})) {
			allJobs = allJobs.concat(jobs.data);
		}

		expect(allJobs.length).toBe(22);
	});

	it('should fetch all jobs filtering, created at string', async () => {
		let allJobs = [];
		for await (let jobs of client.Jobs.list({
			createdAt: { gte: '2022-04-21T19:25:00.000Z' },
		})) {
			allJobs = allJobs.concat(jobs.data);
		}

		expect(allJobs.length).toBe(12);
	});

	it('should fetch all jobs filtering, created at date', async () => {
		let allJobs = [];
		for await (let jobs of client.Jobs.list({
			createdAt: { gte: new Date('2022-04-21T19:25:00.000Z') },
		})) {
			allJobs = allJobs.concat(jobs.data);
		}

		expect(allJobs.length).toBe(12);
	});

	it('should fetch specific job', async () => {
		const job = await client.Jobs.retrieve(1);

		expect(job).toHaveProperty('id');
		expect(job).toHaveProperty('url');
		expect(job).toHaveProperty('printerId');
		expect(job).toHaveProperty('description');
		expect(job).toHaveProperty('status');
		expect(job).toHaveProperty('createdAt');
		expect(job).toHaveProperty('updatedAt');
	});

	it('should fail to fetch job, not found', async () => {
		const error = await catchError(async () => {
			await client.Jobs.retrieve(200);
		});

		expect(error).toBeInstanceOf(NotFoundError);
		expect(error.name).toBe('NotFoundError');
		expect(error.message).toBe('Job not found');
	});

	it('should fail to fetch job, access forbidden', async () => {
		const error = await catchError(async () => {
			await client.Jobs.retrieve(35);
		});

		expect(error).toBeInstanceOf(AccessForbiddenError);
		expect(error.name).toBe('AccessForbiddenError');
		expect(error.message).toBe('You are not authorized to access this job');
	});

	it('should create job', async () => {
		const job = await client.Jobs.create({
			printerId: 1,
			description: 'Test job',
			url: 'https://localhost:8000/order/35',
		});

		expect(job).toBeTruthy();

		const jobRetrieve = await client.Jobs.retrieve(job.id);

		expect(jobRetrieve.id).toBe(job.id);
		expect(jobRetrieve.printerId).toBe(job.printerId);
	});

	it('should fail create job, invalid printer (access error)', async () => {
		const error = await catchError(async () => {
			await client.Jobs.create({
				printerId: 15,
				description: 'Test job',
				url: 'https://localhost:8000/order/35',
			});
		});

		expect(error).toBeInstanceOf(JobCreatingInvalidPrinterError);
		expect(error.name).toBe('JobCreatingInvalidPrinterError');
	});

	it('should fail create job, invalid printer (not error)', async () => {
		const error = await catchError(async () => {
			await client.Jobs.create({
				printerId: 4000,
				description: 'Test job',
				url: 'https://localhost:8000/order/35',
			});
		});

		expect(error).toBeInstanceOf(JobCreatingInvalidPrinterError);
		expect(error.name).toBe('JobCreatingInvalidPrinterError');
	});

	it('should fail create job, invalid url', async () => {
		const error = await catchError(async () => {
			await client.Jobs.create({
				printerId: 1,
				description: 'Test job',
				url: 'invalid url',
			});
		});

		expect(error).toBeInstanceOf(JobCreatingInvalidRequestError);
		expect(error.name).toBe('JobCreatingInvalidRequestError');
		expect(error.errors).toHaveProperty('url');
		expect(error.errors.url).toContain('Url must be a valid URL');
	});

	it('should fail create job, required url', async () => {
		const error = await catchError(async () => {
			// @ts-ignore
			await client.Jobs.create({
				printerId: 1,
				description: 'Test job',
			});
		});

		expect(error).toBeInstanceOf(JobCreatingInvalidRequestError);
		expect(error.name).toBe('JobCreatingInvalidRequestError');
		expect(error.errors).toHaveProperty('url');
		expect(error.errors.url).toContain('Url is a required field');
	});

	it('should fail create job, required printerId', async () => {
		const error = await catchError(async () => {
			// @ts-ignore
			await client.Jobs.create({
				description: 'Test job',
				url: 'https://localhost:8000/order/35',
			});
		});

		expect(error).toBeInstanceOf(JobCreatingInvalidRequestError);
		expect(error.name).toBe('JobCreatingInvalidRequestError');
		expect(error.errors).toHaveProperty('printerId');
		expect(error.errors.printerId).toContain('Printer ID is a required field');
	});

	it('should fail create job, required description', async () => {
		const error = await catchError(async () => {
			// @ts-ignore
			await client.Jobs.create({
				printerId: 1,
				url: 'https://localhost:8000/order/35',
			});
		});

		expect(error).toBeInstanceOf(JobCreatingInvalidRequestError);
		expect(error.name).toBe('JobCreatingInvalidRequestError');
		expect(error.errors).toHaveProperty('description');
		expect(error.errors.description).toContain('Description is a required field');
	});

	it('should fail create job, print limit exceeded', async () => {
		const error = await catchError(async () => {
			for (let i = 0; i <= 60; i++) {
				await client.Jobs.create({
					printerId: 1,
					description: `Test job ${i}`,
					url: `https://localhost:8000/order/test-${i}`,
				});
			}
		});

		expect(error).toBeInstanceOf(JobCreatingPrintJobLimitError);
		expect(error.name).toBe('JobCreatingPrintJobLimitError');
	});
});
