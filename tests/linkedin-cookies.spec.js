import { test, expect } from '@playwright/test';
const { loginToLinkedIn, getCookies } = require('../helpers/playwrightHelpers');

test('Check cookies content after login to LinkedIn', async ({ page }) => {
  await loginToLinkedIn(page);
  // Cookies after login to LinkedIn
  const cookiesAfterLogin = await getCookies(page);
  //li_at Cookie is used to authenticate Members and API clients
  const isLi_atCookieExists = cookiesAfterLogin.some((cookie) => cookie.name === 'li_at');
  //liap Cookie is used by non-www.domains to denote the logged in status of a member
  const isLiapCookieExists = cookiesAfterLogin.some((cookie) => cookie.name === 'liap');
  const liapCookie = cookiesAfterLogin.find((cookie) => cookie.name === 'liap');
  //timezone Cookie is used to determine user's timezone
  const isTimezoneCookieExists = cookiesAfterLogin.some((cookie) => cookie.name === 'timezone');
  //li_theme Cookie remembers a user's display preference theme setting
  const isLi_themeCookieExists = cookiesAfterLogin.some((cookie) => cookie.name === 'li_theme');
  const li_themeCookie = cookiesAfterLogin.find((cookie) => cookie.name === 'li_theme');

  // Check if cookies include 'li_at' after login to LinkedIn
  expect(isLi_atCookieExists).toBe(true, "Cookies don't include 'li_at' after login to LinkedIn");

  // Check if cookies include 'liap' after login to LinkedIn
  expect(isLiapCookieExists).toBe(true, "Cookies don't include 'liap' after login to LinkedIn");
  // Check if value of 'liap' cookie is 'true' after login to LinkedIn
  expect(liapCookie.value).toBe('true', "Value of 'liap' cookie is not 'true'");

  // Check if cookies include 'timezone' after login to LinkedIn
  expect(isTimezoneCookieExists).toBe(true, "Cookies don't include 'timezone' after login to LinkedIn");

  // Check if cookies include 'li_theme' after login to LinkedIn
  expect(isLi_themeCookieExists).toBe(true, "Cookies don't include 'li_theme' after login to LinkedIn");
  // Check if value of 'li_theme' cookie is 'light' after login to LinkedIn
  expect(li_themeCookie.value).toBe('light', "Value of 'li_theme' cookie is not 'light'");
});
