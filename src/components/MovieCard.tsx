import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { ExternalLink } from 'lucide-react'
import { themeColor } from '../../lib/theme'
import moment from 'moment'
import { act } from 'react'
import { Movie, Youtube, Youtubers } from "../../lib/types";

interface MovieCardProps {
  title: string
  poster: string
  released_at?: string | Date
  youtube?: Youtube[]
  is_upcoming?: boolean
  actors?: { id: number; name: string }[]
}

moment.locale('zh-hk')

export function MovieCard({ title, poster, released_at, youtube, is_upcoming, actors }: MovieCardProps) {
  return (
    <div className="movie-card flex flex-col shadow-lg transition-transform duration-300 ease-in-out w-full max-w-xs">
      <div className="relative w-full h-96 movie-img mb-2">
        <div className='absolute top-0 left-0 right-0 bottom-0 overflow-hidden'>
            <Image
            src={poster}
            alt={`${title} poster`}
            layout="fill"
            objectFit="cover"
            className="z-10"
            />
        </div>
        
      </div>
      <div className="pt-4 flex flex-col  flex-grow gap-2" >
        <h3 className="text-xl font-medium text-white  line-clamp-2">{title}</h3>
        <div className='flex items-start justify-items-start  flex-wrap actors gap-2'>
          {
            actors?.slice(0, 6).map((actor) => {
              return (
                
                <h2 key={actor.id + "_" + title} className='text-xs border border-green-400 line-clamp-1 cursor-pointer py-1 px-2' style={{ color: themeColor, borderColor: themeColor }}>{actor.name}</h2>
                
              )
            })
          }
        </div>
        <h2 className='text-sm text-gray-400 line-clamp-1'>{moment(released_at).format('YYYY-MM-DD')}</h2>
        <div className="flex flex-col gap-2 mt-auto">
        {youtube && youtube.length > 0 && youtube?.map((y) => {
          return(
            <Button
            key={y.youtube_link}
            variant="outline" 
            size="sm" 
            className="mt-2 hover:bg-gray-900 hover:text-white transition-colors duration-300"
            style={{ 
              color: y.youtubers?.colour, 
              borderColor: y.youtubers?.colour,
              backgroundColor: 'transparent',
              borderRadius: 0
            
            }}
            onClick={() => window.open(y.youtube_link, '_blank')}
          >
            <Image 
            height={24}
            width={24}
            src={'/youtuber_' + y.youtubers?.id + '.png'}
            alt={title}/>
            
            觀看影評
          </Button>
          )
        })}
        </div>
      </div>
    </div>
  )
}

