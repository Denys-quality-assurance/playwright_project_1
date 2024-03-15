/*
 * This module exports a `test` object which is used to create test cases.
 * It uses the shared context created by 'initializeBrowserSharedContextAndSetUpTest' from './baseWithSharedContext.mjs'
 *
 * The shared context ensures that all tests are running under the same preconditions.
 *
 */

import { initializeBrowserSharedContextAndSetUpTest } from './baseWithSharedContext.mjs';

const test = initializeBrowserSharedContextAndSetUpTest();

export default test;
