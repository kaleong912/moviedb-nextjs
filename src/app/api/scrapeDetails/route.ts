import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';
import { supabase } from "../../../../lib/supabase";
import moment from 'moment';


export async function GET() {

    const {data, error} = await supabase
        .from('movies')
        .select('id')
        .is('released_at', null)
    

    if (error) {
        console.log(error)
        return new Response(error.message, {status: 500})
    }

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

    moment.locale('zh-hk');
    
    for (const item of data) {
        const page = await browser.newPage();

        await page.goto(`https://wmoov.com/movie/details/${item.id}`, {waitUntil: "networkidle2"});

        await page.waitForSelector('.movie_info');

        const content = await page.evaluate(() => {
            const element = document.querySelector('.movie_info dd:last-child') as HTMLImageElement;

            const regex = /(\d{4}年\d{1,2}月\d{1,2}日)/g;
            const match = element.textContent?.match(regex);
            return match ? match[match.length - 1] : null;
        })

        if (content) {
            const formattedDate = moment(content, "YYYY年MM月DD日").format('YYYY-MM-DD HH:mm:ss');
            console.log(`Movie ID: ${item.id}, From Date: ${content}, Released Date: ${formattedDate}`);

            await supabase
            .from('movies')
            .update({ released_at: formattedDate })
            .eq('id', item.id)
        }

        
    }


    

    await browser.close()

    

    //const { data, error } = await supabase.from('movies').upsert(content);

      
    return Response.json({
        success: true,
        // error: error,
        // data: data,
    })
}