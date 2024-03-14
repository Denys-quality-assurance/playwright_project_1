/*
 * This module exports a `test` object which is used to create test cases.
 * It uses the shared context created by 'createSharedContextTest' from './baseWithSharedContext.mjs'
 *
 * The shared context ensures that all tests are running under the same preconditions.
 *
 */

import { createSharedContextTest } from './baseWithSharedContext.mjs';

const test = createSharedContextTest();

export default test;
