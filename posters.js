// OMDB API key
const OMDB_API_KEY = 'd64a5f81';

// Get poster cache from localStorage
const posterCache = JSON.parse(localStorage.getItem('moviePosterCache') || '{}');

// Title mappings for movies that need specific search terms
// Use { title, year } for year-based searches, { imdbId } for direct IMDB lookup, or just a string for title change
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
    "Jonathan": { imdbId: "tt0065917" },
    "Kaili Blues": { imdbId: "tt4613272" },
    "Cold War": { title: "Cold War", year: "2018" },
    "The Wild Robot": { title: "The Wild Robot", year: "2024" },
    "Cries and Whispers": { imdbId: "tt0069467" },
    "Burning": { title: "Burning", year: "2018" },
    "Blowup": "Blow-Up",
    "Killers of Sheep": "Killer of Sheep",
    "A Swedish Love Story": { imdbId: "tt0065955" }
};

// Check if a URL is a real poster (not a placeholder)
function isRealPosterUrl(url) {
    if (!url) return false;
    if (url.includes('via.placeholder.com')) return false;
    if (url.includes('text=Loading')) return false;
    if (url === 'N/A') return false;
    return true;
}

// Queue for rate-limiting API requests
let requestQueue = [];
let isProcessingQueue = false;

async function processQueue() {
    if (isProcessingQueue || requestQueue.length === 0) return;
    
    isProcessingQueue = true;
    
    while (requestQueue.length > 0) {
        const { title, fallbackPoster, resolve } = requestQueue.shift();
        const poster = await fetchPosterFromAPI(title, fallbackPoster);
        resolve(poster);
        // Small delay between requests to avoid rate limiting
        await new Promise(r => setTimeout(r, 100));
    }
    
    isProcessingQueue = false;
}

async function fetchPosterFromAPI(title, fallbackPoster, retryCount = 0) {
    const mapping = titleMappings[title];
    let url;
    
    if (mapping && typeof mapping === 'object') {
        if (mapping.directUrl) {
            posterCache[title] = mapping.directUrl;
            localStorage.setItem('moviePosterCache', JSON.stringify(posterCache));
            return mapping.directUrl;
        } else if (mapping.imdbId) {
            url = `https://www.omdbapi.com/?i=${mapping.imdbId}&apikey=${OMDB_API_KEY}`;
        } else {
            url = `https://www.omdbapi.com/?t=${encodeURIComponent(mapping.title)}&y=${mapping.year}&apikey=${OMDB_API_KEY}`;
        }
    } else {
        const searchTitle = mapping || title;
        url = `https://www.omdbapi.com/?t=${encodeURIComponent(searchTitle)}&apikey=${OMDB_API_KEY}`;
    }
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.Poster && data.Poster !== 'N/A') {
            posterCache[title] = data.Poster;
            localStorage.setItem('moviePosterCache', JSON.stringify(posterCache));
            return data.Poster;
        }
    } catch (error) {
        console.error(`Failed to fetch poster for ${title}:`, error);
        // Retry once on network errors
        if (retryCount < 1) {
            await new Promise(r => setTimeout(r, 500));
            return fetchPosterFromAPI(title, fallbackPoster, retryCount + 1);
        }
    }
    
    // If API failed or returned no poster, use the fallback poster from the movie data
    if (isRealPosterUrl(fallbackPoster)) {
        posterCache[title] = fallbackPoster;
        localStorage.setItem('moviePosterCache', JSON.stringify(posterCache));
        return fallbackPoster;
    }
    
    // Last resort: generate a styled text placeholder (not cached, so it retries next time)
    return generateFallbackPoster(title);
}

// Generate a fallback poster URL using placehold.co with a film-like appearance
function generateFallbackPoster(title) {
    return `https://via.placeholder.com/300x450/1a1a1e/6e6e73?text=${encodeURIComponent(title)}`;
}

// Function to get poster URL (with caching and fallback support)
// fallbackPoster: optional direct poster URL (e.g. from movie data stored in localStorage)
function getPosterUrl(title, fallbackPoster) {
    // Check cache first, but only if the cached value is a real poster URL
    if (posterCache[title] && isRealPosterUrl(posterCache[title])) {
        return Promise.resolve(posterCache[title]);
    }
    
    // Add to queue for rate-limited fetching
    return new Promise((resolve) => {
        requestQueue.push({ title, fallbackPoster, resolve });
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

// On page load, purge any cached placeholder URLs so they get refetched
(function() {
    let purged = [];
    Object.keys(posterCache).forEach(title => {
        if (!isRealPosterUrl(posterCache[title])) {
            delete posterCache[title];
            purged.push(title);
        }
    });
    if (purged.length > 0) {
        localStorage.setItem('moviePosterCache', JSON.stringify(posterCache));
        console.log('Purged bad cached posters for:', purged);
    }
})();
