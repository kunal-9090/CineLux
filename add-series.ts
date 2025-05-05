import { db } from "./db";
import * as schema from "./shared/schema";
import { eq, and } from "drizzle-orm";

// Series data to add to the database
const seriesData = [
  {
    title: "Stranger Things",
    description: "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.",
    year: 2016,
    runtime: 50, // Average runtime per episode
    rating: 88,
    director: "Duffer Brothers",
    posterUrl: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    trailerUrl: "https://example.com/trailers/stranger-things",
    featured: false,
    contentType: "series"
  },
  {
    title: "The Mandalorian",
    description: "After the fall of the Galactic Empire, a lone gunfighter makes his way through the lawless galaxy with his young companion.",
    year: 2019,
    runtime: 40,
    rating: 86,
    director: "Jon Favreau",
    posterUrl: "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/9ijMGlJKqcslswWUzTEwScm82Gs.jpg",
    trailerUrl: "https://example.com/trailers/mandalorian",
    featured: false,
    contentType: "series"
  },
  {
    title: "Game of Thrones",
    description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
    year: 2011,
    runtime: 60,
    rating: 92,
    director: "David Benioff, D.B. Weiss",
    posterUrl: "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/suopoADq0k8YZr4dQXcU6pToj6s.jpg",
    trailerUrl: "https://example.com/trailers/game-of-thrones",
    featured: false,
    contentType: "series"
  },
  {
    title: "Breaking Bad",
    description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine to secure his family's future.",
    year: 2008,
    runtime: 49,
    rating: 94,
    director: "Vince Gilligan",
    posterUrl: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    trailerUrl: "https://example.com/trailers/breaking-bad",
    featured: false,
    contentType: "series"
  },
  {
    title: "The Witcher",
    description: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
    year: 2019,
    runtime: 60,
    rating: 84,
    director: "Lauren Schmidt Hissrich",
    posterUrl: "https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/jBJWaqoSCiARWtfV0GlqHrcdidd.jpg",
    trailerUrl: "https://example.com/trailers/witcher",
    featured: false,
    contentType: "series"
  },
  {
    title: "The Last of Us",
    description: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope.",
    year: 2023,
    runtime: 60,
    rating: 88,
    director: "Craig Mazin, Neil Druckmann",
    posterUrl: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/uDgy6hyPd82kOHh6I95FLtLnNIh.jpg",
    trailerUrl: "https://example.com/trailers/last-of-us",
    featured: false,
    contentType: "series"
  },
  {
    title: "The Umbrella Academy",
    description: "A family of former child heroes, now grown apart, must reunite to continue to protect the world.",
    year: 2019,
    runtime: 55,
    rating: 81,
    director: "Steve Blackman",
    posterUrl: "https://image.tmdb.org/t/p/w500/scZlQQYnDVlnpxFTxaIv2g0BWnL.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/mE3zzMkpP8yqlkzdjPsQmJHcerf.jpg",
    trailerUrl: "https://example.com/trailers/umbrella-academy",
    featured: false,
    contentType: "series"
  },
  {
    title: "Loki",
    description: "The mercurial villain Loki resumes his role as the God of Mischief in a new series that takes place after the events of 'Avengers: Endgame'.",
    year: 2021,
    runtime: 45,
    rating: 82,
    director: "Michael Waldron",
    posterUrl: "https://image.tmdb.org/t/p/w500/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/1Cxt4FMfJoYUB7JOMUEhCuiNRnl.jpg",
    trailerUrl: "https://example.com/trailers/loki",
    featured: false,
    contentType: "series"
  }
];

// Genre associations for each series
const genreAssociations = [
  // Stranger Things - Horror, Sci-Fi, Mystery
  { title: "Stranger Things", genreNames: ["Horror", "Sci-Fi", "Mystery"] },
  // The Mandalorian - Sci-Fi, Action, Adventure
  { title: "The Mandalorian", genreNames: ["Sci-Fi", "Action", "Adventure"] },
  // Game of Thrones - Drama, Adventure, Fantasy
  { title: "Game of Thrones", genreNames: ["Drama", "Adventure", "Action"] },
  // Breaking Bad - Drama, Crime, Thriller
  { title: "Breaking Bad", genreNames: ["Drama", "Crime", "Thriller"] },
  // The Witcher - Fantasy, Action, Adventure
  { title: "The Witcher", genreNames: ["Adventure", "Action", "Drama"] },
  // The Last of Us - Horror, Drama, Action
  { title: "The Last of Us", genreNames: ["Horror", "Drama", "Action"] },
  // The Umbrella Academy - Action, Adventure, Comedy
  { title: "The Umbrella Academy", genreNames: ["Action", "Adventure", "Drama"] },
  // Loki - Sci-Fi, Adventure, Fantasy
  { title: "Loki", genreNames: ["Sci-Fi", "Adventure", "Action"] }
];

// Function to add series
async function addSeries() {
  try {
    console.log("Starting to add series content...");
    
    // Get genres from the database
    const allGenres = await db.select().from(schema.genres);
    const genreMap = new Map(allGenres.map(genre => [genre.name, genre.id]));
    
    // Add each series
    for (const series of seriesData) {
      // Check if the series already exists
      const existingSeries = await db.select()
        .from(schema.movies)
        .where(
          eq(schema.movies.title, series.title)
        )
        .limit(1);
      
      if (existingSeries.length > 0) {
        console.log(`Series '${series.title}' already exists, skipping.`);
        continue;
      }
      
      // Insert the series
      const [insertedSeries] = await db.insert(schema.movies).values(series).returning();
      console.log(`Added series: ${insertedSeries.title}`);
      
      // Associate genres
      const seriesGenres = genreAssociations.find(assoc => assoc.title === series.title);
      if (seriesGenres) {
        for (const genreName of seriesGenres.genreNames) {
          const genreId = genreMap.get(genreName);
          if (genreId) {
            await db.insert(schema.movieGenres).values({
              movieId: insertedSeries.id,
              genreId: genreId
            });
            console.log(`  - Associated genre '${genreName}' with ${insertedSeries.title}`);
          } else {
            console.log(`  - Genre '${genreName}' not found in database`);
          }
        }
      }
    }
    
    console.log("Finished adding series content.");
  } catch (error) {
    console.error("Error adding series content:", error);
  }
}

// Run the function
addSeries().then(() => {
  console.log("Series addition script completed.");
  process.exit(0);
}).catch((error) => {
  console.error("Failed to add series:", error);
  process.exit(1);
});
