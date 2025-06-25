import { getNPIValue } from '../test_file/npiData/readcsv';
import baseEnvUrl from '../pages/environmentBaseUrl';
import credentials from '../pages/credentials';
import dataGenerator from '../pages/dataGenerator';
import { test, expect, type Page} from '@playwright/test';
import { text } from 'stream/consumers';
import Stream from 'stream';
import { Console } from 'console';

//Data
const url = baseEnvUrl.sd.sit;
const email = credentials.sdGmail.userEmail+dataGenerator.commonData.providerEmail;
const npi = getNPIValue();
const screenshotLocation = './screenshot/' + new Date().toJSON().replace(/:/g,'-') + '/screenshot'+ 
                            new Date().toJSON().slice(0,10).replace(':',  '-') + '.png';
const servicingProvider = 'Yes';
const billingProvider = 'No';
const max = 20; 
const min = 0;

test.beforeAll(async () => {
  console.log('NPI Value that is going to be used: ' + npi);
  console.log('Provider Email set: ' + email);
  console.log('********************************************************************** \n');
});

test.beforeEach(async ({page}) => {
  //Initiate the Environment  
  await page.goto('about:blank');
  await page.goto(url);
  console.log('Environment is opened: ' + url);
});

//Test Script
test('Register a new Provider', async ({ page }) => {

    //Initiate the Registration Process
    console.log('Starting the Registration Process');
    await page.getByRole('link', { name: 'Create Account' }).click();
    console.log('Clicked on: Create Account');
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();
    console.log('Verified Registration Form is Opened');
    await page.getByLabel('Email Address *').click();
    await page.getByLabel('Email Address *').fill(email);
    console.log('Entered Provider Email: '+ email);
    await page.getByLabel('Password *').click();
    await page.getByLabel('Password *').fill(dataGenerator.commonData.Password);
    console.log('Entered Password: '+dataGenerator.commonData.Password);
    await page.getByLabel('Password *').click();
    await page.getByRole('button', { name: 'CONTINUE' }).click();
    console.log('Clicked Continue');
    await page.getByLabel('Organization name *').click();
    await page.getByLabel('Organization name *').fill('Automation Test Organization');
    console.log('Entered Organization Name: Automation Test Organization');
    await page.getByLabel('Organization description (').click();
    await page.getByLabel('Organization description (').fill('Automation Test');
    console.log('Entered Organization description: Automation Test');
    await page.getByRole('button', { name: 'CONTINUE' }).click();
    console.log('Clicked Continue');
    await page.getByLabel('First name *').click();
    await page.getByLabel('First name *').fill(dataGenerator.commonData.firstName);
    console.log('Entered First Name: '+ dataGenerator.commonData.firstName);
    await page.getByLabel('Last name *').click();
    await page.getByLabel('Last name *').fill(dataGenerator.commonData.lastName);
    console.log('Entered Last Name: '+ dataGenerator.commonData.lastName);
    await page.getByPlaceholder('(___)___-____').click();
    await page.getByPlaceholder('(___)___-____').fill(dataGenerator.commonData.phoneNumber);
    console.log('Entered Phone Number: '+ dataGenerator.commonData.phoneNumber);
    await page.getByRole('button', { name: 'CREATE ACCOUNT' }).click();
    console.log('Clicked Create Account Button');
    await expect(page.getByText('CONFIRM ACCOUNTOne more step')).toBeVisible();
    console.log('Verified Registration Form is Submitted');
    await page.screenshot({path: screenshotLocation, fullPage: true });
}),
  test('Confirm Email Address', async ({ page }) => {
  //Gmail access
    await page.goto('https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&emr=1& followup=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&ifkv=AdF4I76yWLMbkYNuQ0lKrkahopjrPHZsKOvd0xJE7SD1ovhDDMlunVb_6epHiUwZyZY-hpFy00rm&osid=1& passive=1209600&service=mail&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S-1255754266%3A1723051469181227&ddm=0');
    console.log("Going to Gmail, to confirm the Email")
    await page.getByLabel('Email or phone').fill(credentials.sdGmail.userEmail);
    console.log("Enter the Email Address");
    await page.getByLabel('Email or phone').press('Enter');
    await page.getByLabel('Enter your password').fill(credentials.sdGmail.userPassword);
    console.log("Enter the Password ");
    await page.getByLabel('Enter your password').press('Enter');
    await page.getByPlaceholder('Search mail').click();
    await page.getByPlaceholder('Search mail').fill('in:anywhere to:(' + email + ')');
    console.log("Search for the email address: " + email);
    await page.getByPlaceholder('Search mail').press('Enter');
    console.log("Seaching for Emails for Provider");
    await page.getByRole('link', { name: 'Inbox Registration - Provider' }).click();
    await page.screenshot({path: screenshotLocation, fullPage: true });
    console.log("Find the Email for confirming the Registration and click on the email ");
    const page1Promise = page.waitForEvent('popup');
    console.log("Click the Confirm Account button, in the email ");
    await page.getByRole('link', { name: 'Confirm Account' }).click();
    const page1 = await page1Promise;
    await expect(page1.getByText('Your registration has been')).toBeVisible();
    console.log("Redirect to DyP, and verify that that the confirmation is completed.");
    await page.screenshot({path: screenshotLocation, fullPage: true });
    await page1.getByRole('link', { name: 'Back to log in' }).click();
    await expect(page1.getByRole('heading', { name: 'Login' })).toBeVisible();
    console.log("Verify user is back on DyP Landing Page.");
  }),
  
  test('Verify Enrollment application availability', async ({ page }) => {
    //Log-in the Provider Portal and Start Individual Enrollment. 
    test.setTimeout(300000);
    await page.getByLabel('Username *').click();
    await page.getByLabel('Username *').fill(/*'sd.test.provider+9105548@gmail.com'*/email);
    console.log("Enter the email address: " + email);
    await page.getByLabel('Password *').click();
    await page.getByLabel('Password *').fill(dataGenerator.commonData.Password);
    console.log("Enter the Password: " + dataGenerator.commonData.Password);
    await page.getByRole('button', { name: 'Login' }).click();
    console.log("Click the Log-in button");
    await expect(page.getByText('You are about to enter a secure site.For authorized use onlyThis system')).toBeVisible();
    console.log("Verify the Affirmation Page");
    await page.getByRole('button', { name: 'Agree', exact: true }).click();
    console.log("Click the Agree button");
    //    await page.getByPlaceholder('__________').click();
    //    await page.getByPlaceholder('__________').fill(npi);
    //    await page.screenshot({path: screenshotLocation, fullPage: true });
    //    await page.getByRole('button', { name: 'Submit' }).click();
    //    await expect(page.getByText('Post Login Field added')).toBeVisible();
    //    await page.getByRole('button', { name: 'OK' }).click();
    await page.getByRole('heading', { name: 'Individual Enrollment' }).click();

  //Complete Identifying Information Section of the Application  
    console.log('\n************ On Idenfiying Information Section ************');
    await page.getByLabel('Will you receive payment').getByLabel(servicingProvider).check();
    await page.getByLabel('Will you receive payment').getByLabel('Yes').press('Tab');
    console.log('Selected' + servicingProvider + ' for Will you receive Payments');
    await page.locator('div').filter({ hasText: /^Select Requested Enrollment Date \*$/ }).getByPlaceholder('MM/DD/YYYY').click();
    await page.locator('div').filter({ hasText: /^Select Requested Enrollment Date \*$/ }).getByPlaceholder('MM/DD/YYYY').fill(dataGenerator.
    commonData.todaysDate);
    console.log('Entered Requested Enrollment date as: ' + dataGenerator.commonData.todaysDate);
    await page.getByRole('textbox', { name: 'Reason Code' }).click();
    await page.getByRole('textbox', { name: 'Reason Code' }).fill('Currently');
    await page.getByText('Eligible').click();
    console.log('Selected Reason Code for Enrollment');
    await page.getByRole('textbox', { name: 'Title' }).click();
    await page.getByRole('menuitem', { name: 'Mr.' }).click();
    console.log('Entered Title as Mr');
    await page.getByLabel('Degree').click();
    await page.getByLabel('Degree').fill('MD');
    console.log('Entered Degree as MD');
    await page.getByLabel('First Name', { exact: true }).click();
    await page.getByLabel('First Name', { exact: true }).fill(dataGenerator.commonData.firstName);
    console.log('Entered First Name: ' + dataGenerator.commonData.firstName);
    await page.getByLabel('Middle Name').click();
    await page.getByLabel('Middle Name').fill(dataGenerator.commonData.middleName);
    console.log('Entered First Name: ' + dataGenerator.commonData.middleName);
    await page.getByLabel('Last Name', { exact: true }).click();
    await page.getByLabel('Last Name', { exact: true }).fill(dataGenerator.commonData.lastName);
    console.log('Entered First Name: ' + dataGenerator.commonData.lastName);
    await page.getByRole('textbox', { name: 'Gender' }).click();
    await page.getByRole('menuitem', { name: 'Male', exact: true }).click();
    console.log('Entered Gender as Male');
    await page.getByPlaceholder('MM/DD/YYYY').nth(1).click();
    await page.getByPlaceholder('MM/DD/YYYY').nth(1).fill(dataGenerator.commonData.dob);
    console.log('Entered Date of Birth: ' + dataGenerator.commonData.dob);
    await page.getByRole('textbox', { name: 'Country of Birth' }).click();
    await page.getByRole('menuitem', { name: 'United States', exact: true }).click();
    console.log('Selected US as Country of Birth');
    await page.getByLabel('State of Birth').click();
    await page.getByRole('menuitem', { name: dataGenerator.commonData.stateOfBirth }).click();
    console.log('Selected ' + dataGenerator.commonData.stateOfBirth + ' as Country of Birth');
    await page.getByPlaceholder('___-__-____').click();
    await page.getByPlaceholder('___-__-____').fill(dataGenerator.commonData.ssn);
    console.log('Entered SSN: ' + dataGenerator.commonData.ssn);
    await page.getByLabel('Application Contact Email').click();
    await page.getByLabel('Application Contact Email').fill(email);
    await page.getByLabel('Are you 1099 tax exempt?').getByLabel('No').check();
    await page.getByLabel('Are you 1099 tax exempt?').getByLabel('Yes').check();
    await page.getByLabel('Legal Business Name').click();
    await page.getByLabel('Legal Business Name').fill(dataGenerator.commonData.dba);
    console.log('Entered Legal Business Name: ' + dataGenerator.commonData.dba);
    await page.getByLabel('Doing Business As (DBA) Name').click();
    await page.getByLabel('Doing Business As (DBA) Name').fill(dataGenerator.commonData.dba);
    console.log('Entered DBA: ' + dataGenerator.commonData.dba);
    await page.getByRole('button', { name: 'Next' }).click();
    console.log('Clicked Next, to move to the next section');
    await page.screenshot({path: screenshotLocation, fullPage: true });
    await expect(page.locator('div').filter({ hasText: /^Identifying Information$/ }).locator('svg')).toBeVisible();
    console.log('Entered all Required fields in Identifying Information');

    console.log('\n************ Moving to Providers Identifier ************');
    await expect(page.locator('#root')).toContainText('Provider Identifiers');
    await page.getByLabel('Do you have an NPI?').getByLabel('Yes').check();
    await page.getByLabel('NPI Number *').click();
    await page.getByLabel('NPI Number *').fill(npi);
    console.log('Entered NPI: ' + npi);
    await page.getByLabel('Are you a participant in').getByLabel('No').check();
    console.log('Selected No for Are you a participant in Medicaid');
    await page.getByLabel('If you are an out-of-state').getByLabel('No').check();
    console.log('Selected No for If you are an out-of-state provider');
    await page.getByLabel('Are you a Teaching Provider?').getByLabel('No').check();
    console.log('Selected No for Are you a Teaching Provider');
    await page.getByLabel('Are you a Treating Provider?').getByLabel('No').check();
    console.log('Selected No for Are you a Treating Provider');
    await page.getByLabel('Do you have malpractice or').getByLabel('No').check();
    console.log('Selected No for Do you have malpractice');
    await page.getByRole('button', { name: '​', exact: true }).click();
    await page.getByRole('option', { name: 'Paper' }).click();
    await page.getByRole('option', { name: 'Paper' }).press('Tab');
    console.log('Selected Paper for Tranmission type');
    await page.getByRole('button', { name: 'Next' }).click();
    console.log('Clicked Next, to move to the next section');
    await expect(page.locator('div').filter({ hasText: /^Provider Identifiers$/ }).locator('svg')).toBeVisible();
    console.log('Entered all Required fields in Providers Identifier');

    console.log('\n************ Moving to Ownership ************');
    await expect(page.locator('#root')).toContainText('Ownership');
    await page.getByLabel('1. Have you ever had').getByLabel('No').check();
    console.log('Selected No for Ownership Question 1');
    await page.getByLabel('2. Have you ever managed,').getByLabel('No').check();
    console.log('Selected No for Ownership Question 2');
    await page.getByLabel('3. Does any person or entity').getByLabel('No').check();
    console.log('Selected No for Ownership Question 3');
    await page.getByLabel('4. Has the enrolling provider').getByLabel('No').check();
    console.log('Selected No for Ownership Question 4');
    await page.getByLabel('5. Do any immediate family').getByLabel('No').check();
    console.log('Selected No for Ownership Question 5');
    await page.getByText('BackNext').click();
    await page.locator('div').filter({ hasText: /^Ownership$/ }).locator('path').click();
    console.log('Clicked Next, to move to the next section');
    console.log('Entered all Required fields in Ownership');

    console.log('\n************ Moving to Key Personnel ************');
    await expect(page.locator('#root')).toContainText('Key Personnel');
    await page.getByText('Key Personnel').click();
    await page.getByRole('button', { name: '+ Add Line' }).click();
    await page.getByRole('button', { name: '​', exact: true }).first().click();
    await page.getByRole('option', { name: 'Supervisor' }).click();
    console.log('Selected Supervisor for ');
    await page.getByRole('button', { name: '​', exact: true }).first().click();
    await page.getByRole('option', { name: 'Managing Non Convicted' }).click();
    await page.getByLabel('First Name').click();
    await page.getByLabel('First Name').fill(dataGenerator.commonData.firstName);
    console.log('Entered Key Personnel First Name: ' + dataGenerator.commonData.firstName);
    await page.getByLabel('Middle Name').click();
    await page.getByLabel('Middle Name').fill(dataGenerator.commonData.middleName);
    console.log('Entered Key Personnel Middle Name: ' + dataGenerator.commonData.middleName);
    await page.getByLabel('Last Name').click();
    await page.getByLabel('Last Name').fill(dataGenerator.commonData.lastName);
    console.log('Entered Key Personnel Last Name: ' + dataGenerator.commonData.lastName);
    await page.getByPlaceholder('___-__-____').click();
    await page.getByPlaceholder('___-__-____').fill(dataGenerator.commonData.ssn);
    console.log('Entered Key Personnel SSN: ' + dataGenerator.commonData.ssn);
    await page.getByPlaceholder('MM/DD/YYYY').first().click();
    await page.getByPlaceholder('MM/DD/YYYY').first().fill(dataGenerator.commonData.dob);
    console.log('Entered Key Personnel DOB: ' + dataGenerator.commonData.dob);
    await page.getByRole('button', { name: '​', exact: true }).first().click();
    await page.getByRole('option', { name: 'United States', exact: true }).click();
    console.log('Entered Key Personnel Country of Birth as US ');
    await page.getByRole('button', { name: '​', exact: true }).first().click();
    await page.getByRole('option', { name: dataGenerator.commonData.stateOfBirth }).click();
    console.log('Entered Key Personnel State of Birth: ' + dataGenerator.commonData.stateOfBirth);
    await page.getByPlaceholder('MM/DD/YYYY').nth(1).click();
    await page.getByPlaceholder('MM/DD/YYYY').nth(1).fill(dataGenerator.commonData.todaysDate);
    console.log('Entered Key Personnel Effective From Date: ' + dataGenerator.commonData.todaysDate);
    await page.getByLabel('Address Line 1 *').click();
    await page.getByLabel('Address Line 1 *').fill(dataGenerator.commonData.address);
    console.log('Entered Key Personnel Address: ' + dataGenerator.commonData.address);
    await page.getByText('Ste', { exact: true }).click();
    await expect(page.getByText('Sioux Falls')).toBeVisible();
    if (dataGenerator.commonData.stateOfBirth == 'South Dakota'){
      await expect(page.getByText('South Dakota').nth(1)).toBeVisible();
    } else {
    await expect(page.getByText('South Dakota')).toBeVisible();
    } //if condition based on the State of Birth field, since this will add a index on the screen
    await expect(page.getByText('Sioux Falls')).toBeVisible();
    await expect(page.getByText('South Dakota')).toBeVisible();
    await expect(page.getByText('57105')).toBeVisible();
    await expect(page.getByText('Minnehaha (46099)')).toBeVisible();
    console.log('Verified the City, State, County Code of selected address from Smarty Streets');
    await page.getByLabel('Address Line 1 *').click();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('div').filter({ hasText: /^Key Personnel$/ }).locator('svg')).toBeVisible();
    console.log('Clicked Next, to move to the next section');
    console.log('Entered all Required fields in Key Personnel');

    console.log('\n************ Moving to Exclusion/Sanction ************');
    await page.getByText('Exclusion/Sanction Information').click();
    await page.getByLabel('1. Fraud, theft, embezzlement').getByLabel('No').check();
    await page.getByLabel('2. Financial misconduct tied').getByLabel('No').check();
    await page.getByLabel('Perjury').getByLabel('No').check();
    await page.getByLabel('4. Abuse or neglect of a').getByLabel('No').check();
    await page.getByLabel('5. Obstruction of a criminal').getByLabel('No').check();
    await page.getByLabel('6. Unlawful manufacture,').getByLabel('No').check();
    await page.getByLabel('7. Health care related crime').getByLabel('No').check();
    await page.getByLabel('1. Failed to grant immediate').getByLabel('No').check();
    await page.getByLabel('2. Failed to provide').getByLabel('No').check();
    await page.getByLabel('3. Revocation or suspension').getByLabel('No').check();
    await page.getByLabel('4. Revocation or suspension').getByLabel('No').check();
    await page.getByLabel('5. Suspension, exclusion,').getByLabel('No').check();
    await page.getByLabel('6. Current payment suspension').getByLabel('No').check();
    await page.getByLabel('Judgment under the False Claims Act').getByLabel('No').check();
    await page.getByLabel('8. Current overpayment with').getByLabel('No').check();
    console.log('Selected No for all questions under Exclusion');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.locator('div').filter({ hasText: /^Exclusion\/Sanction Information$/ }).locator('svg')).toBeVisible();
    console.log('Clicked Next, to move to the next section');
    console.log('Entered all Required fields in Exclusion/Sanction Information');

    console.log('\n************ Moving to EFT Information ************');
    await page.locator('#divElem div').filter({ hasText: 'EFT Information' }).click();
    await expect(page.locator('#root')).toContainText('EFT Information');
    await page.getByLabel('Name of the Financial').fill(dataGenerator.commonData.institutionName);
    console.log('Entered Financial Institution Name: ' + dataGenerator.commonData.institutionName)
    await page.getByPlaceholder('_________').click();
    await page.getByPlaceholder('_________').fill(dataGenerator.commonData.routingNumber);
    console.log('Entered Rounting Number: ' + dataGenerator.commonData.routingNumber)
    await page.getByLabel('Account Number *').click();
    await page.getByLabel('Account Number *').fill(dataGenerator.commonData.accountNumber);
    console.log('Entered Account number: ' + dataGenerator.commonData.accountNumber)
    await page.getByRole('textbox', { name: 'Account Type' }).click();
    await page.getByRole('menuitem', { name: 'Checking' }).click();
    console.log('Selected Account Type as Checking')
    await page.getByPlaceholder('MM/DD/YYYY').click();
    await page.getByPlaceholder('MM/DD/YYYY').fill(dataGenerator.commonData.todaysDate);
    console.log('Entered Start Date: ' + dataGenerator.commonData.todaysDate)
    await page.getByRole('button', { name: 'Next' }).click();
    console.log('Clicked Next, to move to the next section');
    await expect(page.locator('div').filter({ hasText: /^EFT Information$/}).locator('svg')).toBeVisible();
    console.log('Entered all Required fields in EFT Information');

    console.log('\n************ Moving to Address Details ************');
    await page.locator('#divElem div').filter({ hasText: 'Address Details' }).click();
    await expect(page.locator('#root')).toContainText('Mailing Address');
    await page.getByLabel('Mailing Address Line 1 *').click();
    await page.getByLabel('Mailing Address Line 1 *').fill(dataGenerator.commonData.mailingAddress);
    await page.getByRole('menuitem', { name: dataGenerator.commonData.mailingAddress }).click();
    console.log('Entered Mailing Address: ' + dataGenerator.commonData.mailingAddress)
    await page.getByLabel('Attention Line').click();
    await page.getByLabel('Attention Line').fill(dataGenerator.commonData.firstName + ' ' + dataGenerator.commonData.lastName);
    console.log('Entered Attention Line: ' + dataGenerator.commonData.firstName + ' ' + dataGenerator.commonData.lastName)
    await page.locator('form').filter({ hasText: 'Phone *' }).getByPlaceholder('(___)___-____').click();
    await page.locator('form').filter({ hasText: 'Phone *' }).getByPlaceholder('(___)___-____').fill(dataGenerator.commonData.phoneNumber);
    console.log('Entered Phone number: ' + dataGenerator.commonData.phoneNumber)
    await page.getByLabel('Extension').click();
    await page.getByLabel('Email').click();
    await page.getByLabel('Email').fill(email);
    console.log('Entered Email Address: ' + email);
    await page.getByLabel('Email').press('Tab');
    await page.getByRole('button', { name: 'Next' }).click();
    console.log('Clicked Next, to move to the next section');
    await expect(page.locator('div').filter({ hasText: /^Address Details$/ }).locator('svg')).toBeVisible();
    console.log('Entered all Required fields Address Details');

    console.log('\n************ Moving to Program Participation ************');
    await page.getByText('Program Participation /').nth(1).click();
    await page.getByRole('button', { name: 'ADD PROGRAM PARTICIPATION' }).click();
    console.log('Entering Program Participation/Taxonomy/License Information');
    await page.getByRole('button', { name: '​', exact: true }).first().click();
    await page.getByRole('option', { name: dataGenerator.billingProvider.billingProgram }).click();
    console.log('Entered Program: ' + dataGenerator.billingProvider.billingProgram);
    await page.getByRole('button', { name: '​', exact: true }).click();
    await page.getByRole('option', { name: dataGenerator.billingProvider.billingSpeciality }).click();
    console.log('Entered Speciliaty: ' + dataGenerator.billingProvider.billingSpeciality);
    await page.getByRole('button', { name: 'Add Taxonomy' }).click();
    await page.getByLabel('Select Taxonomy/Description*').click();
    await page.getByRole('option', { name: dataGenerator.billingProvider.billingTaxonomy }).click();
    console.log('Entered Taxonomy: ' + dataGenerator.billingProvider.billingTaxonomy);
    await page.getByPlaceholder('MM/DD/YYYY').first().click();
    await page.getByPlaceholder('MM/DD/YYYY').first().fill(dataGenerator.commonData.todaysDate);
    console.log('Entered Effect Start Date as : ' + dataGenerator.commonData.todaysDate);

    //ADD License
    await page.getByRole('button', { name: 'Add License/Certificate' }).click();
    console.log('Adding License information');
    await page.getByRole('button', { name: '​', exact: true }).first().click();
    await page.getByRole('option', { name: dataGenerator.billingProvider.billingLicenseType }).click();
    console.log('Entered License Type : ' + dataGenerator.billingProvider.billingLicenseType);
    await page.getByRole('button', { name: '​', exact: true }).click();
    await page.getByRole('option', { name: 'South Dakota' }).click();
    await page.getByLabel('License/Certificate Number *').click();
    await page.getByLabel('License/Certificate Number *').fill(dataGenerator.billingProvider.billingLicenseNumber);
    console.log('Entered License Number : ' + dataGenerator.billingProvider.billingLicenseNumber);
    await page.getByPlaceholder('MM/DD/YYYY').nth(2).click();
    await page.getByPlaceholder('MM/DD/YYYY').nth(2).fill(dataGenerator.commonData.todaysDate);
    console.log('Entered License Start Date : ' + dataGenerator.commonData.todaysDate);
    await page.getByPlaceholder('MM/DD/YYYY').nth(3).click();
    await page.getByPlaceholder('MM/DD/YYYY').nth(3).fill(dataGenerator.commonData.futureDate3Years);
    console.log('Entered License End Date : ' + dataGenerator.commonData.futureDate3Years);
    await page.locator('#licenseAddAttachments').setInputFiles(dataGenerator.commonData.licenseJPGLocation);
    console.log('Uploaded license: ' + dataGenerator.commonData.licenseJPGLocation)
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    //ADD DEA
    await page.getByRole('button', { name: 'Add License/Certificate' }).click();
    await page.getByRole('button', { name: '​', exact: true }).first().click();
    await page.getByRole('option', { name: 'DEA' }).click();
    await page.getByRole('button', { name: '​', exact: true }).click();
    await page.getByRole('option', { name: 'South Dakota' }).click();
    await page.getByLabel('License/Certificate Number *').click();
    await page.getByLabel('License/Certificate Number *').fill(dataGenerator.billingProvider.billingLicenseNumber);
    console.log('Entered DEA License Number : ' + dataGenerator.billingProvider.billingLicenseNumber);
    await page.getByPlaceholder('MM/DD/YYYY').nth(2).click();
    await page.getByPlaceholder('MM/DD/YYYY').nth(2).fill(dataGenerator.commonData.todaysDate);
    console.log('Entered License Start Date : ' + dataGenerator.commonData.todaysDate);
    await page.getByPlaceholder('MM/DD/YYYY').nth(3).click();
    await page.getByPlaceholder('MM/DD/YYYY').nth(3).fill(dataGenerator.commonData.futureDate3Years);
    console.log('Entered License End Date : ' + dataGenerator.commonData.futureDate3Years);
    await page.locator('#licenseAddAttachments').setInputFiles(dataGenerator.commonData.licenseJPGLocation);
    console.log('Uploaded license: ' + dataGenerator.commonData.licenseJPGLocation)

    await page.getByRole('button', { name: 'Add', exact: true }).click();
    console.log('Saved License Information');
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.locator('div').filter({ hasText: /^Save$/ }).getByRole('button').click();
    console.log('Saved Program Information');
    await expect(page.getByText(dataGenerator.billingProvider.billingProgram )).toBeVisible();
    await expect(page.getByText(dataGenerator.billingProvider.billingSpeciality)).toBeVisible();
    await expect(page.locator('#root').getByText(dataGenerator.billingProvider.billingTaxonomy )).toBeVisible();
    await expect(page.locator('section')).toContainText(dataGenerator.billingProvider.billingLicenseNumber);
    await page.locator('div').filter({ hasText: /^Program Participation \/ Taxonomy \/ License \/ Certificate Information$/ }).nth(1).click();
    console.log('Clicked Next, to move to the next section');
    console.log('Entered Program Participation');

    console.log('\n************ Moving to Service Location ************');
    await page.getByText('Service Location').nth(1).click();
    await page.getByRole('button', { name: 'Add Location' }).click();
    await page.getByRole('button', { name: 'Add Location' }).click();
    console.log('Entering new Location');
    await page.locator('div').filter({ hasText: /^Effective start \*$/ }).getByLabel('Effective end').click();
    await page.getByRole('button', { name: dataGenerator.commonData.todaysDayValue, exact: true }).click();
    console.log('Entered Effective Start Date: ' + dataGenerator.commonData.todaysDayValue);
    await page.getByLabel('Location Name *').click();
    await page.getByLabel('Location Name *').fill(dataGenerator.commonData.dba);
    console.log('Entered Location Name: ' + dataGenerator.commonData.dba);
    await page.getByLabel('Address Line #1 *').click();
    await page.getByLabel('Address Line #1 *').fill(dataGenerator.commonData.address);
    await page.getByRole('menuitem', { name: dataGenerator.commonData.address }).click();
    console.log('Entered Address: ' + dataGenerator.commonData.address);
    await page.getByLabel('Attention Line *').click();
    await page.getByLabel('Attention Line *').fill(dataGenerator.commonData.firstName + ' ' + dataGenerator.commonData.lastName);
    console.log('Entered Attention Line: ' + dataGenerator.commonData.firstName + ' ' + dataGenerator.commonData.lastName);
    await page.getByLabel('Email *').click();
    await page.getByLabel('Email *').fill(email);
    console.log('Entered Email: ' + email);
    await page.getByLabel('Phone Number *').click();
    await page.getByLabel('Phone Number *').fill(dataGenerator.commonData.phoneNumber);
    console.log('Entered Phone Number: ' + dataGenerator.commonData.phoneNumber);
    await page.getByText('Add Program Participation', { exact: true }).click();
    console.log('Adding Program to the Location ' + dataGenerator.commonData.dba);
    await page.locator('span').filter({ hasText: 'Select Program Participation *' }).getByRole('button').click();
    await page.getByRole('option', { name: dataGenerator.billingProvider.billingProgram }).click();
    console.log('Selected the Program:  ' + dataGenerator.billingProvider.billingProgram);
    await page.getByLabel('checkbox').nth(0).check();
    await page.getByLabel('checkbox').nth(1).check();
    await page.getByRole('checkbox', { name: 'checkbox' }).first().check();
    await page.getByPlaceholder('MM/DD/YYYY').nth(2).click();
    await page.getByPlaceholder('MM/DD/YYYY').nth(2).fill(dataGenerator.commonData.todaysDate);
    await page.getByPlaceholder('MM/DD/YYYY').nth(4).click();
    await page.getByPlaceholder('MM/DD/YYYY').nth(4).fill(dataGenerator.commonData.todaysDate);
    console.log('Entered the Effective date as:  ' + dataGenerator.commonData.todaysDate);
    await page.getByRole('button', { name: 'Save' }).click();
    console.log('Saved the Program information');
    //await page.locator('#claimaddAttachment').setInputFiles(dataGenerator.commonData.claimsDocument);
    //console.log('Uploaded Claims Document: ' + dataGenerator.commonData.claimsDocument);
   // await page.locator('input[name= "onlyHomeLocation"]').first().check();
    await page.getByRole('button', { name: '​', exact: true }).nth(1).click();
    await page.getByRole('option', { name: 'English' }).click();
    await page.getByRole('option', { name: 'English' }).press('Tab');
    await page.getByRole('button', { name: '​', exact: true }).nth(1).click();
    await page.getByRole('option', { name: 'All', exact: true }).click();
    await page.getByLabel('All ages served').check();
    await page.locator('span').filter({ hasText: 'Accepting new patients? *YesNo' }).getByLabel('Yes').check();
    await page.locator('span').filter({ hasText: 'Is this location TTD/TTY' }).getByLabel('No').check();
    await page.getByLabel('All Counties').check();
    await page.locator('div').filter({ hasText: /^YesNoNot Applicable$/ }).getByLabel('Yes').check();
    await page.locator('div').filter({ hasText: /^Does this location provide urgent care services after standard business hours\? \*YesNo$/ }).getByLabel('No').check();
    await page.locator('div').filter({ hasText: /^Do you store patient records at this location\? \*YesNo$/ }).getByLabel('Yes').check();
    await page.locator('div').filter({ hasText: /^Do you store Personnel records at this location\? \*YesNo$/ }).getByLabel('Yes').check();
    await page.getByLabel('Phone number for Patients *').click();
    await page.getByLabel('Phone number for Patients *').fill(dataGenerator.commonData.phoneNumber);
    await page.getByRole('button', { name: '​', exact: true }).nth(1).click();
    await page.getByRole('option', { name: 'In-Person', exact: true }).click();
    console.log('Entered Miscellaneous Details');
    await page.getByRole('button', { name: 'Save' }).nth(1).click();
    console.log('Saved Location Inforamtion');
    await expect(page.getByText(dataGenerator.commonData.dba)).toBeVisible();
    console.log('Clicked Next, to move to the next section');
    console.log('Entered all Service Locations');

    console.log('\n************ Moving to Affiliation ************');
    await page.getByText('Affiliation').nth(1).click();
    console.log('No Affiliations Required');
    console.log('Clicked Next, to move to the next section');

    console.log('\n************ Moving to Upload Documents ************');
    await page.getByText('Upload Documents').click();
    //await page.locator('#17e69208-a150-491f-afa0-1b577e63e73c').setInputFiles(dataGenerator.commonData.uploadDocumentLocation);
    await page.getByRole('button', { name: 'Next' }).click();
    console.log('Clicked Next, to move to the next section');
    console.log('Uploaded all Documents');

    console.log('\n************ Moving to PCP Agreement ************');
    await page.getByText('PCP Addendum').nth(1).click();
    await expect(page.getByLabel('rdw-editor').getByRole('img')).toBeVisible();
    console.log('PCP Addendum is loaded');
    await page.getByRole('button', { name: 'AGREE AND SIGN' }).click({timeout: 12_000});
    await page.locator('#hsEmbeddedFrame').contentFrame().getByRole('button', { name: 'OK' }).click({timeout: 20_000});
    await page.locator('#hsEmbeddedFrame').contentFrame().getByRole('button', { name: 'Get started' }).click();
    await page.locator('#hsEmbeddedFrame').contentFrame().getByTestId('signature-input').click();
    await page.locator('#hsEmbeddedFrame').contentFrame().getByTestId('signing-modal--T').click();
    await page.locator('#hsEmbeddedFrame').contentFrame().getByTestId('singing-modal--insert-btn').click();
    await page.locator('#hsEmbeddedFrame').contentFrame().getByRole('button', { name: 'Continue' }).click();
    await page.locator('#hsEmbeddedFrame').contentFrame().getByRole('button', { name: 'I agree' }).click();
    await page.waitForTimeout(10000);
    await expect(page.locator('div').filter({ hasText: /^PCP AddendumPCP AddendumDownloadBackNext$/ }).locator('svg')).toBeVisible({timeout: 10_000});
    console.log('Agreement signed');
    await page.getByRole('button', { name: 'Next' }).click();
    console.log('Clicked Next, to move to the next section');
    console.log('Signed the Provider Agreement');

    console.log('\n************ Moving to Provider Agreement ************');
    await page.getByText('Provider Agreement').nth(1).click();

    await expect(page.getByRole('img', { name: 'Page 1' })).toBeVisible();
    console.log('Provider Agreement is loaded');
    await page.waitForTimeout(5000);
    await page.getByRole('button', { name: 'AGREE AND SIGN' }).click({timeout: 12_000});
    await page.locator('#hsEmbeddedFrame').contentFrame().getByRole('button', { name: 'OK' }).click({timeout: 20_0000});
    await page.locator('#hsEmbeddedFrame').contentFrame().getByRole('button', { name: 'Get started' }).click();
    await page.locator('#hsEmbeddedFrame').contentFrame().getByTestId('signature-input').click();
    await page.locator('#hsEmbeddedFrame').contentFrame().getByText('Type').click();
    await page.locator('#hsEmbeddedFrame').contentFrame().getByTestId('singing-modal--insert-btn').click();
    await page.locator('#hsEmbeddedFrame').contentFrame().getByRole('button', { name: 'Continue' }).click();
    await page.locator('#hsEmbeddedFrame').contentFrame().getByRole('button', { name: 'I agree' }).click();
    await page.waitForTimeout(10000);
    await expect(page.locator('div').filter({ hasText: /^Download$/ }).nth(2)).toBeVisible({timeout: 10_000});
    console.log('Agreement signed');
    await page.getByRole('button', { name: 'Next' }).click();
    console.log('Clicked Next, to move to the next section');
    console.log('Signed the Provider Agreement');

    console.log('\n************ Moving to Summary ************');
    await expect(page.getByText('I certify that the information provided on this enrollment form is, to the best of my knowledge, true, accurate, and complete and that I have read this entire form before signing.')).toBeVisible();    
    console.log('Summary page is displayed and application ready for submission');

    //Logout
    await page.getByRole('button', { name: dataGenerator.commonData.firstName }).click();
    await page.getByText('Log out').click();
    await expect (page).toHaveURL(new RegExp(url));
    console.log('Provider is logged out')
  });