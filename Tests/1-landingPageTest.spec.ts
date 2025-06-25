import { test, expect } from '@playwright/test';
import baseEnvUrl from '../pages/environmentBaseUrl';
const url = baseEnvUrl.sd.sit;

test.beforeEach(async ({page}) => {
  //Initiate the Environment  
  await page.goto('about:blank');
  await page.goto(url);
  console.log('Environment is opened: ' + url);
});

test('Verify Landing Page', async ({ page }) => {
  await page.goto(url);
  
  // Expect a title "to contain" a substring.
  await expect(page.getByRole('img', { name: 'banner' })).toBeVisible();
  console.log('Verified Banner appeared');
  await expect(page.getByRole('link', { name: 'South Dakota Medicaid Home' })).toBeVisible();
  console.log('Verified URL Link: South Dakota Medicaid Home');
  await expect(page.getByRole('link', { name: 'SD Medicaid Provider' })).toBeVisible();
  console.log('Verified URL Link: SD Medicaid Provider');
  await expect(page.getByRole('link', { name: 'SD Administrative Rules' })).toBeVisible();
  console.log('Verified URL Link: SD Administrative Rules');
  await expect(page.getByRole('link', { name: 'SD Codified Laws' })).toBeVisible();
  console.log('Verified URL Link: SD Codified Laws');
  await expect(page.getByRole('link', { name: 'ListServ sign-up' })).toBeVisible();
  console.log('Verified URL Link: ListServ sign-up');
  await expect(page.getByRole('link', { name: 'SD Provider Communication' })).toBeVisible();
  console.log('Verified URL Link: SD Provider Communication');
  await expect(page.getByRole('link', { name: 'Provider Fee Schedules' })).toBeVisible();
  console.log('Verified URL Link: Provider Fee Schedules');
  await expect(page.getByRole('link', { name: 'Provider Billing Manuals' })).toBeVisible();
  console.log('Verified URL Link: Provider Billing Manuals');
  await expect(page.getByRole('link', { name: 'Medicaid Online Portal (Look-' })).toBeVisible();
  console.log('Verified URL Link: Medicaid Online Portal');
  await expect(page.getByRole('link', { name: 'SDMedicaidPE@state.sd.us' })).toBeVisible();
  console.log('Verified email Link: SDMedicaidPE@state.sd.us');
  await expect(page.getByText('DSS Home Page')).toBeVisible();
  await expect(page.getByText('SD.gov')).toBeVisible();
  await expect(page.getByText('Disclaimer')).toBeVisible();
  await expect(page.getByText('Accessibility')).toBeVisible();
  await expect(page.getByText('Privacy')).toBeVisible();
  await expect(page.getByText('HIPAA', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Contact Us' })).toBeVisible();
  console.log('Verified all Links on footer');
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Username *' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Password *' })).toBeVisible();
  console.log('Verified availability of Credentiling box');
});

test('Verify Provider Search', async ({ page }) => {
  await page.getByRole('link', { name: 'Provider Search' }).click();
  console.log('Clicked on the Provider Search link');
  
  // Expects page to have a heading with the name of Installation.
  await page.waitForTimeout(10000);
  await expect(page.locator('iframe[title="Provider Search"]').contentFrame().getByRole('banner')).toContainText('South Dakota Medicaid Provider Directory Home');
  console.log('Verified provider search is up')

  await expect(page.locator('iframe[title="Provider Search"]').contentFrame().locator('div').filter({ hasText: /^To navigate, press the arrow keys\.4$/ }).nth(1)).toBeVisible();
  console.log('Verified default location on the page');

  //Go back to Home
  await page.locator('iframe[title="Provider Search"]').contentFrame().getByRole('link', { name: 'Home' }).click();
  console.log('Clicked on the Home link');
  // Expects page to load and assert URL
  await expect (page).toHaveURL(new RegExp(url));
  console.log('Verified that the environment is rerouted back to the correct environment');
});
