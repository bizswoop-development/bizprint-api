import PrintClient from '@/PrintClient';
import UnauthorizedError from '@/errors/UnauthorizedError';

describe('PrintClient', () => {
	it('should throw error for wrong auth', async function () {
		try {
			const client = new PrintClient({
				publicKey: 'wrong',
				secretKey: 'wrong',
				baseUrl: 'http://localhost:8000/api/connect-application/v1/'
			});

			await client.Printers.list();
		} catch (error) {
			expect(error).toBeTruthy();
			expect(error).toBeInstanceOf(UnauthorizedError);
			expect(error.name).toBe('UnauthorizedError');
			expect(error.message).toBe('Unauthorized');
		}
	});
});
