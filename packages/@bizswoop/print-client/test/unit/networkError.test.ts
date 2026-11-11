import { isAxiosError } from 'axios';
import { beforeAll, describe, expect, it } from 'vitest';

import PrintClient from '#@/PrintClient.ts';

import { catchError, closedBaseUrl } from '#~/test/helpers.ts';

// A failure without an HTTP response (connection refused, timeout, DNS) has no error body.
// It must surface as the original axios error, not as a TypeError from reading `errorCode`.
describe('network errors', () => {
	let client: PrintClient;

	beforeAll(async () => {
		client = new PrintClient({
			publicKey: 'public',
			secretKey: 'secret',
			baseUrl: await closedBaseUrl(),
		});
	});

	const calls: Record<string, () => unknown> = {
		'Jobs.retrieve': () => client.Jobs.retrieve(1),
		'Jobs.list': () => client.Jobs.list(),
		'Jobs.create': () => client.Jobs.create({ printerId: 1, url: 'http://x', description: 'x' }),
		'Printers.retrieve': () => client.Printers.retrieve(1),
		'Printers.list': () => client.Printers.list(),
		'Stations.retrieve': () => client.Stations.retrieve(1),
		'Stations.list': () => client.Stations.list(),
	};

	for (const [name, call] of Object.entries(calls)) {
		it(`${name} rethrows the axios error`, async () => {
			const error = await catchError(call);

			expect(isAxiosError(error)).toBe(true);
			expect(error.code).toBe('ECONNREFUSED');
		});
	}
});
