// Storage key for modified movies
const STORAGE_KEY = 'movieClubData';

// Get modified movies from localStorage
function getModifiedMovies() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { movies: [], deleted: [] };
}

// Get all movies (including modifications and new additions)
function getAllMovies() {
    const modified = getModifiedMovies();
    let allMovies = [...movies];
    
    // Apply modifications and add new movies
    modified.movies.forEach(mod => {
        const index = allMovies.findIndex(m => m.title === mod.title);
        if (index !== -1) {
            // Update existing movie
            allMovies[index] = { ...allMovies[index], ...mod };
        } else {
            // Add new movie (from add-rating page)
            allMovies.push(mod);
        }
    });
    
    // Filter out deleted movies
    allMovies = allMovies.filter(m => !modified.deleted.includes(m.title));
    
    return allMovies;
}

// Current sort and filter state
let currentSort = 'date-desc';
let currentYear = 'all';
let sortedMovies = [];

// Get rating class based on value
function getRatingClass(value) {
    const num = parseFloat(value);
    if (isNaN(num)) return 'none';
    if (num >= 8) return 'high';
    if (num >= 6) return 'mid';
    return 'low';
}

// Format rating display
function formatRating(rating) {
    if (!rating || rating === '-' || rating === '') return '—';
    return rating;
}

// Get movie poster - uses posters.js with caching
async function fetchPoster(title) {
    return await getPosterUrl(title);
}

// Create movie card HTML
function createMovieCard(movie, index) {
    const ratingClass = getRatingClass(movie.average);
    const members = ['Gabe', 'Isa', 'Shane', 'Bo', 'Andrew', 'Rachel'];
    
    const ratingsHTML = members.map(member => {
        const rating = movie.ratings[member];
        const displayRating = formatRating(rating);
        const ratingClassValue = displayRating === '—' ? 'none' : getRatingClass(rating);
        
        return `
            <div class="rating-item">
                <span class="rating-name">${member}</span>
                <span class="rating-value ${ratingClassValue}">${displayRating}</span>
            </div>
        `;
    }).join('');

    // Format date
    const dateStr = movie.dateAdded ? new Date(movie.dateAdded).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    }) : '';

    const movieUrl = `movie.html?title=${encodeURIComponent(movie.title)}`;
    
    return `
        <article class="movie-card" data-picker="${movie.picker}" style="animation-delay: ${index * 0.05}s">
            <a href="${movieUrl}" class="movie-card-link">
                <div class="poster-container">
                    <img class="poster" 
                         src="https://via.placeholder.com/300x450/1a1a1e/6e6e73?text=Loading..." 
                         alt="${movie.title} poster"
                         data-title="${movie.title}"
                         loading="lazy">
                    <div class="poster-overlay"></div>
                    <div class="average-badge ${ratingClass}">${movie.average.toFixed(1)}</div>
                    <div class="picker-badge">${movie.picker}'s Pick</div>
                </div>
                <div class="movie-info">
                    <h2 class="movie-title">${movie.title}</h2>
                    ${dateStr ? `<div class="movie-date">${dateStr}</div>` : ''}
                    <div class="ratings-grid">
                        ${ratingsHTML}
                    </div>
                </div>
            </a>
        </article>
    `;
}

// Filter movies by year
function filterMoviesByYear(movies, year) {
    if (year === 'all') return movies;
    
    return movies.filter(movie => {
        if (!movie.dateAdded) return false;
        const movieYear = new Date(movie.dateAdded).getFullYear();
        return movieYear === parseInt(year);
    });
}

// Sort movies based on current sort option
function sortMovies(sortType, year = currentYear) {
    currentSort = sortType;
    currentYear = year;
    let allMovies = getAllMovies();
    
    // Apply year filter first
    allMovies = filterMoviesByYear(allMovies, currentYear);
    
    switch (sortType) {
        case 'date-desc':
            // Most recent first
            sortedMovies = [...allMovies].sort((a, b) => {
                const dateA = a.dateAdded ? new Date(a.dateAdded) : new Date(0);
                const dateB = b.dateAdded ? new Date(b.dateAdded) : new Date(0);
                return dateB - dateA;
            });
            break;
        case 'date-asc':
            // Oldest first
            sortedMovies = [...allMovies].sort((a, b) => {
                const dateA = a.dateAdded ? new Date(a.dateAdded) : new Date(0);
                const dateB = b.dateAdded ? new Date(b.dateAdded) : new Date(0);
                return dateA - dateB;
            });
            break;
        case 'rating-desc':
            // Highest rated first
            sortedMovies = [...allMovies].sort((a, b) => b.average - a.average);
            break;
        case 'rating-asc':
            // Lowest rated first
            sortedMovies = [...allMovies].sort((a, b) => a.average - b.average);
            break;
        case 'title-asc':
            // A to Z
            sortedMovies = [...allMovies].sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'title-desc':
            // Z to A
            sortedMovies = [...allMovies].sort((a, b) => b.title.localeCompare(a.title));
            break;
        default:
            sortedMovies = [...allMovies].sort((a, b) => {
                const dateA = a.dateAdded ? new Date(a.dateAdded) : new Date(0);
                const dateB = b.dateAdded ? new Date(b.dateAdded) : new Date(0);
                return dateB - dateA;
            });
    }
    
    return sortedMovies;
}

// Render all movies
function renderMovies() {
    const grid = document.getElementById('movie-grid');
    grid.innerHTML = sortedMovies.map((movie, index) => createMovieCard(movie, index)).join('');
    
    // Update stats based on currently filtered movies
    document.getElementById('movie-count').textContent = sortedMovies.length;
    const avgRating = sortedMovies.length > 0 
        ? sortedMovies.reduce((sum, m) => sum + m.average, 0) / sortedMovies.length 
        : 0;
    document.getElementById('avg-rating').textContent = avgRating.toFixed(1);
    
    // Load posters
    loadPosters();
    
    // Re-apply current filter
    reapplyFilter();
}

// Re-apply current filter after sorting
function reapplyFilter() {
    const activeFilter = document.querySelector('.filter-btn.active');
    if (activeFilter) {
        const filter = activeFilter.dataset.filter;
        const cards = document.querySelectorAll('.movie-card');
        
        cards.forEach((card, index) => {
            if (filter === 'all' || card.dataset.picker === filter) {
                card.classList.remove('hidden');
                card.style.animationDelay = `${index * 0.03}s`;
            } else {
                card.classList.add('hidden');
            }
        });
    }
}

// Load all posters
async function loadPosters() {
    const posterImages = document.querySelectorAll('.poster[data-title]');
    
    // Load posters in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < posterImages.length; i += batchSize) {
        const batch = Array.from(posterImages).slice(i, i + batchSize);
        await Promise.all(batch.map(async (img) => {
            const title = img.dataset.title;
            const posterUrl = await fetchPoster(title);
            img.src = posterUrl;
            img.onerror = () => {
                img.src = `https://via.placeholder.com/300x450/1a1a1e/6e6e73?text=${encodeURIComponent(title)}`;
            };
        }));
    }
}

// Filter movies by picker
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            const cards = document.querySelectorAll('.movie-card');
            
            cards.forEach((card, index) => {
                if (filter === 'all' || card.dataset.picker === filter) {
                    card.classList.remove('hidden');
                    card.style.animationDelay = `${index * 0.03}s`;
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// Setup sort and year selects
function setupSort() {
    const sortSelect = document.getElementById('sort-select');
    
    sortSelect.addEventListener('change', () => {
        sortMovies(sortSelect.value, currentYear);
        renderMovies();
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize with default sort (most recent first)
    sortMovies('date-desc');
    renderMovies();
    setupFilters();
    setupSort();
});

