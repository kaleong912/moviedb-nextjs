import { MovieCard } from './MovieCard'
import { Movie } from "../../lib/types";

interface MovieListProps {
  movies: Movie[]
}

export function MovieList({ movies }: MovieListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-12 gap-y-14">
      {movies.map((movie) => (
        <MovieCard 
          key={movie.id} 
          title={movie.title} 
          poster={movie.poster}
          released_at={movie.released_at}
          youtube={movie.youtube}
          actors={movie.actors}
        />
      ))}
    </div>
  )
}

