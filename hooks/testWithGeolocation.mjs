/*
 * This module exports a `test` object which is used to create test cases.
 * It uses the shared context created by 'createSharedContextTest' from './baseWithSharedContext.mjs'
 * with the context options.
 *
 * The context options defined here allow:
 * - Google to track geolocation even if no explicit permission
 *   has been granted for it.
 * - Ignore HTTPS errors. Any error messages resulting from HTTPS requests
 *   are ignored making it less verbose and suitable for production environment.
 *
 * The shared context ensures that all tests are running under the same preconditions
 * across all test cases using `contextOptions`.
 *
 */

import { createSharedContextTest } from './baseWithSharedContext.mjs';

const contextOptions = {
  permissions: [`geolocation`], // Allow Google to track the geolocation
  ignoreHTTPSErrors: true,
};

const test = createSharedContextTest(contextOptions);

export default test;
