import { createSharedContextTest } from './baseWithSharedContext.mjs';

const contextOptions = {
  permissions: [`geolocation`], // Allow Google to track the geolocation
  ignoreHTTPSErrors: true,
};

const test = createSharedContextTest(contextOptions);

export default test;
