import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';
import { supabase } from "../../../../lib/supabase";
import moment from 'moment';

export async function GET() {

    moment.locale('zh-hk');

    // chromium.setHeadlessMode = true
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

    await page.goto("https://wmoov.com/movie/upcoming", {waitUntil: "networkidle2"})

    await page.waitForSelector('.movie_list');

    const content = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('.movie_list .each')); 
        return elements
            .filter(element => element.querySelector('a') !== null)
            .map(element => {
            const release_date = element.querySelector('.release_date');

            let date_text = '';

            release_date?.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    
                    const parts = node.textContent?.trim().split(',') || [];
                    if (parts.length > 0) {
                        date_text = parts[0].trim(); 
                    }
                }
            });

            date_text = date_text.trim();

            return {
                title: element.querySelector('h3>a')?.textContent,
                id: Number(element.querySelector('h3>a')?.getAttribute('href')?.replace("/movie/details/", "")),
                released_at: date_text,
                is_upcoming: 1
            };
        });
    })

    await browser.close()

    for(const item of content) {
        const date = moment(item.released_at, 'MM月DD日');

        if(date > moment()) {
            item.released_at = date.format('YYYY-MM-DD HH:mm:ss');
        }
        else{
            item.released_at = date.add(1, 'year').format('YYYY-MM-DD HH:mm:ss');
        }
    }

    const { data, error } = await supabase.from('movies').upsert(content);

    return Response.json({
        success: true,
        error: error,
        data: data,
        content: content
    })
}