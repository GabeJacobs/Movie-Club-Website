// OMDB API key
const OMDB_API_KEY = '3e974fca';

// DOM Elements
const searchInput = document.getElementById('movie-search');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
const ratingSection = document.getElementById('rating-section');
const ratingForm = document.getElementById('rating-form');
const clearBtn = document.getElementById('clear-btn');
const ratingsList = document.getElementById('ratings-list');
const noRatings = document.getElementById('no-ratings');
const toast = document.getElementById('toast');

// Selected movie data
let selectedMovie = null;

// Load saved ratings from Firebase
async function loadSavedRatings() {
    try {
        return await fbGetAllMovies();
    } catch (error) {
        console.warn('Firebase unavailable:', error);
        return [];
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Search for movies
async function searchMovies(query) {
    if (!query.trim()) {
        searchResults.innerHTML = '';
        return;
    }

    searchResults.innerHTML = '<div class="search-loading">Searching...</div>';

    try {
        const response = await fetch(
            `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&type=movie&apikey=${OMDB_API_KEY}`
        );
        const data = await response.json();

        if (data.Response === 'True') {
            displaySearchResults(data.Search);
        } else {
            searchResults.innerHTML = `<div class="search-error">No movies found. Try a different search term.</div>`;
        }
    } catch (error) {
        searchResults.innerHTML = `<div class="search-error">Search failed. Please try again.</div>`;
        console.error('Search error:', error);
    }
}

// Display search results
function displaySearchResults(movies) {
    searchResults.innerHTML = movies.slice(0, 8).map(movie => `
        <div class="search-result-item" data-imdbid="${movie.imdbID}">
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/50x75/1a1a1e/6e6e73?text=?'}" 
                 alt="${movie.Title}">
            <div class="search-result-info">
                <h4>${movie.Title}</h4>
                <span>${movie.Year}</span>
            </div>
        </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => selectMovie(item.dataset.imdbid));
    });
}

// Select a movie and fetch full details
async function selectMovie(imdbId) {
    searchResults.innerHTML = '<div class="search-loading">Loading movie details...</div>';

    try {
        const response = await fetch(
            `https://www.omdbapi.com/?i=${imdbId}&plot=short&apikey=${OMDB_API_KEY}`
        );
        const movie = await response.json();

        if (movie.Response === 'True') {
            selectedMovie = movie;
            displaySelectedMovie(movie);
            searchResults.innerHTML = '';
            searchInput.value = '';
        } else {
            searchResults.innerHTML = `<div class="search-error">Could not load movie details.</div>`;
        }
    } catch (error) {
        searchResults.innerHTML = `<div class="search-error">Failed to load movie. Please try again.</div>`;
        console.error('Movie fetch error:', error);
    }
}

// Display selected movie
function displaySelectedMovie(movie) {
    document.getElementById('selected-poster').src = 
        movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/180x270/1a1a1e/6e6e73?text=No+Poster';
    document.getElementById('selected-poster').alt = movie.Title;
    document.getElementById('selected-title').textContent = movie.Title;
    document.getElementById('selected-year').textContent = movie.Year;
    document.getElementById('selected-director').textContent = movie.Director !== 'N/A' ? movie.Director : '';
    document.getElementById('selected-runtime').textContent = movie.Runtime !== 'N/A' ? movie.Runtime : '';
    document.getElementById('selected-plot').textContent = movie.Plot !== 'N/A' ? movie.Plot : '';

    ratingSection.classList.remove('hidden');
    ratingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Clear form
function clearForm() {
    selectedMovie = null;
    ratingSection.classList.add('hidden');
    document.getElementById('picker').value = '';
    ['gabe', 'shane', 'bo', 'andrew', 'rachel'].forEach(name => {
        document.getElementById(`rating-${name}`).value = '';
    });
}

// Calculate average rating
function calculateAverage(ratings) {
    const values = Object.values(ratings).filter(v => v && v !== '-' && v !== '');
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + parseFloat(val), 0);
    return sum / values.length;
}

// Get rating class
function getRatingClass(value) {
    if (value >= 8) return 'high';
    if (value >= 6) return 'mid';
    return 'low';
}

// Submit rating
async function submitRating(e) {
    e.preventDefault();

    if (!selectedMovie) {
        showToast('Please select a movie first', 'error');
        return;
    }

    const picker = document.getElementById('picker').value;
    if (!picker) {
        showToast('Please select who picked this film', 'error');
        return;
    }

    const ratings = {
        Gabe: document.getElementById('rating-gabe').value || '',
        Isa: '',
        Shane: document.getElementById('rating-shane').value || '',
        Bo: document.getElementById('rating-bo').value || '',
        Andrew: document.getElementById('rating-andrew').value || '',
        Rachel: document.getElementById('rating-rachel').value || ''
    };

    // Check if at least one rating is provided
    const hasRating = Object.values(ratings).some(v => v !== '');
    if (!hasRating) {
        showToast('Please enter at least one rating', 'error');
        return;
    }

    const average = calculateAverage(ratings);

    const newMovie = {
        title: selectedMovie.Title,
        picker: picker,
        ratings: ratings,
        average: parseFloat(average.toFixed(2)),
        dateAdded: new Date().toISOString()
    };

    try {
        // Save to Firebase
        await fbAddMovie(newMovie);
        
        // Update display
        await renderSavedRatings();
        clearForm();
        showToast(`"${newMovie.title}" has been saved!`, 'success');
    } catch (error) {
        console.error('Failed to save movie:', error);
        showToast('Failed to save. Please try again.', 'error');
    }
}

// Delete a saved rating by title
async function deleteRating(title) {
    try {
        await fbDeleteMovie(title);
        await renderSavedRatings();
        showToast('Rating removed', 'success');
    } catch (error) {
        console.error('Failed to delete:', error);
        showToast('Failed to delete. Please try again.', 'error');
    }
}

// Render recently added movies from Firebase
async function renderSavedRatings() {
    const allMovies = await loadSavedRatings();

    // Show the 10 most recently added movies
    const recentMovies = [...allMovies]
        .filter(m => m.dateAdded)
        .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
        .slice(0, 10);

    if (recentMovies.length === 0) {
        noRatings.style.display = 'block';
        ratingsList.innerHTML = '';
        return;
    }

    noRatings.style.display = 'none';

    const items = [];
    for (const rating of recentMovies) {
        const miniRatings = Object.entries(rating.ratings)
            .filter(([_, v]) => v && v !== '-')
            .map(([name, value]) => `<span class="mini-rating">${name}: <span>${value}</span></span>`)
            .join('');

        const posterUrl = await getPosterUrl(rating.title);

        items.push(`
            <div class="saved-rating-item">
                <img src="${posterUrl}" alt="${rating.title}">
                <div class="saved-rating-info">
                    <span class="picker-tag">${rating.picker}'s Pick</span>
                    <h4>${rating.title}</h4>
                    <div class="mini-ratings">${miniRatings}</div>
                </div>
                <div class="saved-rating-avg ${getRatingClass(rating.average)}">${rating.average.toFixed(1)}</div>
                <button class="delete-btn" onclick="deleteRating('${rating.title.replace(/'/g, "\\'")}')" title="Remove rating">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `);
    }
    ratingsList.innerHTML = items.join('');
}

// Event Listeners
searchBtn.addEventListener('click', () => searchMovies(searchInput.value));
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        searchMovies(searchInput.value);
    }
});

// Debounced live search
let searchTimeout;
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        if (searchInput.value.length >= 3) {
            searchMovies(searchInput.value);
        } else if (searchInput.value.length === 0) {
            searchResults.innerHTML = '';
        }
    }, 500);
});

clearBtn.addEventListener('click', clearForm);
ratingForm.addEventListener('submit', submitRating);

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Ensure Firebase is populated, then show recent
    await fbMigrateIfNeeded();
    await renderSavedRatings();
});


