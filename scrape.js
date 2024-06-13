#!/usr/bin/env node

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

async function scrapeAndConvertToPDF(url, outputPath) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' });

        // Convert the content to a PDF buffer
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true
        });

        await browser.close();

        // Write the PDF buffer to a file
        await fs.writeFile(outputPath, pdfBuffer);
        console.log(`PDF saved to ${outputPath}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

// CLI arguments handling
const args = process.argv.slice(2);
if (args.length !== 2) {
    console.error('Usage: scrape-to-pdf <url> <output_path>');
    process.exit(1);
}

const [url, outputPath] = args;
scrapeAndConvertToPDF(url, outputPath);
