import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  points: integer("points").notNull().default(0),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Movies
export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  year: integer("year").notNull(),
  runtime: integer("runtime").notNull(),
  rating: integer("rating"),
  director: text("director").notNull(),
  posterUrl: text("poster_url").notNull(),
  backdropUrl: text("backdrop_url").notNull(),
  trailerUrl: text("trailer_url"),
  featured: boolean("featured").default(false),
  contentType: text("content_type").notNull().default("movie"), // movie or series
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Genres
export const genres = pgTable("genres", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

// Movie-Genre relationship
export const movieGenres = pgTable("movie_genres", {
  id: serial("id").primaryKey(),
  movieId: integer("movie_id").references(() => movies.id).notNull(),
  genreId: integer("genre_id").references(() => genres.id).notNull(),
});

// Cast
export const cast = pgTable("cast", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  photoUrl: text("photo_url"),
});

// Movie-Cast relationship with character info
export const movieCast = pgTable("movie_cast", {
  id: serial("id").primaryKey(),
  movieId: integer("movie_id").references(() => movies.id).notNull(),
  castId: integer("cast_id").references(() => cast.id).notNull(),
  character: text("character").notNull(),
});

// User progress on movies
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  movieId: integer("movie_id").references(() => movies.id).notNull(),
  progress: integer("progress").notNull().default(0), // percentage 0-100
  completed: boolean("completed").default(false),
  lastWatched: timestamp("last_watched").defaultNow().notNull(),
});

// User watchlist
export const watchlist = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  movieId: integer("movie_id").references(() => movies.id).notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

// Achievements
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // award, star, crown
  points: integer("points").notNull(),
  criteria: jsonb("criteria").notNull(), // JSON with achievement criteria
});

// User achievements
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  achievementId: integer("achievement_id").references(() => achievements.id).notNull(),
  progress: integer("progress").notNull().default(0), // percentage 0-100
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  claimedAt: timestamp("claimed_at"),
});

// Rewards
export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // subscription, merchandise, digital
  pointsCost: integer("points_cost").notNull(),
  available: boolean("available").default(true),
});

// User rewards
export const userRewards = pgTable("user_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  rewardId: integer("reward_id").references(() => rewards.id).notNull(),
  redeemedAt: timestamp("redeemed_at").defaultNow().notNull(),
  status: text("status").notNull().default("pending"), // pending, fulfilled, expired
});

// Point transactions
export const pointTransactions = pgTable("point_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(),
  type: text("type").notNull(), // earned, spent
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  referenceId: text("reference_id"), // ID of related entity (movie, reward, etc.)
  referenceType: text("reference_type"), // Type of related entity (movie, reward, etc.)
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  watchlist: many(watchlist),
  achievements: many(userAchievements),
  rewards: many(userRewards),
  transactions: many(pointTransactions),
}));

export const moviesRelations = relations(movies, ({ many }) => ({
  genres: many(movieGenres),
  cast: many(movieCast),
  progress: many(userProgress),
  watchlist: many(watchlist),
}));

export const genresRelations = relations(genres, ({ many }) => ({
  movies: many(movieGenres),
}));

export const castRelations = relations(cast, ({ many }) => ({
  movies: many(movieCast),
}));

export const movieGenresRelations = relations(movieGenres, ({ one }) => ({
  movie: one(movies, { fields: [movieGenres.movieId], references: [movies.id] }),
  genre: one(genres, { fields: [movieGenres.genreId], references: [genres.id] }),
}));

export const movieCastRelations = relations(movieCast, ({ one }) => ({
  movie: one(movies, { fields: [movieCast.movieId], references: [movies.id] }),
  cast: one(cast, { fields: [movieCast.castId], references: [cast.id] }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, { fields: [userProgress.userId], references: [users.id] }),
  movie: one(movies, { fields: [userProgress.movieId], references: [movies.id] }),
}));

export const watchlistRelations = relations(watchlist, ({ one }) => ({
  user: one(users, { fields: [watchlist.userId], references: [users.id] }),
  movie: one(movies, { fields: [watchlist.movieId], references: [movies.id] }),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  users: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, { fields: [userAchievements.userId], references: [users.id] }),
  achievement: one(achievements, { fields: [userAchievements.achievementId], references: [achievements.id] }),
}));

export const rewardsRelations = relations(rewards, ({ many }) => ({
  users: many(userRewards),
}));

export const userRewardsRelations = relations(userRewards, ({ one }) => ({
  user: one(users, { fields: [userRewards.userId], references: [users.id] }),
  reward: one(rewards, { fields: [userRewards.rewardId], references: [rewards.id] }),
}));

export const pointTransactionsRelations = relations(pointTransactions, ({ one }) => ({
  user: one(users, { fields: [pointTransactions.userId], references: [users.id] }),
}));

// Schemas for insertion/validation
export const insertUserSchema = createInsertSchema(users, {
  username: (schema) => schema.min(3, "Username must be at least 3 characters"),
  password: (schema) => schema.min(6, "Password must be at least 6 characters"),
  email: (schema) => schema.email("Must provide a valid email"),
});

export const insertMovieSchema = createInsertSchema(movies, {
  title: (schema) => schema.min(1, "Title is required"),
  description: (schema) => schema.min(10, "Description must be at least 10 characters"),
});

export const insertGenreSchema = createInsertSchema(genres, {
  name: (schema) => schema.min(2, "Genre name must be at least 2 characters"),
});

export const insertAchievementSchema = createInsertSchema(achievements, {
  title: (schema) => schema.min(3, "Title must be at least 3 characters"),
  description: (schema) => schema.min(10, "Description must be at least 10 characters"),
});

export const insertRewardSchema = createInsertSchema(rewards, {
  title: (schema) => schema.min(3, "Title must be at least 3 characters"),
  description: (schema) => schema.min(10, "Description must be at least 10 characters"),
  pointsCost: (schema) => schema.min(1, "Points cost must be at least 1"),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Movie = typeof movies.$inferSelect;
export type InsertMovie = z.infer<typeof insertMovieSchema>;

export type Genre = typeof genres.$inferSelect;
export type InsertGenre = z.infer<typeof insertGenreSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type Reward = typeof rewards.$inferSelect;
export type InsertReward = z.infer<typeof insertRewardSchema>;
