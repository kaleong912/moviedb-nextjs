import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';
import { supabase } from "../../../../lib/supabase";


export async function GET() {

    const {data, error} = await supabase
        .from('movies')
        .select('id')
        .is('poster', null)
    

    if (error) {
        console.log(error)
        return new Response(error.message, {status: 500})
    }

    chromium.setHeadlessMode = true
    chromium.setGraphicsMode = false

    const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

    

    const browser = await puppeteer.launch({
        args: isLocal ? puppeteer.defaultArgs() : chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath(),
        headless: chromium.headless
    });
    

    if( data ){
        for (const item of data) {

            const page = await browser.newPage();
    
            await page.goto(`https://wmoov.com/movie/photos/${item.id}`, {waitUntil: "networkidle2"})

            await page.waitForSelector('.section_photo_view');

            const content = await page.evaluate(() => {
                const element = document.querySelector('.section_photo_view img') as HTMLImageElement;
                const poster = element.src;

                return poster
            })

            await page.close()

            await supabase
                .from('movies')
                .update({poster: content})
                .eq('id', item.id)


        }
    }

    await browser.close()

    return  Response.json({
        success: false,
        data: data,
        error: "No movies to scrape"
    })

}