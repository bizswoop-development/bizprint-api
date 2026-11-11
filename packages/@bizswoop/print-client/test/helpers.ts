import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';

/** Runs `fn` and returns what it threw; fails if it did not throw. */
export const catchError = async (fn: () => unknown): Promise<any> => {
	try {
		await fn();
	} catch (error) {
		return error;
	}
	throw new Error('Expected the call to throw, but it did not.');
};

/** A base URL on a port nothing listens on, to provoke a network error. */
export const closedBaseUrl = async () => {
	const server = createServer();
	await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
	const { port } = server.address() as AddressInfo;
	await new Promise((resolve) => server.close(resolve));
	return `http://127.0.0.1:${port}/api/connect-application/v1/` as const;
};
