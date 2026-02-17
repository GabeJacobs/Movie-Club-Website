// TMDB API configuration
const TMDB_API_KEY = '90691b03278e1946fd03e6af62d75968';
const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MDY5MWIwMzI3OGUxOTQ2ZmQwM2U2YWY2MmQ3NTk2OCIsIm5iZiI6MTc3MTMwMTY3Mi44MzM5OTk5LCJzdWIiOiI2OTkzZWIyODg3ZDQxNGQ4YmExMjRlODYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.PcJM2VfQRCZwauZ15Fjxj5HY2lrApioBRkDKP9O06Jk';
const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w500';

// Get poster cache from localStorage
const posterCache = JSON.parse(localStorage.getItem('moviePosterCache') || '{}');

// Title mappings for movies that need specific search terms
// Use { title, year } for search overrides, { imdbId } for IMDB lookup, or just a string for title change
const titleMappings = {
    "A Hero": { title: "A Hero", year: "2021" },
    "The Witch": { title: "The Witch", year: "2015" },
    "Black Girl": { title: "Black Girl", year: "1966" },
    "Mirror": { title: "Mirror", year: "1975" },
    "The Haunting": { title: "The Haunting", year: "1963" },
    "The Boys Next Door": { imdbId: "tt0090770" },
    "Mulholland Dr": "Mulholland Drive",
    "A Tale of Summer": { title: "A Summer's Tale", year: "1996" },
    "La Llorona": { title: "La Llorona", year: "2019" },
    "Point Blank": { title: "Point Blank", year: "1967" },
    "Ghost in the Shell": { title: "Ghost in the Shell", year: "1995" },
    "Jonathan": { imdbId: "tt0065917" },
    "Kaili Blues": { imdbId: "tt4613272" },
    "Cold War": { title: "Cold War", year: "2018" },
    "The Wild Robot": { title: "The Wild Robot", year: "2024" },
    "Cries and Whispers": { title: "Cries and Whispers", year: "1972" },
    "Burning": { title: "Burning", year: "2018" },
    "Blowup": "Blow-Up",
    "Killers of Sheep": "Killer of Sheep",
    "A Swedish Love Story": { title: "A Swedish Love Story", year: "1970" }
};

// Check if a URL is a real poster (not a placeholder)
function isRealPosterUrl(url) {
    if (!url) return false;
    if (url.includes('via.placeholder.com')) return false;
    if (url.includes('text=Loading')) return false;
    if (url === 'N/A') return false;
    return true;
}

// TMDB fetch helper
async function tmdbFetch(endpoint) {
    const response = await fetch(`https://api.themoviedb.org/3${endpoint}`, {
        headers: { 'Authorization': `Bearer ${TMDB_TOKEN}` }
    });
    return response.json();
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
        await new Promise(r => setTimeout(r, 50));
    }

    isProcessingQueue = false;
}

async function fetchPosterFromAPI(title, fallbackPoster, retryCount = 0) {
    const mapping = titleMappings[title];

    try {
        let posterPath = null;

        if (mapping && typeof mapping === 'object' && mapping.imdbId) {
            // Look up by IMDB ID
            const data = await tmdbFetch(`/find/${mapping.imdbId}?external_source=imdb_id`);
            if (data.movie_results && data.movie_results.length > 0) {
                posterPath = data.movie_results[0].poster_path;
            }
        } else {
            // Search by title (with optional mapping)
            let searchTitle = title;
            let searchYear = '';

            if (mapping && typeof mapping === 'object') {
                searchTitle = mapping.title || title;
                searchYear = mapping.year || '';
            } else if (typeof mapping === 'string') {
                searchTitle = mapping;
            }

            let url = `/search/movie?query=${encodeURIComponent(searchTitle)}`;
            if (searchYear) url += `&year=${searchYear}`;

            const data = await tmdbFetch(url);
            if (data.results && data.results.length > 0) {
                posterPath = data.results[0].poster_path;
            }
        }

        if (posterPath) {
            const fullUrl = `${TMDB_IMG_BASE}${posterPath}`;
            posterCache[title] = fullUrl;
            localStorage.setItem('moviePosterCache', JSON.stringify(posterCache));
            return fullUrl;
        }
    } catch (error) {
        console.error(`Failed to fetch poster for ${title}:`, error);
        if (retryCount < 1) {
            await new Promise(r => setTimeout(r, 500));
            return fetchPosterFromAPI(title, fallbackPoster, retryCount + 1);
        }
    }

    // Use fallback poster from movie data if available
    if (isRealPosterUrl(fallbackPoster)) {
        posterCache[title] = fallbackPoster;
        localStorage.setItem('moviePosterCache', JSON.stringify(posterCache));
        return fallbackPoster;
    }

    // Last resort placeholder (not cached, so it retries next time)
    return `https://via.placeholder.com/300x450/1a1a1e/6e6e73?text=${encodeURIComponent(title)}`;
}

// Get poster URL (with caching and fallback support)
function getPosterUrl(title, fallbackPoster) {
    if (posterCache[title] && isRealPosterUrl(posterCache[title])) {
        return Promise.resolve(posterCache[title]);
    }

    return new Promise((resolve) => {
        requestQueue.push({ title, fallbackPoster, resolve });
        processQueue();
    });
}

// Helper to clear cache for specific movies
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
