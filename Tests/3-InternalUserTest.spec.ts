import { test, expect } from '@playwright/test';
import baseEnvUrl from '../pages/environmentBaseUrl';
import credentials from '../pages/credentials';

const url = baseEnvUrl.sd.sit;

test.beforeEach(async ({page}) => {
  //Initiate the Environment  
  await page.goto('about:blank');
  await page.goto(url);
  console.log('Environment is opened: ' + url);
});

test('Verify Internal user availability', async ({ page }) => {
  console.log('Entering credentials in the Login box')
  await page.getByRole('textbox', { name: 'Username *' }).click();
  await page.getByRole('textbox', { name: 'Username *' }).fill(credentials.testInternalUser.username);
  console.log('Entered username: ' + credentials.testInternalUser.username);
  await page.getByRole('textbox', { name: 'Password *' }).click();
  await page.getByRole('textbox', { name: 'Password *' }).fill(credentials.testInternalUser.userPassword);
  console.log('Entered username: ' + credentials.testInternalUser.userPassword);
  await page.getByRole('button', { name: 'Login' }).click();
  console.log('Clicked on the Login button')
  await expect(page.getByText('You are about to enter a secure site.For authorized use onlyThis system')).toBeVisible();
  console.log("Verify the Affirmation Page");
  await page.getByRole('button', { name: 'Agree', exact: true }).click();
  console.log("Click the Agree button");

  //Verification of Dashboard and Headers
  await expect(page.getByRole('tab', { name: 'All Requests' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Enrollments' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Reconsideration' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'COC' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Site Visit' })).toBeVisible();
  console.log('Verified dashboard table tabs available');
  await expect(page.getByRole('link', { name: 'Providers' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Enrollment' })).toBeVisible();
  await expect(page.getByRole('listitem').filter({ hasText: 'CoC' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Audit' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Reports' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Site visits' })).toBeVisible();
  await expect(page.getByText('Help center')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Documents' })).toBeVisible();
  console.log('Verified all Header tabs available');

  //Verification of Providers Module availability
  await page.getByRole('link', { name: 'Providers' }).click();
  console.log('Click on the Provider Tab');
  await page.getByRole('button', { name: 'Search' }).click();
  console.log('Click on the Search button');
  await expect(page.getByRole('heading', { name: 'Search results' })).toBeVisible();
  console.log('Verified that we are receiving search results');

  //Verification of Enrollments Module availability
  await page.getByRole('link', { name: 'Enrollment' }).click();
  console.log('Click on the Enrollment Tab');
  await page.getByRole('button', { name: 'Search' }).click();
  console.log('Click on the Search button');
  await expect(page.getByRole('heading', { name: 'Search results' })).toBeVisible();
  console.log('Verified that we are receiving search results');

  //Verification of CoC Module availability
  await page.getByRole('link', { name: 'CoC' }).click();
  console.log('Click on the CoC Tab');
  await page.getByRole('button', { name: 'Search' }).click();
  console.log('Click on the Search button');
  await expect(page.getByRole('heading', { name: 'Search results' })).toBeVisible();
  console.log('Verified that we are receiving search results');
  await page.getByRole('button', { name: 'ADD I-COC' }).click();
  console.log('Click on the I-CoC button');
  await expect(page.getByRole('heading', { name: 'Change of Circumstances Close' })).toBeVisible();
  console.log('Verify the I-CoC pop-up is displayed');
  await page.getByRole('button', { name: 'Search' }).click();
  console.log('Click on the Search button');
  await expect(page.getByRole('heading', { name: 'Search Results' })).toBeVisible();
  console.log('Verified that we are receiving search results');
  await page.getByRole('button', { name: 'Close' }).click();
  console.log('Closed the I-CoC pop-up box');

  //Verification of Reconsideration Module availability
  await page.getByRole('link', { name: 'Reconsideration' }).click();
  console.log('Click on the Reconsideration Tab');
  await page.getByRole('button', { name: 'Search' }).click();
  console.log('Click on the Search button');
  await expect(page.getByRole('heading', { name: 'Search results' })).toBeVisible();
  console.log('Verified that we are receiving search results');

  //Verification of Audit Module availability
  await page.getByRole('link', { name: 'Audit' }).click();
  console.log('Click on the Audit Tab');
  await page.getByRole('button', { name: 'Search' }).click();
  console.log('Click on the Search button');
  await expect(page.getByRole('heading', { name: 'Search results' })).toBeVisible();
  console.log('Verified that we are receiving search results');

  //Verification of Reports Module availability
  await page.getByRole('link', { name: 'Reports' }).click();
  console.log('Click on the Reports Tab');
  await page.getByRole('button', { name: 'Expand More' }).click();
  console.log('Opened the Search menu');
  await page.getByRole('textbox', { name: 'Report Name' }).click();
  await page.getByRole('textbox', { name: 'Report Name' }).fill('Provider Insight');
  console.log('Enter the value in the Report Name field: Provider Insight');
  await page.getByRole('button', { name: 'Search' }).click();
  console.log('Click on the Search button');
  await page.getByText('Provider Insight').first().click();
  await expect(page.locator('#iframe').contentFrame().getByRole('heading', { name: 'Provider Insights' }).first()).toBeVisible({timeout: 10_000});
  console.log('Verified that the report is displayed');
  
  //Verification of Site Visit Module availability
  await page.getByRole('link', { name: 'Site visits' }).click();
  console.log('Click on the Site Visits Tab');
  await page.getByRole('button', { name: 'Search' }).click();
  console.log('Click on the Search button');
  await expect(page.getByRole('heading', { name: 'Search results' })).toBeVisible();
  console.log('Verified that we are receiving search results');

  //Verification of Documents Module availability
  await page.getByRole('link', { name: 'Documents' }).click();
  console.log('Click on the Documents Tab');
  await expect(page.locator('iframe[title="C-SDN"]').contentFrame().getByRole('textbox', { name: 'advanced' })).toBeVisible();
  await expect(page.locator('iframe[title="C-SDN"]').contentFrame().locator('.jss357').first()).toBeVisible();
  console.log('Verified that the CSDN is up and running');

  //Verification of Help Center Module availability
  const page1Promise = page.waitForEvent('popup');
  await page.getByText('Help center').click();
  console.log('Click on the Help Center Tab');
  const page1 = await page1Promise;
  console.log('New window is opened with DSS redirect');
  await expect (page1).toHaveURL('https://dss.sd.gov/medicaid/providers/enrollment/enrollment.aspx');
  console.log('Verified that the DSS link is correct, for the redirect');
  await page1.close();
  console.log('Closing the new window');

  //Log-out procedure
  console.log('Logging out as the Internal User');
  await page.getByRole('button', { name: 'Farhan Khan Provider' }).click();
  console.log('Click on the name (at the top right-hand side of DyP');
  await page.getByText('Log out').click();
  console.log('Click on Log out');
  await expect(page.getByText('Discover Your ProviderInfo')).toBeVisible();
  await expect (page).toHaveURL(url + 'landing',{timeout: 10_000});
  console.log('Verified user is logged out');
});
