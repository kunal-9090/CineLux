import { db } from "@db";
import * as schema from "@shared/schema";
import { eq, and, desc, asc, like, or, sql, isNull, not, gte, lte, exists, inArray } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { hash, compare } from "bcryptjs";

// User related functions
export async function createUser(username: string, password: string, email: string) {
  const hashedPassword = await hash(password, 10);
  
  const [user] = await db.insert(schema.users).values({
    username,
    password: hashedPassword,
    email
  }).returning();
  
  return user;
}

export async function getUserById(id: number) {
  return await db.query.users.findFirst({
    where: eq(schema.users.id, id),
  });
}

export async function getUserByUsername(username: string) {
  return await db.query.users.findFirst({
    where: eq(schema.users.username, username),
  });
}

export async function verifyPassword(user: schema.User, password: string) {
  return await compare(password, user.password);
}

export async function getUserPoints(userId: number) {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
  });
  
  const transactions = await db.query.pointTransactions.findMany({
    where: eq(schema.pointTransactions.userId, userId),
    orderBy: [desc(schema.pointTransactions.createdAt)],
    limit: 10
  });
  
  return {
    total: user?.points || 0,
    transactions
  };
}

// Movie related functions
export async function getAllMovies({ 
  type = null, 
  genreId = null, 
  page = 1, 
  limit = 20,
  sort = "popular"
}: { 
  type?: string | null, 
  genreId?: string | null, 
  page?: number, 
  limit?: number,
  sort?: string
}) {
  const offset = (page - 1) * limit;
  
  // Build query
  let query = db.select({
    id: schema.movies.id,
    title: schema.movies.title,
    description: schema.movies.description,
    year: schema.movies.year,
    runtime: schema.movies.runtime,
    rating: schema.movies.rating,
    director: schema.movies.director,
    posterUrl: schema.movies.posterUrl,
    backdropUrl: schema.movies.backdropUrl,
    contentType: schema.movies.contentType
  }).from(schema.movies);
  
  // Apply filters
  if (type && type !== 'all') {
    query = query.where(eq(schema.movies.contentType, type));
  }
  
  if (genreId) {
    const movieGenresSubquery = db.select({ movieId: schema.movieGenres.movieId })
      .from(schema.movieGenres)
      .where(eq(schema.movieGenres.genreId, parseInt(genreId)))
      .as('movie_genres_subquery');
    
    query = query.where(
      exists(
        db.select({ one: sql`1` })
          .from(movieGenresSubquery)
          .where(eq(movieGenresSubquery.movieId, schema.movies.id))
      )
    );
  }
  
  // Apply sorting
  switch (sort) {
    case 'rating':
      query = query.orderBy(desc(schema.movies.rating));
      break;
    case 'newest':
      query = query.orderBy(desc(schema.movies.year));
      break;
    case 'oldest':
      query = query.orderBy(asc(schema.movies.year));
      break;
    case 'popular':
    default:
      // In a real app, this might be based on view count or some popularity metric
      query = query.orderBy(desc(schema.movies.rating), desc(schema.movies.year));
      break;
  }
  
  // Apply pagination
  query = query.limit(limit).offset(offset);
  
  // Execute query
  const items = await query;
  
  // Count total (for pagination)
  const countQuery = db.select({ count: sql<number>`count(*)` }).from(schema.movies);
  
  // Apply the same filters to count query
  if (type && type !== 'all') {
    countQuery.where(eq(schema.movies.contentType, type));
  }
  
  if (genreId) {
    const movieGenresSubquery = db.select({ movieId: schema.movieGenres.movieId })
      .from(schema.movieGenres)
      .where(eq(schema.movieGenres.genreId, parseInt(genreId)))
      .as('movie_genres_subquery');
    
    countQuery.where(
      exists(
        db.select({ one: sql`1` })
          .from(movieGenresSubquery)
          .where(eq(movieGenresSubquery.movieId, schema.movies.id))
      )
    );
  }
  
  const [countResult] = await countQuery;
  const total = countResult?.count || 0;
  
  return {
    items,
    page,
    limit,
    total,
    pageCount: Math.ceil(total / limit),
    hasMore: offset + items.length < total
  };
}

export async function getFeaturedMovie() {
  const movie = await db.query.movies.findFirst({
    where: eq(schema.movies.featured, true),
  });
  
  if (!movie) {
    return null;
  }
  
  // Get genres for the movie
  const movieGenres = await db.select({
    genreName: schema.genres.name
  })
  .from(schema.movieGenres)
  .innerJoin(schema.genres, eq(schema.genres.id, schema.movieGenres.genreId))
  .where(eq(schema.movieGenres.movieId, movie.id));
  
  const genres = movieGenres.map(mg => mg.genreName);
  
  return {
    ...movie,
    genres
  };
}

export async function getMovieById(id: number) {
  const movie = await db.query.movies.findFirst({
    where: eq(schema.movies.id, id),
  });
  
  if (!movie) {
    return null;
  }
  
  // Get genres for the movie
  const movieGenres = await db.select({
    genreName: schema.genres.name
  })
  .from(schema.movieGenres)
  .innerJoin(schema.genres, eq(schema.genres.id, schema.movieGenres.genreId))
  .where(eq(schema.movieGenres.movieId, movie.id));
  
  // Get cast for the movie
  const movieCast = await db.select({
    id: schema.cast.id,
    name: schema.cast.name,
    photoUrl: schema.cast.photoUrl,
    character: schema.movieCast.character
  })
  .from(schema.movieCast)
  .innerJoin(schema.cast, eq(schema.cast.id, schema.movieCast.castId))
  .where(eq(schema.movieCast.movieId, movie.id));
  
  return {
    ...movie,
    genres: movieGenres.map(mg => mg.genreName),
    cast: movieCast
  };
}

export async function getContinueWatchingMovies(userId: number, genreId?: string | null) {
  let query = db.select({
    id: schema.movies.id,
    title: schema.movies.title,
    posterUrl: schema.movies.posterUrl,
    rating: schema.movies.rating,
    year: schema.movies.year,
    progress: schema.userProgress.progress
  })
  .from(schema.userProgress)
  .innerJoin(schema.movies, eq(schema.movies.id, schema.userProgress.movieId))
  .where(and(
    eq(schema.userProgress.userId, userId),
    eq(schema.userProgress.completed, false)
  ))
  .orderBy(desc(schema.userProgress.lastWatched));
  
  if (genreId) {
    const movieGenresSubquery = db.select({ movieId: schema.movieGenres.movieId })
      .from(schema.movieGenres)
      .where(eq(schema.movieGenres.genreId, parseInt(genreId)))
      .as('movie_genres_subquery');
    
    query = query.where(
      exists(
        db.select({ one: sql`1` })
          .from(movieGenresSubquery)
          .where(eq(movieGenresSubquery.movieId, schema.movies.id))
      )
    );
  }
  
  return await query.limit(5);
}

export async function getTrendingMovies(genreId?: string | null) {
  let query = db.select({
    id: schema.movies.id,
    title: schema.movies.title,
    posterUrl: schema.movies.posterUrl,
    rating: schema.movies.rating,
    year: schema.movies.year
  })
  .from(schema.movies)
  .orderBy(desc(schema.movies.rating), desc(schema.movies.year));
  
  if (genreId) {
    const movieGenresSubquery = db.select({ movieId: schema.movieGenres.movieId })
      .from(schema.movieGenres)
      .where(eq(schema.movieGenres.genreId, parseInt(genreId)))
      .as('movie_genres_subquery');
    
    query = query.where(
      exists(
        db.select({ one: sql`1` })
          .from(movieGenresSubquery)
          .where(eq(movieGenresSubquery.movieId, schema.movies.id))
      )
    );
  }
  
  return await query.limit(5);
}

export async function getRecommendedMovies(movieId: number) {
  // Get genres of the current movie
  const movieGenres = await db.select({
    genreId: schema.movieGenres.genreId
  })
  .from(schema.movieGenres)
  .where(eq(schema.movieGenres.movieId, movieId));
  
  const genreIds = movieGenres.map(mg => mg.genreId);
  
  // Find movies with similar genres
  const recommendedMovies = await db.select({
    id: schema.movies.id,
    title: schema.movies.title,
    posterUrl: schema.movies.posterUrl,
    rating: schema.movies.rating,
    year: schema.movies.year
  })
  .from(schema.movies)
  .where(
    and(
      not(eq(schema.movies.id, movieId)),
      exists(
        db.select({ one: sql`1` })
          .from(schema.movieGenres)
          .where(
            and(
              eq(schema.movieGenres.movieId, schema.movies.id),
              inArray(schema.movieGenres.genreId, genreIds)
            )
          )
      )
    )
  )
  .orderBy(desc(schema.movies.rating))
  .limit(5);
  
  return recommendedMovies;
}

export async function searchMovies(query: string) {
  const searchTerm = `%${query}%`;
  
  const results = await db.select({
    id: schema.movies.id,
    title: schema.movies.title,
    posterUrl: schema.movies.posterUrl,
    year: schema.movies.year,
    rating: schema.movies.rating
  })
  .from(schema.movies)
  .where(
    or(
      like(schema.movies.title, searchTerm),
      like(schema.movies.description, searchTerm)
    )
  )
  .orderBy(desc(schema.movies.rating))
  .limit(12);
  
  return results;
}

// Genre related functions
export async function getAllGenres() {
  return await db.query.genres.findMany({
    orderBy: [asc(schema.genres.name)]
  });
}

// Achievement related functions
export async function getUserAchievements(userId: number) {
  return await db.select({
    id: schema.achievements.id,
    title: schema.achievements.title,
    description: schema.achievements.description,
    icon: schema.achievements.icon,
    points: schema.achievements.points,
    progress: schema.userAchievements.progress,
    completed: schema.userAchievements.completed
  })
  .from(schema.userAchievements)
  .innerJoin(schema.achievements, eq(schema.achievements.id, schema.userAchievements.achievementId))
  .where(eq(schema.userAchievements.userId, userId));
}

// Rewards related functions
export async function getAllRewards() {
  return await db.select()
    .from(schema.rewards)
    .where(eq(schema.rewards.available, true))
    .orderBy(asc(schema.rewards.pointsCost));
}

// Leaderboard related functions
export async function getLeaderboard(userId: number) {
  const leaderboard = await db.select({
    id: schema.users.id,
    username: schema.users.username,
    points: schema.users.points,
  })
  .from(schema.users)
  .orderBy(desc(schema.users.points))
  .limit(10);
  
  // Mark the current user
  return leaderboard.map(user => ({
    ...user,
    isCurrentUser: user.id === userId
  }));
}
