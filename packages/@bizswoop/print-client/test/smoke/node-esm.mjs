// Runtime: Node.js (ESM), against the built dist via the package's own exports.
import { strict as assert } from 'node:assert';

import PrintClient, { signGetData, signPostData } from '@bizswoop/print-client';
import NotFoundError from '@bizswoop/print-client/errors/NotFoundError.js';
import PrintClientDirect from '@bizswoop/print-client/PrintClient.js';
import Jobs from '@bizswoop/print-client/resources/Jobs/index.js';
import { signGetData as signGetDataDirect } from '@bizswoop/print-client/sign/signGetData.js';

import { runScenario } from './scenario.mjs';

assert.equal(PrintClient, PrintClientDirect);
assert.equal(signGetData, signGetDataDirect);
assert.equal(typeof signPostData, 'function');

await runScenario({ PrintClient, Jobs, NotFoundError, signGetData }, 'node-esm');
