import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import PrintClient from '#@/PrintClient.ts';

import { validateGetData } from '#@/sign/signGetData.ts';

// Checks what actually goes over the wire: filter format and a hash the API can verify.
describe('signed GET request', () => {
	const urls: URL[] = [];
	const server = createServer((request, response) => {
		urls.push(new URL(request.url, 'http://localhost'));
		response.writeHead(200, { 'content-type': 'application/json' });
		response.end(JSON.stringify({ data: [] }));
	});
	let client: PrintClient;

	beforeAll(async () => {
		await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
		const { port } = server.address() as AddressInfo;
		client = new PrintClient({
			publicKey: 'public',
			secretKey: 'secret',
			baseUrl: `http://127.0.0.1:${port}/api/connect-application/v1/`,
		});
	});

	afterAll(() => {
		server.close();
	});

	it('sends nested filters as JSON and signs exactly what is sent', async () => {
		await client.Jobs.list({ status: { in: ['done', 'failed'] }, perPage: 5 });

		const { searchParams } = urls.at(-1);
		expect(searchParams.get('status')).toBe('{"in":["done","failed"]}');
		expect(searchParams.get('perPage')).toBe('5');
		expect(searchParams.get('publicKey')).toBe('public');
		expect(validateGetData(searchParams, 'secret')).toBe(true);
	});
});
