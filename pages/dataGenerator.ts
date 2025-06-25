import { faker } from '@faker-js/faker/locale/en';

const states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','Wisconsin','Wyoming'];
const random = Math.floor(Math.random() * states.length);

export default {
    commonData: {
        firstName: faker.person.firstName(),
        middleName: faker.person.middleName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
        Password: 'Password1!',
        providerEmail: '+' + Math.floor(Math.random() * 9999999) + '@gmail.com',
        dob: faker.date.birthdate().toLocaleDateString('en-US',{year: 'numeric', month: '2-digit', day: '2-digit'}),
        ssn: Math.random().toString().slice(2,11),
        title: faker.person.jobTitle(),
        todaysDate: faker.date.recent().toLocaleDateString('en-US',{year: 'numeric', month: '2-digit', day: '2-digit'}),
        todaysDayValue: faker.date.recent().toLocaleDateString('en-US',{day: '2-digit'}),
        futureDate1Years: faker.date.future({ years: 1 }).toLocaleDateString('en-US',{year: 'numeric', month: '2-digit', day: '2-digit'}),
        futureDate2Years: faker.date.future({ years: 2 }).toLocaleDateString('en-US',{year: 'numeric', month: '2-digit', day: '2-digit'}),
        futureDate3Years: faker.date.future({ years: 3 }).toLocaleDateString('en-US',{year: 'numeric', month: '2-digit', day: '2-digit'}),
        stateOfBirth: states[random], //faker.address.state(),
        dba: faker.company.name(),
        address: '3700 S Kiwanis Ave Ste 4',
        institutionName: faker.company.name() + ' Bank',
        routingNumber: faker.number.int({ min: 100000000, max: 999999999 }).toString(),
        accountNumber: faker.number.int({ min: 1000000000, max: 9999999990 }).toString(),
        mailingAddress: '3700 S Kiwanis Ave Ste 4',
        licenseJPGLocation: './test_file/license.jpg',
        licenseDOXCLocation: './test_file/license information.DOCX',
        uploadDocumentLocation: './test_file/medicaid.png',
        claimsDocument: './test_file/ClaimsFormSample.pdf',
        wyMailingAddress: '707 SHERIDAN AVE CODY',
        wyLicenseNumber: faker.string.alphanumeric(10),
    },

    billingProvider:{
        billingProgram: 'Primary Care Provider (PCP)',
        billingSpeciality: 'Physician Assistant &',
        billingTaxonomy: '363AM0700X - Physician',
        billingLicenseType: 'Physician Assistant (PA)',
        billingLicenseNumber: faker.string.alphanumeric(10),
    },

    servicingProvider: {

    },

    entity: {

    },

    tp: {
        legalBusinessName: faker.company.name(),
        dba: faker.company.name(),
        fein: faker.number.int({ min: 100000000, max: 999999999 }).toString(),
        softwareName: faker.company.name() + faker.person.jobArea(),
        

    },

    pem: {

    },
}