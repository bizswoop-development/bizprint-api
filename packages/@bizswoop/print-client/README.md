# @bizswoop/print-client

TypeScript SDK for the BizPrint Print Backend API.

- Written in TypeScript, ships ESM + CommonJS + type declarations
- Runs on **Node.js ≥ 20.19**
- Single dependency: [`axios`](https://github.com/axios/axios)

Every request is signed with a SHA-256 hash made from your secret key. Use the client **server-side only**.

## Install

```sh
npm install @bizswoop/print-client
```

## Quick start

To get your `publicKey` and `secretKey`, see the [quick start guide](https://getbizprint.com/quick-start-guide/#step-4).

```ts
import PrintClient from '@bizswoop/print-client';

// or: const PrintClient = require('@bizswoop/print-client').default;

const client = new PrintClient({
	publicKey: process.env.BIZPRINT_PUBLIC_KEY!,
	secretKey: process.env.BIZPRINT_SECRET_KEY!,
});

const job = await client.Jobs.create({
	printerId: 1,
	description: 'Order #1001',
	url: 'https://shop.example/order/1001',
});

console.log(job.id, job.status);
```

## Imports

The root export has the client (default export), `signGetData` and `signPostData`. Every source file can also be imported directly by its path (with `.js`).

| File                                                 | Contents                                                                                                         |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `@bizswoop/print-client/PrintClient.js`              | `PrintClient` (default export)                                                                                   |
| `@bizswoop/print-client/errors/*.js`                 | Common error classes, one per file (default export)                                                              |
| `@bizswoop/print-client/resources/Jobs/index.js`     | `Jobs` (default export); types in `Job.js`, `JobCreateData.js`, `JobsListOptions.js`; error classes in `errors/` |
| `@bizswoop/print-client/resources/Printers/index.js` | `Printers` (default export); types in `Printer.js`, `PrintersListOptions.js`; error classes in `errors/`         |
| `@bizswoop/print-client/resources/Stations/index.js` | `Stations` (default export); types in `Station.js`, `StationsListOptions.js`; error classes in `errors/`         |
| `@bizswoop/print-client/sign/signGetData.js`         | `signGetData`, `hashGetData`, `validateGetData`                                                                  |
| `@bizswoop/print-client/sign/signPostData.js`        | `signPostData`, `hashPostData`, `validatePostData`                                                               |

```ts
import PrintClient, { signGetData } from '@bizswoop/print-client';
import NotFoundError from '@bizswoop/print-client/errors/NotFoundError.js';
import type { Job } from '@bizswoop/print-client/resources/Jobs/Job.js';
import type { JobCreateData } from '@bizswoop/print-client/resources/Jobs/JobCreateData.js';
```

All paths resolve to the same classes, so `instanceof` works whichever one you import from.

## Client options

| Option      | Default                                                    | Description                                                 |
| ----------- | ---------------------------------------------------------- | ----------------------------------------------------------- |
| `publicKey` | required                                                   | Public key, sent with every request.                        |
| `secretKey` | required                                                   | Secret key; signs the request and never leaves the server.  |
| `baseUrl`   | `'https://print.bizswoop.app/api/connect-application/v1/'` | API base URL; must end with `/api/connect-application/v1/`. |

## Responses

Every result is the returned object plus a `response` property with the raw response info:

```ts
const station = await client.Stations.retrieve(1);

station.id;
station.response.statusCode; // 200
station.response.headers;
```

## Lists

Every `list(options?)` takes `perPage` and `page`, plus the filters of the resource. It can be awaited to get one page:

```ts
const page = await client.Jobs.list({ perPage: 10, page: 3 });

page.data; // Job[]
page.hasMore;
page.totalAll;
page.totalPages;
```

or iterated to go through all pages:

```ts
const jobs = [];
for await (const page of client.Jobs.list({ perPage: 50 })) {
	jobs.push(...page.data);
}
```

## Jobs

### `create(data)`

```ts
const job = await client.Jobs.create({
	printerId: 1,
	description: 'Order #1001',
	url: 'https://shop.example/order/1001',
	// optional
	printOption: {
		version: '1.0',
		print: { copies: { copies: 2 } },
	},
});
```

`printOption` is a JSON object. The API stores it and passes it as is to the BizPrint station app, which reads it when printing. With `version: '1.0'` the app uses these fields of `print` (all optional):

```ts
printOption: {
	version: '1.0',
	print: {
		copies: { copies: 2 }, // default 1
		margins: { top_microns: 5000, right_microns: 5000, bottom_microns: 5000, left_microns: 5000 }, // default: no margins
		media_size: { width_microns: 80000, height_microns: 200000 }, // or a page size name, e.g. 'A4'
	},
}
```

Sizes are in microns (1 mm = 1000 microns).

Returns a `Job`:

```ts
type Job = {
	id: number;
	description: string;
	status: 'pending' | 'processing' | 'done' | 'failed' | 'connecting-to-printer' | 'archived';
	url: string;
	printerId: number;
	createdAt: string;
	updatedAt: string;
};
```

Throws `JobCreatingInvalidRequestError` if parameters are missing or invalid, `JobCreatingPrintJobLimitError` if the print job limit is exceeded, `JobCreatingInvalidPrinterError` if the printer does not exist or you do not have access to it.

### `retrieve(id)`

```ts
const job = await client.Jobs.retrieve(1);
```

Throws `NotFoundError` if the job does not exist, `AccessForbiddenError` if you do not have access to it.

### `list(options?)`

```ts
await client.Jobs.list({ status: 'pending' });
await client.Jobs.list({ status: { in: ['pending', 'processing'] } });
await client.Jobs.list({ status: { notIn: 'archived' } });
await client.Jobs.list({ createdAt: { gte: new Date('2026-01-01') } }); // Date or string
await client.Jobs.list({ id: { gte: 100 } });
```

One filter per call, with `perPage` and `page`. Throws `JobsListInvalidRequestError` for wrong parameters.

## Printers

```ts
const printer = await client.Printers.retrieve(1);
console.log(printer.name, printer.status, printer.station.name);

await client.Printers.list({ status: 'online' }); // 'online' | 'offline' | 'all'
await client.Printers.list({ stationId: { in: [1, 2] } }); // an ID, { in } or { notIn }
await client.Printers.list({ createdAt: { gte: '2026-01-01' } });
await client.Printers.list({ id: { gte: 100 } });
```

A `Printer`:

```ts
type Printer = {
	id: number;
	name: string;
	key: string;
	status: 'online' | 'offline';
	station: { id: number; name: string };
	createdAt: string;
	updatedAt: string;
};
```

One filter per call, with `perPage` and `page`. `list` throws `PrintersListInvalidRequestError` for wrong parameters.

## Stations

```ts
const station = await client.Stations.retrieve(1);
console.log(station.id, station.name, station.createdAt, station.updatedAt);

await client.Stations.list({ createdAt: { gte: '2026-01-01' } });
await client.Stations.list({ id: { gte: 100 } });
```

One filter per call, with `perPage` and `page`. `list` throws `StationsListInvalidRequestError` for wrong parameters.

## Errors

Errors are mapped from the `errorCode` of the error body. Each class is the default export of its own file and has `name` and `kind` properties.

| Class                             | File                             | When                                                         |
| --------------------------------- | -------------------------------- | ------------------------------------------------------------ |
| `UnauthorizedError`               | `errors/UnauthorizedError.js`    | `ERR_UNAUTHORIZED`: invalid keys or signature                |
| `AccessForbiddenError`            | `errors/AccessForbiddenError.js` | `ERR_ACCESS_FORBIDDEN`: no access to the resource            |
| `NotFoundError`                   | `errors/NotFoundError.js`        | `ERR_NOT_FOUND`: the resource does not exist                 |
| `SomethingWrongError`             | `errors/SomethingWrongError.js`  | `ERR_SOMETHING_WRONG`: the API failed to handle a request    |
| `JobCreatingInvalidRequestError`  | `resources/Jobs/errors/…`        | `ERR_INVALID_REQUEST` in `Jobs.create`                       |
| `JobCreatingPrintJobLimitError`   | `resources/Jobs/errors/…`        | `ERR_JOB_CREATING_PRINT_JOB_LIMIT`: print job limit exceeded |
| `JobCreatingInvalidPrinterError`  | `resources/Jobs/errors/…`        | `ERR_JOB_CREATING_INVALID_PRINTER_ID`                        |
| `JobsListInvalidRequestError`     | `resources/Jobs/errors/…`        | `ERR_INVALID_REQUEST` in `Jobs.list`                         |
| `PrintersListInvalidRequestError` | `resources/Printers/errors/…`    | `ERR_INVALID_REQUEST` in `Printers.list`                     |
| `StationsListInvalidRequestError` | `resources/Stations/errors/…`    | `ERR_INVALID_REQUEST` in `Stations.list`                     |

The `…InvalidRequestError` classes extend `InvalidRequestError` (`errors/InvalidRequestError.js`) and have `errors`: an object with a list of messages per field.

Anything else (network failure, unknown error body) is thrown as the original axios error.

```ts
import AccessForbiddenError from '@bizswoop/print-client/errors/AccessForbiddenError.js';
import { InvalidRequestError } from '@bizswoop/print-client/errors/InvalidRequestError.js';
import NotFoundError from '@bizswoop/print-client/errors/NotFoundError.js';

try {
	await client.Jobs.create({ printerId: 1, description: 'Order #1001', url });
} catch (error) {
	if (error instanceof InvalidRequestError) {
		console.log(error.message, error.errors); // { url: ['...'] }
	} else if (error instanceof NotFoundError || error instanceof AccessForbiddenError) {
		console.log(error.message);
	} else {
		throw error;
	}
}
```

## Signing requests

The client signs requests for you. To sign a plain [HTTP API](https://github.com/bizswoop-development/bizprint-api/blob/master/docs/HTTP.md) request yourself:

```ts
import { signGetData, signPostData } from '@bizswoop/print-client';

// GET, DELETE: URLSearchParams with publicKey, time and hash added
const query = signGetData('perPage=10&page=1', publicKey, secretKey);
await fetch(`${baseUrl}jobs?${query}`);

// POST, PUT, PATCH: the payload with publicKey, time and hash added
const body = signPostData({ printerId: 1, description, url }, publicKey, secretKey);
```

`time` is the current Unix timestamp in seconds. `hash` is the SHA-256 hex digest of `<query string>:<secretKey>` for query arguments, or `<JSON body>:<secretKey>` for a payload.

To check a signature use `validateGetData(query, secretKey)` and `validatePostData(body, secretKey)` from `sign/signGetData.js` and `sign/signPostData.js`.

To sign or validate requests from a terminal, use [`@bizswoop/print-sign-request-cli`](https://www.npmjs.com/package/@bizswoop/print-sign-request-cli).

## HTTP API

To call the API without this SDK, see the [HTTP API docs](https://github.com/bizswoop-development/bizprint-api/blob/master/docs/HTTP.md).

## Development

```sh
npm run typecheck
npm test              # all tests (vitest)
npm run test:unit     # unit tests only
npm run test:smoke    # builds, then runs the dist against a mock server in Node.js ESM and CJS
npm run lint          # oxlint
npm run format        # oxfmt
npm run build
```

## License

[MIT](./LICENSE)
