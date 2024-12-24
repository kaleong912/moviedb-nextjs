export interface Movie {
    id: number;
    title: string;
    poster: string;
    youtube?: Youtube[]; 
    released_at: string | Date;
    actors?: { id: number; name: string }[];
    is_upcoming: boolean;        
}

export interface Actor {
    id: number;
    name: string;
    created_at: string | Date;
}

export interface Youtube {
    youtubers?: Youtubers;
    youtube_link?: string;
}

export interface Youtubers {
    id: number;
    name: string;
    colour: string;
}

export interface Director {
    id: number;
    name: string;
}