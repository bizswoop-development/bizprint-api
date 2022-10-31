import PrintClient from '@/PrintClient';

describe('Stations', () => {
	const client = new PrintClient({
		publicKey: 'c321430d35c6d425799db9f85a11d50b',
		secretKey: '321430d35c6d425799db9f85a11d50b0',
		baseUrl: 'http://localhost:8000/api/connect-application/v1/'
	});

	it('should create an instance', () => {
		expect(client.Stations).toBeTruthy();
	});

	it('should list stations', async () => {
		const stations = await client.Stations.list();
		expect(stations).toBeTruthy();
	});

	it('should fetch all stations by async iterator', async () => {
		let allStations = [];
		for await (const stations of client.Stations.list()) {
			allStations = allStations.concat(stations.data);
		}
		expect(allStations.length).toBe(2);

		expect(Array.isArray(allStations)).toBe(true);
		checkStationFields(allStations[0]);
	});

	it('should fetch stations pagination by promise, page 2', async () => {
		const stations = await client.Stations.list({ perPage: 1, page: 2 });
		expect(stations.data.length).toBe(1);
	});

	it('should fetch stations by promise, per page 1', async () => {
		const stations = await client.Stations.list({ perPage: 1 });
		expect(stations.data.length).toBe(1);
	});

	it('should fetch specific station', async () => {
		const station = await client.Stations.retrieve(1);

		expect(station).toBeTruthy();

		checkStationFields(station);
	});
});

function checkStationFields(station) {
	expect(station).toHaveProperty('id');
	expect(station).toHaveProperty('name');
	expect(station).toHaveProperty('createdAt');
	expect(station).toHaveProperty('updatedAt');
}
