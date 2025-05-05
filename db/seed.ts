import { db } from "./index";
import * as schema from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import { hash } from "bcryptjs";
import * as fs from 'fs';
import * as path from 'path';

// Load movie thumbnails
let movieThumbnails: Record<string, string> = {};

try {
  const thumbnailsPath = path.join(__dirname, '../movie-thumbnails.js');
  if (fs.existsSync(thumbnailsPath)) {
    movieThumbnails = require('../movie-thumbnails.js');
    console.log("Loaded improved movie thumbnails");
  } else {
    console.log("Movie thumbnails file not found, using default thumbnails");
  }
} catch (error) {
  console.error("Error loading movie thumbnails:", error);
}

// Helper function to get a better thumbnail for a movie
function getMovieThumbnail(title: string, defaultUrl: string): string {
  return movieThumbnails[title] || defaultUrl;
}

async function seed() {
  try {
    console.log("Starting seed process...");

    // Check if force-reseed is enabled through environment variable
    const forceReseed = process.env.FORCE_RESEED === 'true';

    // Check if seeding has been done before
    const existingUsers = await db.query.users.findMany({
      limit: 1,
    });

    if (existingUsers.length > 0 && !forceReseed) {
      console.log("Database already seeded. Skipping seed process.");
      console.log("To force a reseed, run with FORCE_RESEED=true");
      return;
    }
    
    // If we're doing a force reseed, clear existing data
    if (forceReseed) {
      console.log("Force reseed enabled. Clearing existing data...");
      
      // Delete data in reverse order of dependencies
      await db.delete(schema.movieCast);
      await db.delete(schema.movieGenres);
      await db.delete(schema.userProgress);
      await db.delete(schema.watchlist);
      await db.delete(schema.userAchievements);
      await db.delete(schema.userRewards);
      await db.delete(schema.pointTransactions);
      await db.delete(schema.movies);
      await db.delete(schema.cast);
      await db.delete(schema.users);
      await db.delete(schema.genres);
      
      // Reset sequences
      await db.execute(sql`ALTER SEQUENCE movies_id_seq RESTART WITH 1`);
      await db.execute(sql`ALTER SEQUENCE movie_cast_id_seq RESTART WITH 1`);
      await db.execute(sql`ALTER SEQUENCE movie_genres_id_seq RESTART WITH 1`);
      await db.execute(sql`ALTER SEQUENCE users_id_seq RESTART WITH 1`);
      await db.execute(sql`ALTER SEQUENCE genres_id_seq RESTART WITH 1`);
      
      console.log("Existing data cleared. Proceeding with fresh seed.");
    }

    // Create a test user
    const hashedPassword = await hash("password123", 10);
    const [user] = await db.insert(schema.users).values({
      username: "user",
      password: hashedPassword,
      email: "user@example.com",
      points: 2450,
    }).returning();

    console.log(`Created user: ${user.username}`);

    // Create genres based on content catalog requirements
    const genreData = [
      { name: "Action" },     // Red/orange color accent (#FF5733)
      { name: "Drama" },
      { name: "Sci-Fi" },
      { name: "Thriller" },    // Deep purple color accent (#8A2BE2)
      { name: "Comedy" },
      { name: "Horror" },      // Blood red color accent (#8B0000)
      { name: "Animation" },
      { name: "Adventure" },
      { name: "Mystery" },     // Deep blue color accent (#191970)
      { name: "Crime" }       // Steely gray color accent (#708090)
    ];

    const genres = await Promise.all(
      genreData.map(async (genre) => {
        const [inserted] = await db.insert(schema.genres).values(genre).returning();
        return inserted;
      })
    );

    console.log(`Created ${genres.length} genres`);

    // Create cast members
    const castData = [
      { name: "Matthew McConaughey", photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&auto=format" },
      { name: "Anne Hathaway", photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&auto=format" },
      { name: "Jessica Chastain", photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&auto=format" },
      { name: "Christian Bale", photoUrl: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=300&h=300&fit=crop&auto=format" },
      { name: "Heath Ledger", photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format" },
      { name: "Leonardo DiCaprio", photoUrl: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=300&h=300&fit=crop&auto=format" },
      { name: "Tom Hardy", photoUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=300&h=300&fit=crop&auto=format" },
      { name: "Timothée Chalamet", photoUrl: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=300&h=300&fit=crop&auto=format" },
      { name: "Keanu Reeves", photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&auto=format" },
      { name: "Tom Cruise", photoUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&h=300&fit=crop&auto=format" }
    ];

    const cast = await Promise.all(
      castData.map(async (actor) => {
        const [inserted] = await db.insert(schema.cast).values(actor).returning();
        return inserted;
      })
    );

    console.log(`Created ${cast.length} cast members`);

    // Create franchise collections as specified in content catalog
    
    // Marvel Collection (expanded to 20 films with better thumbnails)
    const marvelMovies = [
      // Apply thumbnails from our collection to match titles better
      {
        title: "Iron Man",
        description: "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.",
        year: 2008,
        runtime: 126,
        rating: 85,
        director: "Jon Favreau",
        posterUrl: "https://images.unsplash.com/photo-1560343776-97e7d202ff0e?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1562907550-096d3bf9b25c?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/iron-man",
        featured: false,
        contentType: "movie"
      },
      {
        title: "The Incredible Hulk",
        description: "Bruce Banner, a scientist on the run from the U.S. Government, must find a cure for the monster he turns into whenever he loses his temper.",
        year: 2008,
        runtime: 112,
        rating: 78,
        director: "Louis Leterrier",
        posterUrl: "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/incredible-hulk",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Iron Man 2",
        description: "With the world now aware of his identity as Iron Man, Tony Stark must contend with both his declining health and a vengeful mad man with ties to his father's legacy.",
        year: 2010,
        runtime: 124,
        rating: 79,
        director: "Jon Favreau",
        posterUrl: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1569701813229-33284b643e3c?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/iron-man-2",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Thor",
        description: "The powerful but arrogant god Thor is cast out of Asgard to live amongst humans in Midgard (Earth), where he soon becomes one of their finest defenders.",
        year: 2011,
        runtime: 115,
        rating: 77,
        director: "Kenneth Branagh",
        posterUrl: "https://images.unsplash.com/photo-1559535332-db9971090158?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1578305035108-1ef2a1d95b60?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/thor",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Captain America: The First Avenger",
        description: "Steve Rogers, a rejected military soldier, transforms into Captain America after taking a dose of a Super-Soldier serum.",
        year: 2011,
        runtime: 124,
        rating: 80,
        director: "Joe Johnston",
        posterUrl: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1501003878151-d3cb87799705?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/captain-america",
        featured: false,
        contentType: "movie"
      },
      {
        title: "The Avengers",
        description: "Earth's mightiest heroes must come together to stop Loki and his alien army from enslaving humanity.",
        year: 2012,
        runtime: 143,
        rating: 91,
        director: "Joss Whedon",
        posterUrl: "https://images.unsplash.com/photo-1624213111452-35e8d3d5cc40?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1556611832-c5f358b0057e?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/avengers",
        featured: true,
        contentType: "movie"
      },
      {
        title: "Iron Man 3",
        description: "When Tony Stark's world is torn apart by a formidable terrorist called the Mandarin, he starts an odyssey of rebuilding and retribution.",
        year: 2013,
        runtime: 130,
        rating: 79,
        director: "Shane Black",
        posterUrl: "https://images.unsplash.com/photo-1624464629934-01a1ade2e177?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1516051662687-567d7c4e8f6a?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/iron-man-3",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Thor: The Dark World",
        description: "When the Dark Elves attempt to plunge the universe into darkness, Thor must embark on a perilous and personal journey.",
        year: 2013,
        runtime: 112,
        rating: 75,
        director: "Alan Taylor",
        posterUrl: "https://images.unsplash.com/photo-1579445710183-f9a816f5da05?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/thor-dark-world",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Captain America: The Winter Soldier",
        description: "As Steve Rogers struggles to embrace his role in the modern world, he teams up with a fellow Avenger and S.H.I.E.L.D agent, Black Widow, to battle a new threat.",
        year: 2014,
        runtime: 136,
        rating: 87,
        director: "Anthony & Joe Russo",
        posterUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1597733336794-12d05021d510?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/winter-soldier",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Guardians of the Galaxy",
        description: "A group of intergalactic criminals must pull together to stop a fanatical warrior from destroying the universe.",
        year: 2014,
        runtime: 121,
        rating: 82,
        director: "James Gunn",
        posterUrl: "https://images.unsplash.com/photo-1596727147705-61a532a659bd?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1537420327992-d6e192287183?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/guardians",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Avengers: Age of Ultron",
        description: "When Tony Stark and Bruce Banner try to jump-start a dormant peacekeeping program called Ultron, things go horribly wrong.",
        year: 2015,
        runtime: 141,
        rating: 83,
        director: "Joss Whedon",
        posterUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1554050857-c84a8abdb5e2?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/age-of-ultron",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Ant-Man",
        description: "Armed with a super-suit with the astonishing ability to shrink in scale but increase in strength, cat burglar Scott Lang must embrace his inner hero.",
        year: 2015,
        runtime: 117,
        rating: 81,
        director: "Peyton Reed",
        posterUrl: "https://images.unsplash.com/photo-1593642532454-e138e28a63f4?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1563560908-4cfaa7651abb?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/ant-man",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Captain America: Civil War",
        description: "Political involvement in the Avengers' affairs causes a rift between Captain America and Iron Man.",
        year: 2016,
        runtime: 147,
        rating: 84,
        director: "Anthony & Joe Russo",
        posterUrl: "https://images.unsplash.com/photo-1626105949653-3d4007a338ee?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1623979413249-de345ed40a0d?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/civil-war",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Doctor Strange",
        description: "After his career is destroyed, a brilliant but arrogant surgeon gets a new lease on life when a sorcerer takes him under his wing.",
        year: 2016,
        runtime: 115,
        rating: 83,
        director: "Scott Derrickson",
        posterUrl: "https://images.unsplash.com/photo-1590283603385-5b4ead657d61?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1575919220112-0d5602d2443f?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/doctor-strange",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Guardians of the Galaxy Vol. 2",
        description: "The Guardians struggle to keep together as a team while dealing with their personal family issues, notably Star-Lord's encounter with his father.",
        year: 2017,
        runtime: 136,
        rating: 82,
        director: "James Gunn",
        posterUrl: "https://images.unsplash.com/photo-1611329532992-0b7ba27d85fb?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1581481615985-ba4775734a9b?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/guardians-vol-2",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Thor: Ragnarok",
        description: "Imprisoned on the planet Sakaar, Thor must race against time to return to Asgard and stop Ragnarök, the destruction of his world.",
        year: 2017,
        runtime: 130,
        rating: 87,
        director: "Taika Waititi",
        posterUrl: "https://images.unsplash.com/photo-1613331455414-1e9258b4b422?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/thor-ragnarok",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Black Panther",
        description: "T'Challa, heir to the hidden kingdom of Wakanda, must step forward to lead his people into a new future after his father's death.",
        year: 2018,
        runtime: 134,
        rating: 88,
        director: "Ryan Coogler",
        posterUrl: "https://images.unsplash.com/photo-1518413456902-bada7c4d3143?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1518499845966-9a86ddb68051?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/black-panther",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Avengers: Infinity War",
        description: "The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before he puts an end to the universe.",
        year: 2018,
        runtime: 149,
        rating: 91,
        director: "Anthony & Joe Russo",
        posterUrl: "https://images.unsplash.com/photo-1624026676760-53603e0e912e?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/infinity-war",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Ant-Man and the Wasp",
        description: "As Scott Lang balances being both a superhero and a father, Hope van Dyne and Dr. Hank Pym present an urgent new mission.",
        year: 2018,
        runtime: 118,
        rating: 81,
        director: "Peyton Reed",
        posterUrl: "https://images.unsplash.com/photo-1602020271504-458db2f32f31?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1575919184120-4367e4263627?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/ant-man-wasp",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Captain Marvel",
        description: "Carol Danvers becomes one of the universe's most powerful heroes when Earth is caught in the middle of a galactic war between two alien races.",
        year: 2019,
        runtime: 123,
        rating: 79,
        director: "Anna Boden & Ryan Fleck",
        posterUrl: "https://images.unsplash.com/photo-1584448097904-55ca4349da72?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1581481615985-ba4775734a9b?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/captain-marvel",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Avengers: Endgame",
        description: "After the devastating events of Infinity War, the universe is in ruins. The Avengers assemble once more to undo Thanos' actions and restore order.",
        year: 2019,
        runtime: 181,
        rating: 94,
        director: "Anthony & Joe Russo",
        posterUrl: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1607649253586-645a49ff3481?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/endgame",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Spider-Man: No Way Home",
        description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. But a spell goes wrong, and dangerous foes from other worlds appear.",
        year: 2021,
        runtime: 148,
        rating: 87,
        director: "Jon Watts",
        posterUrl: "https://images.unsplash.com/photo-1620510625142-b45cbb784397?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1607649253586-645a49ff3481?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/no-way-home",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Doctor Strange in the Multiverse of Madness",
        description: "Doctor Strange teams up with a mysterious teenage girl from his dreams who can travel across multiverses to battle multiple threats.",
        year: 2022,
        runtime: 126,
        rating: 78,
        director: "Sam Raimi",
        posterUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1518413456902-bada7c4d3143?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/multiverse-of-madness",
        featured: false,
        contentType: "movie"
      }
    ];

    // DC Extended Universe movies with improved thumbnails
    const dcMovies = [
      {
        title: "Man of Steel",
        description: "An alien child is evacuated from his dying world and sent to Earth to live among humans. His actions change the world forever.",
        year: 2013,
        runtime: 143,
        rating: 70,
        director: "Zack Snyder",
        posterUrl: "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1566159196870-56afb4ebd2d9?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/man-of-steel",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Batman v Superman: Dawn of Justice",
        description: "Fearing that the actions of Superman are left unchecked, Batman takes on the Man of Steel, while the world wrestles with what kind of hero it really needs.",
        year: 2016,
        runtime: 151,
        rating: 65,
        director: "Zack Snyder",
        posterUrl: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1559628129-67cf63b72248?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/batman-v-superman",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Suicide Squad",
        description: "A secret government agency recruits some of the most dangerous incarcerated super-villains to form a defensive task force.",
        year: 2016,
        runtime: 123,
        rating: 58,
        director: "David Ayer",
        posterUrl: "https://images.unsplash.com/photo-1531907700752-62799b2a3e84?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1604122230868-2ce5f2d4c04d?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/suicide-squad",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Wonder Woman",
        description: "When a pilot crashes and tells of conflict in the outside world, Diana, an Amazonian warrior in training, leaves home to fight a war.",
        year: 2017,
        runtime: 141,
        rating: 80,
        director: "Patty Jenkins",
        posterUrl: "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1519736277726-c083b6a094e2?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/wonder-woman",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Justice League",
        description: "Fueled by his restored faith in humanity and inspired by Superman's selfless act, Bruce Wayne enlists the help of his new-found ally, Diana Prince, to face an even greater enemy.",
        year: 2017,
        runtime: 120,
        rating: 67,
        director: "Zack Snyder",
        posterUrl: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1624375147958-b31b728a697b?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/justice-league",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Aquaman",
        description: "Arthur Curry, the human-born heir to the underwater kingdom of Atlantis, goes on a quest to prevent a war between the worlds of ocean and land.",
        year: 2018,
        runtime: 143,
        rating: 71,
        director: "James Wan",
        posterUrl: "https://images.unsplash.com/photo-1560507308-2efe897bd18d?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1518476383253-d4147d7de49c?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/aquaman",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Shazam!",
        description: "A streetwise 14-year-old foster kid can turn into the adult superhero Shazam by shouting out one word.",
        year: 2019,
        runtime: 132,
        rating: 79,
        director: "David F. Sandberg",
        posterUrl: "https://images.unsplash.com/photo-1533069027836-fa937181a8ce?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1548161049-f139a5eb9f51?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/shazam",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Birds of Prey",
        description: "After splitting with the Joker, Harley Quinn joins superheroes Black Canary, Huntress and Renee Montoya to save a young girl from an evil crime lord.",
        year: 2020,
        runtime: 109,
        rating: 73,
        director: "Cathy Yan",
        posterUrl: "https://images.unsplash.com/photo-1619618223408-8f0fb447a388?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1542728929-2b5d9da1ac02?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/birds-of-prey",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Wonder Woman 1984",
        description: "Diana must contend with a work colleague and businessman, whose desire for extreme wealth sends the world down a path of destruction.",
        year: 2020,
        runtime: 151,
        rating: 68,
        director: "Patty Jenkins",
        posterUrl: "https://images.unsplash.com/photo-1602703921095-3a80f5e8f6c1?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1616097208924-4bcd349c5171?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/wonder-woman-1984",
        featured: false,
        contentType: "movie"
      },
      {
        title: "The Batman",
        description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
        year: 2022,
        runtime: 176,
        rating: 85,
        director: "Matt Reeves",
        posterUrl: "https://images.unsplash.com/photo-1600639522358-26df6d0c2ef9?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1559628129-67cf63b72248?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/the-batman",
        featured: false,
        contentType: "movie"
      }
    ];

    // John Wick Series with improved thumbnails
    const johnWickMovies = [
      {
        title: "John Wick",
        description: "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything from him.",
        year: 2014,
        runtime: 101,
        rating: 85,
        director: "Chad Stahelski",
        posterUrl: "https://images.unsplash.com/photo-1626886235973-7566e348e7f2?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/john-wick",
        featured: false,
        contentType: "movie"
      },
      {
        title: "John Wick: Chapter 2",
        description: "After returning to the criminal underworld to repay a debt, John Wick discovers that a large bounty has been put on his life.",
        year: 2017,
        runtime: 122,
        rating: 82,
        director: "Chad Stahelski",
        posterUrl: "https://images.unsplash.com/photo-1614629591533-51683b6fe7f8?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1559762717-99c81ac85459?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/john-wick-2",
        featured: false,
        contentType: "movie"
      },
      {
        title: "John Wick: Chapter 3 – Parabellum",
        description: "John Wick is on the run after killing a member of the international assassins' guild, and with a $14 million price tag on his head, he is the target of hit men and women everywhere.",
        year: 2019,
        runtime: 131,
        rating: 83,
        director: "Chad Stahelski",
        posterUrl: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1569701813229-33284b643e3c?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/john-wick-3",
        featured: false,
        contentType: "movie"
      },
      {
        title: "John Wick: Chapter 4",
        description: "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe.",
        year: 2023,
        runtime: 169,
        rating: 86,
        director: "Chad Stahelski",
        posterUrl: "https://images.unsplash.com/photo-1617552886827-260928660d1f?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1543746379-49b5673dde58?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/john-wick-4",
        featured: false,
        contentType: "movie"
      }
    ];

    // Horror Highlights with improved thumbnails
    const horrorMovies = [
      {
        title: "The Conjuring",
        description: "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.",
        year: 2013,
        runtime: 112,
        rating: 83,
        director: "James Wan",
        posterUrl: "https://images.unsplash.com/photo-1506959569640-44e5610fcf56?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/conjuring",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Hereditary",
        description: "A grieving family is haunted by tragic and disturbing occurrences after the death of their secretive grandmother.",
        year: 2018,
        runtime: 127,
        rating: 87,
        director: "Ari Aster",
        posterUrl: "https://images.unsplash.com/photo-1534330207846-8740180d815e?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1523524928051-10ebf525a02f?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/hereditary",
        featured: false,
        contentType: "movie"
      },
      {
        title: "A Quiet Place",
        description: "In a post-apocalyptic world, a family is forced to live in silence while hiding from monsters with ultra-sensitive hearing.",
        year: 2018,
        runtime: 90,
        rating: 82,
        director: "John Krasinski",
        posterUrl: "https://images.unsplash.com/photo-1605806616949-1e87b487fc2f?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1501084291732-13b1ba8f0ebc?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/quiet-place",
        featured: false,
        contentType: "movie"
      },
      {
        title: "The Invisible Man",
        description: "When Cecilia's abusive ex takes his own life and leaves her his fortune, she suspects his death was a hoax. As a series of coincidences turn lethal, Cecilia works to prove that she is being hunted by someone nobody can see.",
        year: 2020,
        runtime: 124,
        rating: 80,
        director: "Leigh Whannell",
        posterUrl: "https://images.unsplash.com/photo-1605698598709-4c817e1ce942?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1511406361295-0a1ff814c0ce?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/invisible-man",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Midsommar",
        description: "A couple travels to Northern Europe to visit a rural hometown's fabled Swedish mid-summer festival. What begins as an idyllic retreat quickly devolves into an increasingly violent and bizarre competition.",
        year: 2019,
        runtime: 148,
        rating: 83,
        director: "Ari Aster",
        posterUrl: "https://images.unsplash.com/photo-1541329164248-f9486938200a?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1552083375-1447ce886485?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/midsommar",
        featured: false,
        contentType: "movie"
      },
      {
        title: "The Witch",
        description: "A family in 1630s New England is torn apart by the forces of witchcraft, black magic, and possession.",
        year: 2015,
        runtime: 92,
        rating: 83,
        director: "Robert Eggers",
        posterUrl: "https://images.unsplash.com/photo-1566022328043-4bf3986a780d?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/the-witch",
        featured: false,
        contentType: "movie"
      }
    ];

    // Combine all franchise collections
    const franchiseMovies = [...marvelMovies, ...dcMovies, ...johnWickMovies, ...horrorMovies];
    
    // Insert franchise movies into the database
    const allFranchiseMovies = await Promise.all(
      franchiseMovies.map(async (movie) => {
        const [inserted] = await db.insert(schema.movies).values(movie).returning();
        return inserted;
      })
    );
    
    console.log(`Created ${allFranchiseMovies.length} franchise movies`);
    
    // Associate Marvel movies with Action, Adventure, and Sci-Fi genres
    const marvelMovieGenres = [];
    for (let i = 0; i < marvelMovies.length; i++) {
      const movieIndex = i;
      const movie = allFranchiseMovies[movieIndex];
      
      // All Marvel movies have Action genre
      marvelMovieGenres.push({ 
        movieId: movie.id, 
        genreId: genres.find(g => g.name === "Action")!.id 
      });
      
      // Some Marvel movies have additional genres
      if (movie.title === "Guardians of the Galaxy") {
        marvelMovieGenres.push({ 
          movieId: movie.id, 
          genreId: genres.find(g => g.name === "Comedy")!.id 
        });
      }
      
      if (movie.title === "Captain America: Civil War" || 
          movie.title === "Spider-Man: No Way Home") {
        marvelMovieGenres.push({ 
          movieId: movie.id, 
          genreId: genres.find(g => g.name === "Thriller")!.id 
        });
      }
      
      if (movie.title === "Black Panther" || 
          movie.title === "Avengers: Infinity War" || 
          movie.title === "Avengers: Endgame") {
        marvelMovieGenres.push({ 
          movieId: movie.id, 
          genreId: genres.find(g => g.name === "Drama")!.id 
        });
      }
      
      if (movie.title === "Spider-Man: No Way Home") {
        marvelMovieGenres.push({ 
          movieId: movie.id, 
          genreId: genres.find(g => g.name === "Adventure")!.id 
        });
      }
      
      if (movie.title === "Doctor Strange in the Multiverse of Madness") {
        marvelMovieGenres.push({ 
          movieId: movie.id, 
          genreId: genres.find(g => g.name === "Horror")!.id 
        });
      }
    }
    
    // Associate DC movies with genres
    const dcMovieGenres = [];
    for (let i = 0; i < dcMovies.length; i++) {
      const movieIndex = marvelMovies.length + i;
      const movie = allFranchiseMovies[movieIndex];
      
      // Most DC movies have Action genre
      if (movie.title !== "The Batman") {
        dcMovieGenres.push({ 
          movieId: movie.id, 
          genreId: genres.find(g => g.name === "Action")!.id 
        });
      }
      
      // Specific genres for certain movies
      if (movie.title === "Suicide Squad" || movie.title === "Birds of Prey") {
        dcMovieGenres.push({ 
          movieId: movie.id, 
          genreId: genres.find(g => g.name === "Crime")!.id 
        });
      }
      
      if (movie.title === "Wonder Woman" || 
          movie.title === "Wonder Woman 1984" || 
          movie.title === "Aquaman") {
        dcMovieGenres.push({ 
          movieId: movie.id, 
          genreId: genres.find(g => g.name === "Adventure")!.id 
        });
      }
      
      if (movie.title === "Shazam!") {
        dcMovieGenres.push({ 
          movieId: movie.id, 
          genreId: genres.find(g => g.name === "Comedy")!.id 
        });
      }
      
      if (movie.title === "The Batman") {
        dcMovieGenres.push({ 
          movieId: movie.id, 
          genreId: genres.find(g => g.name === "Crime")!.id 
        });
        dcMovieGenres.push({ 
          movieId: movie.id, 
          genreId: genres.find(g => g.name === "Mystery")!.id 
        });
      }
    }
    
    // Associate John Wick movies with Action and Crime genres
    const johnWickMovieGenres = [];
    for (let i = 0; i < johnWickMovies.length; i++) {
      const movieIndex = marvelMovies.length + dcMovies.length + i;
      const movie = allFranchiseMovies[movieIndex];
      
      // All John Wick movies have Action and Crime genres
      johnWickMovieGenres.push({ 
        movieId: movie.id, 
        genreId: genres.find(g => g.name === "Action")!.id 
      });
      johnWickMovieGenres.push({ 
        movieId: movie.id, 
        genreId: genres.find(g => g.name === "Crime")!.id 
      });
    }
    
    // Associate Horror movies with Horror, Mystery, and Thriller genres
    const horrorMovieGenres = [];
    for (let i = 0; i < horrorMovies.length; i++) {
      const movieIndex = marvelMovies.length + dcMovies.length + johnWickMovies.length + i;
      const movie = allFranchiseMovies[movieIndex];
      
      // All Horror movies have Horror genre
      horrorMovieGenres.push({ 
        movieId: movie.id, 
        genreId: genres.find(g => g.name === "Horror")!.id 
      });
      
      // Add Mystery genre to some horror movies
      if (movie.title === "Hereditary" || 
          movie.title === "Midsommar" || 
          movie.title === "The Witch") {
        horrorMovieGenres.push({ 
          movieId: movie.id, 
          genreId: genres.find(g => g.name === "Mystery")!.id 
        });
      }
      
      // Add Thriller genre to some horror movies
      if (movie.title === "A Quiet Place" || movie.title === "The Invisible Man") {
        horrorMovieGenres.push({ 
          movieId: movie.id, 
          genreId: genres.find(g => g.name === "Thriller")!.id 
        });
      }
    }
    
    // Combine all genre associations
    const franchiseMovieGenres = [...marvelMovieGenres, ...dcMovieGenres, ...johnWickMovieGenres, ...horrorMovieGenres];
    
    // Insert all genre associations into the database
    await Promise.all(
      franchiseMovieGenres.map(async (assoc) => {
        await db.insert(schema.movieGenres).values(assoc);
      })
    );
    
    console.log(`Created ${franchiseMovieGenres.length} franchise movie-genre associations`);
    
    // Create regular movies
    const movieData = [
      {
        title: "Interstellar",
        description: "Journey through space and time in this epic adventure about human connection and the power of love.",
        year: 2014,
        runtime: 169,
        rating: 86,
        director: "Christopher Nolan",
        posterUrl: "https://images.unsplash.com/photo-1578305035108-1ef2a1d95b60?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/interstellar",
        featured: true,
        contentType: "movie"
      },
      {
        title: "The Dark Knight",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        year: 2008,
        runtime: 152,
        rating: 90,
        director: "Christopher Nolan",
        posterUrl: "https://images.unsplash.com/photo-1578305035108-1ef2a1d95b60?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/dark-knight",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        year: 2010,
        runtime: 148,
        rating: 88,
        director: "Christopher Nolan",
        posterUrl: "https://images.unsplash.com/photo-1535016120720-40c646be5580?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/inception",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Dune",
        description: "Feature adaptation of Frank Herbert's science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.",
        year: 2021,
        runtime: 155,
        rating: 80,
        director: "Denis Villeneuve",
        posterUrl: "https://images.unsplash.com/photo-1517462964-21fdcec3f25b?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/dune",
        featured: false,
        contentType: "movie"
      },
      {
        title: "The Matrix",
        description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
        year: 1999,
        runtime: 136,
        rating: 87,
        director: "The Wachowskis",
        posterUrl: "https://images.unsplash.com/photo-1561817245-121d9d413e90?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1535016120720-40c646be5580?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/matrix",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Top Gun: Maverick",
        description: "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him.",
        year: 2022,
        runtime: 130,
        rating: 83,
        director: "Joseph Kosinski",
        posterUrl: "https://images.unsplash.com/photo-1458053688450-eef5d21d43b3?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/top-gun-maverick",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Oppenheimer",
        description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        year: 2023,
        runtime: 180,
        rating: 89,
        director: "Christopher Nolan",
        posterUrl: "https://images.unsplash.com/photo-1624969862293-b749659a90753?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/oppenheimer",
        featured: false,
        contentType: "movie"
      },
      {
        title: "The Batman",
        description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
        year: 2022,
        runtime: 176,
        rating: 78,
        director: "Matt Reeves",
        posterUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/the-batman",
        featured: false,
        contentType: "movie"
      },
      {
        title: "Avatar: The Way of Water",
        description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
        year: 2022,
        runtime: 192,
        rating: 76,
        director: "James Cameron",
        posterUrl: "https://images.unsplash.com/photo-1543085874-23360119c633?fit=crop&w=600&h=900&auto=format",
        backdropUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?fit=crop&w=1920&q=80&auto=format",
        trailerUrl: "https://example.com/trailers/avatar-way-of-water",
        featured: false,
        contentType: "movie"
      }
    ];

    const movies = await Promise.all(
      movieData.map(async (movie) => {
        const [inserted] = await db.insert(schema.movies).values(movie).returning();
        return inserted;
      })
    );

    console.log(`Created ${movies.length} movies`);

    // Associate movies with genres
    const movieGenreAssociations = [
      { movieId: movies[0].id, genreId: genres.find(g => g.name === "Sci-Fi")!.id }, // Interstellar - Sci-Fi
      { movieId: movies[0].id, genreId: genres.find(g => g.name === "Adventure")!.id }, // Interstellar - Adventure
      { movieId: movies[0].id, genreId: genres.find(g => g.name === "Drama")!.id }, // Interstellar - Drama
      { movieId: movies[1].id, genreId: genres.find(g => g.name === "Action")!.id }, // Dark Knight - Action
      { movieId: movies[1].id, genreId: genres.find(g => g.name === "Thriller")!.id }, // Dark Knight - Thriller
      { movieId: movies[2].id, genreId: genres.find(g => g.name === "Sci-Fi")!.id }, // Inception - Sci-Fi
      { movieId: movies[2].id, genreId: genres.find(g => g.name === "Action")!.id }, // Inception - Action
      { movieId: movies[3].id, genreId: genres.find(g => g.name === "Sci-Fi")!.id }, // Dune - Sci-Fi
      { movieId: movies[3].id, genreId: genres.find(g => g.name === "Adventure")!.id }, // Dune - Adventure
      { movieId: movies[4].id, genreId: genres.find(g => g.name === "Sci-Fi")!.id }, // Matrix - Sci-Fi
      { movieId: movies[4].id, genreId: genres.find(g => g.name === "Action")!.id }, // Matrix - Action
      { movieId: movies[5].id, genreId: genres.find(g => g.name === "Action")!.id }, // Top Gun - Action
      { movieId: movies[5].id, genreId: genres.find(g => g.name === "Drama")!.id }, // Top Gun - Drama
      { movieId: movies[6].id, genreId: genres.find(g => g.name === "Drama")!.id }, // Oppenheimer - Drama
      { movieId: movies[6].id, genreId: genres.find(g => g.name === "Thriller")!.id }, // Oppenheimer - Thriller
      { movieId: movies[7].id, genreId: genres.find(g => g.name === "Action")!.id }, // The Batman - Action
      { movieId: movies[7].id, genreId: genres.find(g => g.name === "Thriller")!.id }, // The Batman - Thriller
      { movieId: movies[8].id, genreId: genres.find(g => g.name === "Sci-Fi")!.id }, // Avatar - Sci-Fi
      { movieId: movies[8].id, genreId: genres.find(g => g.name === "Adventure")!.id }, // Avatar - Adventure
      { movieId: movies[8].id, genreId: genres.find(g => g.name === "Action")!.id } // Avatar - Action
    ];

    await Promise.all(
      movieGenreAssociations.map(async (assoc) => {
        await db.insert(schema.movieGenres).values(assoc);
      })
    );

    console.log(`Created ${movieGenreAssociations.length} movie-genre associations`);

    // Associate cast members with movies
    const movieCastAssociations = [
      { movieId: movies[0].id, castId: cast[0].id, character: "Joseph Cooper" }, // Interstellar - McConaughey
      { movieId: movies[0].id, castId: cast[1].id, character: "Dr. Amelia Brand" }, // Interstellar - Hathaway
      { movieId: movies[0].id, castId: cast[2].id, character: "Murphy Cooper" }, // Interstellar - Chastain
      { movieId: movies[1].id, castId: cast[3].id, character: "Bruce Wayne / Batman" }, // Dark Knight - Bale
      { movieId: movies[1].id, castId: cast[4].id, character: "Joker" }, // Dark Knight - Ledger
      { movieId: movies[2].id, castId: cast[5].id, character: "Dom Cobb" }, // Inception - DiCaprio
      { movieId: movies[2].id, castId: cast[6].id, character: "Eames" }, // Inception - Hardy
      { movieId: movies[3].id, castId: cast[7].id, character: "Paul Atreides" }, // Dune - Chalamet
      { movieId: movies[4].id, castId: cast[8].id, character: "Neo" }, // Matrix - Reeves
      { movieId: movies[5].id, castId: cast[9].id, character: "Pete 'Maverick' Mitchell" } // Top Gun - Cruise
    ];

    await Promise.all(
      movieCastAssociations.map(async (assoc) => {
        await db.insert(schema.movieCast).values(assoc);
      })
    );

    console.log(`Created ${movieCastAssociations.length} movie-cast associations`);

    // Create user progress for some movies
    const userProgressData = [
      { userId: user.id, movieId: movies[1].id, progress: 70, completed: false }, // Dark Knight - 70%
      { userId: user.id, movieId: movies[2].id, progress: 30, completed: false }, // Inception - 30%
      { userId: user.id, movieId: movies[3].id, progress: 45, completed: false }, // Dune - 45%
      { userId: user.id, movieId: movies[4].id, progress: 90, completed: false }  // Matrix - 90%
    ];

    await Promise.all(
      userProgressData.map(async (progress) => {
        await db.insert(schema.userProgress).values(progress);
      })
    );

    console.log(`Created ${userProgressData.length} user progress records`);

    // Create achievements based on content catalog requirements
    const achievementsData = [
      {
        title: "Marvel Master",
        description: "Complete watching all Marvel films",
        icon: "award",
        points: 100,
        criteria: JSON.stringify({ type: "franchise", franchiseId: "marvel", required: 10 })
      },
      {
        title: "DC Devotee",
        description: "Complete watching all DC Extended Universe films",
        icon: "star",
        points: 100,
        criteria: JSON.stringify({ type: "franchise", franchiseId: "dc", required: 10 })
      },
      {
        title: "Wick's Witness",
        description: "Complete the John Wick series",
        icon: "award",
        points: 75,
        criteria: JSON.stringify({ type: "franchise", franchiseId: "johnwick", required: 4 })
      },
      {
        title: "Horror Aficionado",
        description: "Watch all horror selections",
        icon: "crown",
        points: 75,
        criteria: JSON.stringify({ type: "genre", genreId: "horror", required: 6 })
      },
      {
        title: "Action Enthusiast",
        description: "Watch 5+ action films",
        icon: "star",
        points: 50,
        criteria: JSON.stringify({ type: "genre", genreId: "action", required: 5 })
      },
      {
        title: "Mystery Solver",
        description: "Watch 3+ mystery films",
        icon: "award",
        points: 50,
        criteria: JSON.stringify({ type: "genre", genreId: "mystery", required: 3 })
      },
      {
        title: "Thrill Seeker",
        description: "Watch 3+ thrillers in a week",
        icon: "star",
        points: 60,
        criteria: JSON.stringify({ type: "genre", genreId: "thriller", required: 3, timeframe: "week" })
      },
      {
        title: "Weekly Watcher",
        description: "Watch content for 7 consecutive days",
        icon: "star",
        points: 50,
        criteria: JSON.stringify({ type: "streak", days: 7 })
      },
      {
        title: "Quiz Champion",
        description: "Score 100% on 5 different movie quizzes",
        icon: "crown",
        points: 75,
        criteria: JSON.stringify({ type: "quiz", count: 5, score: 100 })
      }
    ];

    const achievements = await Promise.all(
      achievementsData.map(async (achievement) => {
        const [inserted] = await db.insert(schema.achievements).values(achievement).returning();
        return inserted;
      })
    );

    console.log(`Created ${achievements.length} achievements`);

    // Create user achievements
    const userAchievementsData = [
      {
        userId: user.id,
        achievementId: achievements[0].id,
        progress: 80,
        completed: false
      },
      {
        userId: user.id,
        achievementId: achievements[1].id,
        progress: 100,
        completed: true,
        completedAt: new Date()
      },
      {
        userId: user.id,
        achievementId: achievements[2].id,
        progress: 40,
        completed: false
      }
    ];

    await Promise.all(
      userAchievementsData.map(async (userAchievement) => {
        await db.insert(schema.userAchievements).values(userAchievement);
      })
    );

    console.log(`Created ${userAchievementsData.length} user achievements`);

    // Create rewards
    const rewardsData = [
      {
        title: "1 Month Premium Subscription",
        description: "Upgrade to premium for 1 month with no ads and exclusive content",
        category: "subscription",
        pointsCost: 500,
        available: true
      },
      {
        title: "Movie Poster",
        description: "Get a high-quality poster of your favorite movie shipped to your address",
        category: "merchandise",
        pointsCost: 1000,
        available: true
      },
      {
        title: "Digital Film Soundtrack",
        description: "Download the complete soundtrack of any film in our collection",
        category: "digital",
        pointsCost: 300,
        available: true
      },
      {
        title: "Early Access Pass",
        description: "Get early access to new releases for 2 weeks",
        category: "digital",
        pointsCost: 750,
        available: true
      }
    ];

    const rewards = await Promise.all(
      rewardsData.map(async (reward) => {
        const [inserted] = await db.insert(schema.rewards).values(reward).returning();
        return inserted;
      })
    );

    console.log(`Created ${rewards.length} rewards`);

    // Create point transactions
    const pointTransactionsData = [
      {
        userId: user.id,
        amount: 500,
        type: "earned",
        description: "Watched 20 movies this month",
        referenceType: "achievement"
      },
      {
        userId: user.id,
        amount: 250,
        type: "earned",
        description: "Completed weekly watcher achievement",
        referenceId: achievements[1].id.toString(),
        referenceType: "achievement"
      },
      {
        userId: user.id,
        amount: 100,
        type: "earned",
        description: "Watched Interstellar",
        referenceId: movies[0].id.toString(),
        referenceType: "movie"
      }
    ];

    await Promise.all(
      pointTransactionsData.map(async (transaction) => {
        await db.insert(schema.pointTransactions).values(transaction);
      })
    );

    console.log(`Created ${pointTransactionsData.length} point transactions`);

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
  }
}

seed();
