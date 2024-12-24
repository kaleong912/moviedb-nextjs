import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';
import { supabase } from "../../../../lib/supabase";
import moment from 'moment';


export async function GET() {

    const {data, error} = await supabase
        .from('movies')
        .select('id')

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
            const element = document.querySelector('.movie_info dd[itemprop="actor"]') as HTMLImageElement;

            return element.textContent;
        })

        const actors: string[] = content?.trim().split(',') || [];

        for (const actor of actors) {
            const trimmedActor = actor.trim();

            if(trimmedActor === '--') {
                continue;
            }

            console.log(trimmedActor)

            const { data } = await supabase
            .from('actors')
            .select('id')
            .eq('name', trimmedActor)
            .limit(1)
            .single()

            let actor_id = 0;

            if (!data) {
                const { data: actorData, error: actorError } = await supabase
                .from('actors')
                .insert({ name: trimmedActor })
                .select('id')
                .limit(1)
                .single()

                if (actorError) {
                    console.log(actorError)
                    return new Response(actorError.message, {status: 500})
                }

                if (actorData) {
                    actor_id = actorData.id
                }
            }
            else{
                actor_id = data.id
            }

            const { error: InsertActorError } = await supabase
            .from('movies_actors')
            .upsert({ movie_id: item.id, actor_id: actor_id })

            if (InsertActorError) {
                console.log(InsertActorError)
                return new Response(InsertActorError.message, {status: 500})
            }

        }
    }

    await browser.close()

      
    return Response.json({
        success: true,
        // error: error,
        // data: data,
    })
}