import PrintersListInvalidRequestError from '@/resources/Printers/PrintersListInvalidRequestError';

import PrintClient from '@/PrintClient';

describe('Printers', () => {
	const client = new PrintClient({
		publicKey: 'c321430d35c6d425799db9f85a11d50b',
		secretKey: '321430d35c6d425799db9f85a11d50b0',
		baseUrl: 'http://localhost:8000/api/connect-application/v1/'
	});
	it('should create an instance', () => {
		expect(client.Printers).toBeTruthy();
	});

	it('should list printers', async () => {
		const printers = await client.Printers.list();
		expect(printers).toBeTruthy();
	});

	it('should fetch all printers by async iterator', async () => {
		let allPrinters = [];
		for await (const printers of client.Printers.list()) {
			allPrinters = allPrinters.concat(printers.data);
		}
		expect(allPrinters.length).toBe(14);

		expect(Array.isArray(allPrinters)).toBe(true);

		const printer = allPrinters[0];
		checkPrinterFields(printer);
	});

	it('should fetch online printers', async () => {
		let allPrinters = [];
		for await (const printers of client.Printers.list({ status: 'online' })) {
			allPrinters = allPrinters.concat(printers.data);
		}

		expect(allPrinters.length).toBe(12);
	});

	it('should fetch offline printers', async () => {
		let allPrinters = [];
		for await (const printers of client.Printers.list({ status: 'offline' })) {
			allPrinters = allPrinters.concat(printers.data);
		}

		expect(allPrinters.length).toBe(2);
	});

	it('should fetch printers, station id', async () => {
		let allPrinters = [];
		for await (const printers of client.Printers.list({ stationId: 1 })) {
			allPrinters = allPrinters.concat(printers.data);
		}

		expect(allPrinters.length).toBe(13);
	});

	it('should fetch printers, station id by in', async () => {
		let allPrinters = [];
		for await (const printers of client.Printers.list({ stationId: { in: 1 } })) {
			allPrinters = allPrinters.concat(printers.data);
		}

		expect(allPrinters.length).toBe(13);
	});

	it('should fetch printers, station id by in array', async () => {
		let allPrinters = [];
		for await (const printers of client.Printers.list({ stationId: { in: [1, 2] } })) {
			allPrinters = allPrinters.concat(printers.data);
		}

		expect(allPrinters.length).toBe(14);
	});

	it('should fetch printers, station id by notIn', async () => {
		let allPrinters = [];
		for await (const printers of client.Printers.list({ stationId: { notIn: 1 } })) {
			allPrinters = allPrinters.concat(printers.data);
		}

		expect(allPrinters.length).toBe(1);
	});

	it('should fetch printers, station id by notIn array', async () => {
		let allPrinters = [];
		for await (const printers of client.Printers.list({ stationId: { notIn: [1] } })) {
			allPrinters = allPrinters.concat(printers.data);
		}

		expect(allPrinters.length).toBe(1);
	});

	it('should fetch printers, station id by in and notIn at the same time', async () => {
		try {
			let allPrinters = [];
			// @ts-ignore
			for await (const printers of client.Printers.list({ stationId: { in: [2], notIn: [1] } })) {
				allPrinters = allPrinters.concat(printers.data);
			}
		} catch (error) {
			expect(error).toBeInstanceOf(PrintersListInvalidRequestError);
			expect(error.name).toBe('PrintersListInvalidRequestError');
			expect(error.errors).toHaveProperty('stationId');
			expect(error.errors.stationId).toContain('You can\'t use "in" and "notIn" at the same time');
		}
	});

	it('should fetch printers pagination by promise, page 2', async () => {
		const printers = await client.Printers.list({ perPage: 10, page: 2 });
		expect(printers.data.length).toBe(4);
	});

	it('should fetch printers by promise, per page 5', async () => {
		const printers = await client.Printers.list({ perPage: 5 });
		expect(printers.data.length).toBe(5);
	});

	it('should fetch all printers filtering, created at string', async () => {
		let allPrinters = [];
		for await (let printers of client.Printers.list({
			createdAt: { gte: '2022-05-10T17:23:12.000Z' }
		})) {
			allPrinters = allPrinters.concat(printers.data);
		}

		expect(allPrinters.length).toBe(9);
	});

	it('should fetch all printers filtering, created at date', async () => {
		let allPrinters = [];
		for await (let printers of client.Printers.list({
			createdAt: { gte: new Date('2022-05-10T17:23:12.000Z') }
		})) {
			allPrinters = allPrinters.concat(printers.data);
		}

		expect(allPrinters.length).toBe(9);
	});

	it('should fetch specific printer', async () => {
		const printer = await client.Printers.retrieve(1);

		expect(printer).toBeTruthy();

		checkPrinterFields(printer);
	});
});

function checkPrinterFields(printer) {
	expect(printer).toHaveProperty('id');
	expect(printer).toHaveProperty('status');
	expect(printer).toHaveProperty('name');
	expect(printer).toHaveProperty('key');
	expect(printer).toHaveProperty('station');
	expect(printer.station).toHaveProperty('id');
	expect(printer.station).toHaveProperty('name');
	expect(printer).toHaveProperty('createdAt');
	expect(printer).toHaveProperty('updatedAt');
}
