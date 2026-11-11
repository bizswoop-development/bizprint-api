// Shared smoke scenario: drives the built client against a local stub API.
import { strict as assert } from 'node:assert';
import { createServer } from 'node:http';

const station = { id: 1, name: 'Station' };

const serve = () =>
	new Promise((resolve) => {
		const requests = [];
		const server = createServer((request, response) => {
			const url = new URL(request.url, 'http://localhost');
			requests.push(url);
			if (url.pathname.endsWith('/stations/404')) {
				response.writeHead(404, { 'content-type': 'application/json' });
				response.end(JSON.stringify({ errorCode: 'ERR_NOT_FOUND', message: 'Not found' }));
				return;
			}
			const single = /\/stations\/\d+$/.test(url.pathname);
			response.writeHead(200, {
				'content-type': 'application/json',
				'x-biz-has-more': 'false',
				'x-biz-total-all': '1',
				'x-biz-total-pages': '1',
			});
			response.end(JSON.stringify({ data: single ? station : [station] }));
		}).listen(0, '127.0.0.1', () => resolve({ server, requests }));
	});

export const runScenario = async ({ PrintClient, Jobs, NotFoundError, signGetData }, label) => {
	const { server, requests } = await serve();
	try {
		const client = new PrintClient({
			publicKey: 'public',
			secretKey: 'secret',
			baseUrl: `http://127.0.0.1:${server.address().port}/api/connect-application/v1/`,
		});
		assert.ok(client.Jobs instanceof Jobs);

		const one = await client.Stations.retrieve(1);
		assert.equal(one.id, station.id);
		assert.equal(one.response.statusCode, 200);
		assert.equal(one.response.headers['content-type'], 'application/json');

		const list = await client.Stations.list();
		assert.deepEqual(list.data, [station]);
		assert.equal(list.hasMore, false);
		assert.equal(list.totalAll, 1);
		assert.equal(list.totalPages, 1);

		// Every GET request must carry the signature params.
		for (const url of requests) {
			assert.equal(url.searchParams.get('publicKey'), 'public');
			assert.ok(url.searchParams.get('time'));
			assert.match(url.searchParams.get('hash'), /^[0-9a-f]{64}$/);
		}

		await assert.rejects(client.Stations.retrieve(404), NotFoundError);

		assert.ok(signGetData(new URLSearchParams('a=1'), 'public', 'secret').get('hash'));
		console.log(`smoke ${label}: ok`);
	} finally {
		server.close();
	}
};
