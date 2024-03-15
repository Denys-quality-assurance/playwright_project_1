/*
 * This module exports a `test` object which is used to create test cases.
 * It uses the shared context created by 'initSharedContext' from './baseWithSharedContext.mjs'
 *
 * The shared context ensures that all tests are running under the same preconditions.
 *
 */

import { initSharedContext } from './baseWithSharedContext.mjs';

const test = initSharedContext();

export default test;
