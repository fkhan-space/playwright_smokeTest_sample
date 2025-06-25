import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

const max = 20;
const min = 0;
   
    export function getNPIValue(){
        // Array to store the csv values.
        var npiInCSV : string[] = [];

        npiInCSV= fs
                .readFileSync('./test_file/npiData/SDNPI.csv')
                .toString() // convert Buffer to string
                .split('\n') // split string to lines
                .map(e => e.trim()) ; // remove white spaces for each line;
        const npi = npiInCSV[Math.floor(Math.random() * (max - min + 1)) + min];
        return npi;
    }


