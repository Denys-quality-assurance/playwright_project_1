/*
 * This module exports a constant object, acceptablePerformanceData, that represents a set
 * of boundaries for the performance characteristics of a system under testing.
 *
 * The main purpose of maintaining this separate config is to keep track of acceptable
 * performance metrics which can be updated in a centralized place according to
 * changing performance standards or system modifications.
 * Moreover, these define the 'pass/fail' criteria for performance tests.
 *
 * It currently only contains a property for search duration,
 * but it is a placeholder for additional performance characteristics as the testing demands evolve.
 *
 * Other acceptable values of performance characteristics you might include are:
 * - "acceptablePageLoadDuration": Maximum time allowed for a page to fully load.
 * - "acceptableResponseTime": Maximum time allowed for the system to respond to a specific query.
 * - "acceptableFirstPaint": Maximum time allowed until the browser renders the first pixels of the page.
 *
 */

const acceptablePerformanceData = {
  acceptableSearchDutation: 5000, // Search results must be available to the user no later than this limit (ms)
};

export default acceptablePerformanceData;
