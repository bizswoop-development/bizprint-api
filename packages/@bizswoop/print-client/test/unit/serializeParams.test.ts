import { describe, expect, it } from 'vitest';

import { serializeParams } from '#@/utilities/serializeParams.ts';

// Expected values are what axios 0.27 put on the wire (read back through URLSearchParams);
// the API parses nested filters as JSON strings.
const decoded = (params: Record<string, unknown>) => [
	...new URLSearchParams(serializeParams(params)),
];

describe('serializeParams', () => {
	it('keeps flat values as is', () => {
		expect(decoded({ perPage: 10, page: 3, status: 'done' })).toEqual([
			['perPage', '10'],
			['page', '3'],
			['status', 'done'],
		]);
	});

	it('sends nested filters as JSON', () => {
		expect(decoded({ id: { gte: 20 } })).toEqual([['id', '{"gte":20}']]);
		expect(decoded({ status: { in: ['done', 'failed'] } })).toEqual([
			['status', '{"in":["done","failed"]}'],
		]);
		expect(decoded({ stationId: { notIn: [1, 2] } })).toEqual([['stationId', '{"notIn":[1,2]}']]);
	});

	it('sends dates as ISO strings, also inside filters', () => {
		const date = new Date('2022-04-21T20:40:00.000Z');
		expect(decoded({ createdAt: date })).toEqual([['createdAt', '2022-04-21T20:40:00.000Z']]);
		expect(decoded({ createdAt: { gte: date } })).toEqual([
			['createdAt', '{"gte":"2022-04-21T20:40:00.000Z"}'],
		]);
	});

	it('repeats top-level arrays with a [] suffix', () => {
		expect(decoded({ status: ['done', 'failed'] })).toEqual([
			['status[]', 'done'],
			['status[]', 'failed'],
		]);
	});

	it('skips null and undefined and escapes special characters', () => {
		expect(serializeParams({ q: 'a b&c', n: null, u: undefined })).toBe('q=a+b%26c');
	});
});
