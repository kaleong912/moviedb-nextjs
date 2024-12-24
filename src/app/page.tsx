'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs } from '../components/Tabs'
import { MovieList } from '../components/MovieList'
import { Headline } from '../components/Headline'
import { backgroundColor } from '../../lib/theme'
import { supabase } from '../../lib/supabase'
import { Movie } from "../../lib/types";



export default function Home() {
  const [activeTab, setActiveTab] = useState<'releasing' | 'upcoming'>('releasing')
  const [releasingMovies, setReleasingMovies] = useState<Movie[]>([])
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([])

  useEffect(() => {
    const fetchMovies = async () => {
        const { data, error } = await supabase.from('movies')
                                        .select('*, actors(*), youtube:movies_youtubers(youtube_link, youtubers:youtubers(id, name, colour))')
                                        .order('released_at', { ascending: false })
                                        .order('id', { ascending: false })

        if (error) {
          console.error( error)
        } else {
          setReleasingMovies( data.filter((movie) => !movie.is_upcoming) )
          setUpcomingMovies( data.filter((movie) => movie.is_upcoming).sort((a, b) => new Date(a.released_at).getTime() - new Date(b.released_at).getTime() ))
        }
    }
    fetchMovies()
  }, [])

  return (
    <div className="min-h-screen " style={{ backgroundColor }}>
      <div className=" mx-auto ">
        <Headline />
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className='container mx-auto px-4'>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MovieList movies={activeTab === 'releasing' ? releasingMovies : upcomingMovies} />
            </motion.div>
          </AnimatePresence>

        </div>
        
      </div>
    </div>
  )
}
