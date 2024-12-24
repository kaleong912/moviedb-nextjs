import { supabase } from "../../../../lib/supabase";

export async function GET(request: Request) {
    const { data, error } = await supabase.from('movies')
    .select('*, actors(*), youtube:movies_youtubers(youtube_link, youtubers:youtubers(name))')
    .order('released_at', { ascending: false })
    .order('id', { ascending: false })

    if (error) {
        console.log(error);
        return new Response(error.message, { status: 500 });
    }
    
    return Response.json(data);
}