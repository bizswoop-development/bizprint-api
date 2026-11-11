import { describe, it, expect } from 'vitest';

import PrintClient from '#@/PrintClient.ts';

import UnauthorizedError from '#@/errors/UnauthorizedError.ts';

import { catchError } from './helpers.ts';

describe('PrintClient', () => {
	it('should throw error for wrong auth', async function () {
		const error = await catchError(async () => {
			const client = new PrintClient({
				publicKey: 'wrong',
				secretKey: 'wrong',
				baseUrl: 'http://localhost:8000/api/connect-application/v1/',
			});

			await client.Printers.list();
		});

		expect(error).toBeTruthy();
		expect(error).toBeInstanceOf(UnauthorizedError);
		expect(error.name).toBe('UnauthorizedError');
	});
});
