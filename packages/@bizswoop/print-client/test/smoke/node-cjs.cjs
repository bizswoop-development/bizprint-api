// Runtime: Node.js (CommonJS), against the built dist via the package's own exports.
const assert = require('node:assert/strict');

const sdk = require('@bizswoop/print-client');
const PrintClientDirect = require('@bizswoop/print-client/PrintClient.js').default;
const NotFoundError = require('@bizswoop/print-client/errors/NotFoundError.js').default;
const Jobs = require('@bizswoop/print-client/resources/Jobs/index.js').default;
const { signGetData } = require('@bizswoop/print-client/sign/signGetData.js');

assert.equal(sdk.default, PrintClientDirect);
assert.equal(sdk.signGetData, signGetData);
assert.equal(typeof sdk.signPostData, 'function');

(async () => {
	const { runScenario } = await import('./scenario.mjs');
	await runScenario(
		{ PrintClient: sdk.default, Jobs, NotFoundError, signGetData: sdk.signGetData },
		'node-cjs',
	);
})().catch((error) => {
	console.error(error);
	process.exit(1);
});
