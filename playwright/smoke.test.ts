import { test, expect } from '@playwright/test';

test.setTimeout(35e3);

// test('go to /', async ({ page }) => {
//   await page.goto('/');

//   await page.waitForSelector(`text=Starter`);
// });

test('send a message', async ({ page, browser }) => {
  const message = `Playwright-Jest test message - ${Math.random()}`;

  await page.goto('/');
  page.locator(`#messageText`);
  await page.fill(`input[type=text]`, message);
  await page
    .locator(`button[type=button]>div>span`, { hasText: 'Send' })
    .click();
  await page.waitForLoadState('networkidle');

  // Testing optimistic update
  expect(await page.content()).toContain(message);

  // Testing saving to database
  // const ssrContext = await browser.newContext({
  //   javaScriptEnabled: false,
  // });
  // const ssrPage = await ssrContext.newPage();
  // await ssrPage.goto('/');

  // expect(await ssrPage.content()).toContain(message);
});

// test('server-side rendering test', async ({ page, browser }) => {
//   // add a post
//   const nonce = `${Math.random()}`;

//   await page.goto('/');
//   await page.fill(`[name=title]`, nonce);
//   await page.fill(`[name=text]`, nonce);
//   await page.click(`form [type=submit]`);
//   await page.waitForLoadState('networkidle');

//   // load the page without js
//   const ssrContext = await browser.newContext({
//     javaScriptEnabled: false,
//   });
//   const ssrPage = await ssrContext.newPage();
//   await ssrPage.goto('/');
//   expect(await ssrPage.content()).toContain(nonce);
// });
