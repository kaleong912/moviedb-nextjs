import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';
import { supabase } from "../../../../lib/supabase";


export async function GET() {

    chromium.setHeadlessMode = true
    chromium.setGraphicsMode = false

    const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;
    console.log(`isLocal: ${isLocal}`)

    const browser = await puppeteer.launch({
        args: isLocal ? puppeteer.defaultArgs() : chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath(),
        headless: chromium.headless
    });

    const page = await browser.newPage();

    await page.goto("https://wmoov.com/movie/showing", {waitUntil: "networkidle2"})


    await page.waitForSelector('.movie_list');

    const content = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('.movie_list .each')); 
        return elements
            .filter(element => element.querySelector('a') !== null)
            .map(element => ({
            title: element.querySelector('a')?.textContent,
            id: Number(element.querySelector('a')?.getAttribute('href')?.replace("/movie/details/", "")),
            is_upcoming: 0
        }));
    })

    await browser.close()

    const { data, error } = await supabase.from('movies').upsert(content);

    return Response.json({
        success: true,
        error: error,
        data: data,
        content: content
    })
}