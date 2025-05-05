// Movie thumbnails that better match their titles

const movieThumbnails = {
  // Marvel Movies
  'Iron Man': 'https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
  'The Incredible Hulk': 'https://image.tmdb.org/t/p/w500/gKzYx79y0AQTL4UAk1cBQJ3nvrm.jpg',
  'Iron Man 2': 'https://image.tmdb.org/t/p/w500/6WBeq4fCfn7AN0o21hpHHUJG9bC.jpg',
  'Thor': 'https://image.tmdb.org/t/p/w500/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg',
  'Captain America: The First Avenger': 'https://image.tmdb.org/t/p/w500/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg',
  'The Avengers': 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
  'Iron Man 3': 'https://image.tmdb.org/t/p/w500/qhPtAc1TKbMPqNvcdXSOn9Bn7hZ.jpg',
  'Thor: The Dark World': 'https://image.tmdb.org/t/p/w500/wp6OxE4poJ4G7c0U2ZIXasTSMR7.jpg',
  'Captain America: The Winter Soldier': 'https://image.tmdb.org/t/p/w500/5TQ6YDmymBpnF005OyoB7ohZps9.jpg',
  'Guardians of the Galaxy': 'https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg',
  'Avengers: Age of Ultron': 'https://image.tmdb.org/t/p/w500/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg',
  'Ant-Man': 'https://image.tmdb.org/t/p/w500/rS97hUJ1otKTTripGwQ0ujbuIri.jpg',
  'Captain America: Civil War': 'https://image.tmdb.org/t/p/w500/7FWlcZq3r6525LWOcvO9kNWurN1.jpg',
  'Doctor Strange': 'https://image.tmdb.org/t/p/w500/xf8PbyQcR5ucXErmZNzdKR0s8ya.jpg',
  'Guardians of the Galaxy Vol. 2': 'https://image.tmdb.org/t/p/w500/y4MBh0EjBlMuOzv9axM4qJlmhzz.jpg',
  'Thor: Ragnarok': 'https://image.tmdb.org/t/p/w500/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg',
  'Black Panther': 'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg',
  'Avengers: Infinity War': 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
  'Ant-Man and the Wasp': 'https://image.tmdb.org/t/p/w500/eivQmS3wqzqnQWILHLc4FsEfcXP.jpg',
  'Captain Marvel': 'https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg',
  'Avengers: Endgame': 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
  
  // DC Movies
  'Man of Steel': 'https://image.tmdb.org/t/p/w500/8XDLgSlM6hDRqkAIyKdHKJx5J5b.jpg',
  'Batman v Superman: Dawn of Justice': 'https://image.tmdb.org/t/p/w500/5UsK3grJvtQrtzEgqNlDljJW96w.jpg',
  'Suicide Squad': 'https://image.tmdb.org/t/p/w500/xFw9RXKZDvevAGocgBK0zteto4U.jpg',
  'Wonder Woman': 'https://image.tmdb.org/t/p/w500/gfJGlDaHuWimErCr5Ql0I8x9QSy.jpg',
  'Justice League': 'https://image.tmdb.org/t/p/w500/eifGNCSDuxJeS1loAXil5bIGgvC.jpg',
  'Aquaman': 'https://image.tmdb.org/t/p/w500/5Kg76ldv7VxeX9YlcQXiowHgdX6.jpg',
  'Shazam!': 'https://image.tmdb.org/t/p/w500/xnopI5Xtky18MPhK40cZAGAOVeV.jpg',
  'Birds of Prey': 'https://image.tmdb.org/t/p/w500/h4VB6m0RwcicVEZvzftYZyKXs6K.jpg',
  'The Dark Knight': 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  
  // John Wick Movies
  'John Wick': 'https://image.tmdb.org/t/p/w500/wXqWR7dHncNRbxoEGybEy7QTe9h.jpg',
  'John Wick: Chapter 2': 'https://image.tmdb.org/t/p/w500/hXWBc0ioZP3cN4zCu6SN3YHXZVO.jpg',
  'John Wick: Chapter 3 - Parabellum': 'https://image.tmdb.org/t/p/w500/ziEuG1essDuWuC5lpWUaw1uXY2O.jpg',
  'John Wick: Chapter 4': 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
  
  // Horror Movies
  'Hereditary': 'https://image.tmdb.org/t/p/w500/4GFPuL14eXi66V96xBWY73Y9PfR.jpg',
  'The Witch': 'https://image.tmdb.org/t/p/w500/zap5hpFCWSQi7Y8XOWCKJCzR5F.jpg',
  'Midsommar': 'https://image.tmdb.org/t/p/w500/rXsh4MI6uyVgZsKbCvrJRxiXgTP.jpg',
  'Get Out': 'https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfxGo4L5ZMJcjdL.jpg',
  'The Lighthouse': 'https://image.tmdb.org/t/p/w500/3oIT5AdzMz5H7o6LrsKZxnT6CxC.jpg',
  
  // Critically Acclaimed Movies
  'Interstellar': 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  'Inception': 'https://image.tmdb.org/t/p/w500/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg',
  'The Matrix': 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
  'Dune': 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
  'Oppenheimer': 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'
};

// Export the thumbnails
module.exports = movieThumbnails;