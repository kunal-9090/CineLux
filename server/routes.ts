import type { Express } from "express";
import { createServer, type Server } from "http";
import * as storage from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get featured movie for hero section
  app.get("/api/movies/featured", async (req, res) => {
    try {
      const featuredMovie = await storage.getFeaturedMovie();
      if (!featuredMovie) {
        return res.status(404).json({ message: "No featured movie found" });
      }
      return res.json(featuredMovie);
    } catch (error) {
      console.error("Error fetching featured movie:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get continue watching movies
  app.get("/api/movies/continue-watching", async (req, res) => {
    try {
      // In a real app, you'd get the user ID from the session
      const userId = 1; // Using seed user
      const genreId = req.query.genre as string | undefined;
      
      const movies = await storage.getContinueWatchingMovies(userId, genreId || null);
      return res.json(movies);
    } catch (error) {
      console.error("Error fetching continue watching movies:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get trending movies
  app.get("/api/movies/trending", async (req, res) => {
    try {
      const genreId = req.query.genre as string | undefined;
      const movies = await storage.getTrendingMovies(genreId || null);
      return res.json(movies);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get movie details by ID
  app.get("/api/movies/:id", async (req, res) => {
    try {
      const movieId = parseInt(req.params.id);
      if (isNaN(movieId)) {
        return res.status(400).json({ message: "Invalid movie ID" });
      }
      
      const movie = await storage.getMovieById(movieId);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      
      return res.json(movie);
    } catch (error) {
      console.error(`Error fetching movie details for ID ${req.params.id}:`, error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get recommended movies based on a movie
  app.get("/api/movies/recommended/:id", async (req, res) => {
    try {
      const movieId = parseInt(req.params.id);
      if (isNaN(movieId)) {
        return res.status(400).json({ message: "Invalid movie ID" });
      }
      
      const movies = await storage.getRecommendedMovies(movieId);
      return res.json(movies);
    } catch (error) {
      console.error(`Error fetching recommended movies for ID ${req.params.id}:`, error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Search for movies
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.length < 2) {
        return res.status(400).json({ message: "Search query too short" });
      }
      
      const results = await storage.searchMovies(query);
      return res.json(results);
    } catch (error) {
      console.error(`Error searching movies with query ${req.query.q}:`, error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Browse movies with filters
  app.get("/api/browse", async (req, res) => {
    try {
      const type = req.query.type as string | undefined;
      const genreId = req.query.genre as string | undefined;
      const sort = req.query.sort as string || "popular";
      const page = parseInt(req.query.page as string || "1");
      const limit = parseInt(req.query.limit as string || "20");
      
      if (isNaN(page) || page < 1) {
        return res.status(400).json({ message: "Invalid page number" });
      }
      
      if (isNaN(limit) || limit < 1 || limit > 100) {
        return res.status(400).json({ message: "Invalid limit" });
      }
      
      const result = await storage.getAllMovies({
        type: type || null,
        genreId: genreId || null,
        page,
        limit,
        sort
      });
      
      return res.json(result);
    } catch (error) {
      console.error("Error browsing movies:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all genres
  app.get("/api/genres", async (req, res) => {
    try {
      const genres = await storage.getAllGenres();
      return res.json(genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user achievements
  app.get("/api/achievements", async (req, res) => {
    try {
      // In a real app, you'd get the user ID from the session
      const userId = 1; // Using seed user
      
      const achievements = await storage.getUserAchievements(userId);
      return res.json(achievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get available rewards
  app.get("/api/rewards", async (req, res) => {
    try {
      const rewards = await storage.getAllRewards();
      return res.json(rewards);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user points
  app.get("/api/users/points", async (req, res) => {
    try {
      // In a real app, you'd get the user ID from the session
      const userId = 1; // Using seed user
      
      const points = await storage.getUserPoints(userId);
      return res.json(points);
    } catch (error) {
      console.error("Error fetching user points:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      // In a real app, you'd get the user ID from the session
      const userId = 1; // Using seed user
      
      const leaderboard = await storage.getLeaderboard(userId);
      return res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // User login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const loginSchema = z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required")
      });
      
      const validatedData = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(validatedData.username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      const passwordValid = await storage.verifyPassword(user, validatedData.password);
      
      if (!passwordValid) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Create session - in a real app, you'd store this in a cookie/session
      return res.status(200).json({
        id: user.id,
        username: user.username,
        points: user.points
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error logging in:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // User registration endpoint
  app.post("/api/auth/register", async (req, res) => {
    try {
      const registerSchema = z.object({
        username: z.string().min(3, "Username must be at least 3 characters"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        email: z.string().email("Must provide a valid email")
      });
      
      const validatedData = registerSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Create new user
      const user = await storage.createUser(
        validatedData.username,
        validatedData.password,
        validatedData.email
      );
      
      return res.status(201).json({
        id: user.id,
        username: user.username
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error("Error registering user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
