// OMDB API key
const OMDB_API_KEY = 'd64a5f81';

// Get poster cache from localStorage
const posterCache = JSON.parse(localStorage.getItem('moviePosterCache') || '{}');

// Title mappings for movies that need specific search terms
// Use { title, year } for year-based searches, { imdbId } for direct IMDB lookup, or just a string for title changes
const titleMappings = {
    "A Hero": { title: "A Hero", year: "2021" },
    "The Witch": { title: "The Witch", year: "2015" },
    "Black Girl": { title: "Black Girl", year: "1966" },
    "Mirror": { title: "Mirror", year: "1975" },
    "The Haunting": { title: "The Haunting", year: "1963" },
    "The Boys Next Door": { title: "The Boys Next Door", year: "1996" },
    "Mulholland Dr": "Mulholland Drive",
    "A Tale of Summer": { title: "A Summer's Tale", year: "1996" },
    "La Llorona": { title: "La Llorona", year: "2019" },
    "Point Blank": { title: "Point Blank", year: "1967" },
    "Ghost in the Shell": { imdbId: "tt0113568" },
    "Jonathan": { title: "Jonathan", year: "1970" },
    "Kaili Blues": { imdbId: "tt4613272" },
    "Cold War": { title: "Cold War", year: "2018" },
    "The Wild Robot": { title: "The Wild Robot", year: "2024" },
    "Cries and Whispers": { imdbId: "tt0069467" },
    "Burning": { title: "Burning", year: "2018" },
    "Blowup": "Blow-Up",
    "Killers of Sheep": "Killer of Sheep",
    "A Swedish Love Story": { imdbId: "tt0065955" }
};

// Queue for rate-limiting API requests
let requestQueue = [];
let isProcessingQueue = false;

async function processQueue() {
    if (isProcessingQueue || requestQueue.length === 0) return;
    
    isProcessingQueue = true;
    
    while (requestQueue.length > 0) {
        const { title, resolve } = requestQueue.shift();
        const poster = await fetchPosterFromAPI(title);
        resolve(poster);
        // Small delay between requests to avoid rate limiting
        await new Promise(r => setTimeout(r, 100));
    }
    
    isProcessingQueue = false;
}

async function fetchPosterFromAPI(title) {
    const mapping = titleMappings[title];
    let url;
    
    if (mapping && typeof mapping === 'object') {
        if (mapping.directUrl) {
            // Direct poster URL provided
            posterCache[title] = mapping.directUrl;
            localStorage.setItem('moviePosterCache', JSON.stringify(posterCache));
            return mapping.directUrl;
        } else if (mapping.imdbId) {
            // Direct IMDB ID lookup
            url = `https://www.omdbapi.com/?i=${mapping.imdbId}&apikey=${OMDB_API_KEY}`;
        } else {
            // Year-based search
            url = `https://www.omdbapi.com/?t=${encodeURIComponent(mapping.title)}&y=${mapping.year}&apikey=${OMDB_API_KEY}`;
        }
    } else {
        // Simple title search (with optional title mapping)
        const searchTitle = mapping || title;
        url = `https://www.omdbapi.com/?t=${encodeURIComponent(searchTitle)}&apikey=${OMDB_API_KEY}`;
    }
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.Poster && data.Poster !== 'N/A') {
            // Cache the result
            posterCache[title] = data.Poster;
            localStorage.setItem('moviePosterCache', JSON.stringify(posterCache));
            return data.Poster;
        }
    } catch (error) {
        console.error(`Failed to fetch poster for ${title}:`, error);
    }
    
    // Return placeholder if no poster found
    return `https://via.placeholder.com/300x450/1a1a1e/6e6e73?text=${encodeURIComponent(title)}`;
}

// Function to get poster URL (with caching)
function getPosterUrl(title) {
    // Check cache first
    if (posterCache[title]) {
        return Promise.resolve(posterCache[title]);
    }
    
    // Add to queue for rate-limited fetching
    return new Promise((resolve) => {
        requestQueue.push({ title, resolve });
        processQueue();
    });
}

// Helper function to clear cache for specific movies (for debugging)
function clearPosterCache(titles) {
    titles.forEach(title => {
        delete posterCache[title];
    });
    localStorage.setItem('moviePosterCache', JSON.stringify(posterCache));
    console.log('Cleared cache for:', titles);
}

// Auto-clear cache for movies with updated mappings on page load
(function() {
    const moviesToRefresh = ['Kaili Blues'];
    // Clear cache if any of these movies are cached (to ensure updated mappings are used)
    const cachedMovies = moviesToRefresh.filter(title => posterCache[title]);
    
    if (cachedMovies.length > 0) {
        clearPosterCache(cachedMovies);
    }
})();
