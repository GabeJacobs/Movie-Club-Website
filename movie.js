// Get all movies from Firebase (falls back to static movies.js)
async function getAllMovies() {
    try {
        await fbMigrateIfNeeded();
        return await fbGetAllMovies();
    } catch (error) {
        console.warn('Firebase unavailable, using static data:', error);
        return [...movies];
    }
}

// Get movie title from URL
function getMovieTitleFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('title');
}

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

// Parse rating to number
function parseRating(rating) {
    if (!rating || rating === '-' || rating === '') return null;
    // Handle "High 9" type ratings
    const match = rating.toString().match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : null;
}

// Find movie by title
async function findMovie(title) {
    const allMovies = await getAllMovies();
    return allMovies.find(m => m.title.toLowerCase() === title.toLowerCase());
}

// Update movie ratings
async function updateMovieRatings(title, newRatings) {
    const members = ['Gabe', 'Isa', 'Shane', 'Bo', 'Andrew', 'Rachel'];
    const validRatings = members
        .map(m => parseRating(newRatings[m]))
        .filter(r => r !== null);
    const average = validRatings.length > 0 
        ? validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length 
        : 0;
    
    await fbUpdateMovie(title, {
        ratings: newRatings,
        average: parseFloat(average.toFixed(2))
    });
}

// Delete movie
async function deleteMovie(title) {
    await fbDeleteMovie(title);
}

// Create movie detail HTML
function createMovieDetailHTML(movie) {
    const members = ['Gabe', 'Isa', 'Shane', 'Bo', 'Andrew', 'Rachel'];
    const ratingClass = getRatingClass(movie.average);
    
    // Calculate stats
    const validRatings = members
        .map(m => parseRating(movie.ratings[m]))
        .filter(r => r !== null);
    
    const highestRating = validRatings.length > 0 ? Math.max(...validRatings) : 0;
    const lowestRating = validRatings.length > 0 ? Math.min(...validRatings) : 0;
    const ratingSpread = highestRating - lowestRating;
    const voterCount = validRatings.length;

    // Find who gave highest and lowest
    let highestRater = '';
    let lowestRater = '';
    members.forEach(m => {
        const rating = parseRating(movie.ratings[m]);
        if (rating === highestRating && !highestRater) highestRater = m;
        if (rating === lowestRating && !lowestRater) lowestRater = m;
    });

    // Create rating bars HTML
    const ratingBarsHTML = members.map(member => {
        const rating = movie.ratings[member];
        const numericRating = parseRating(rating);
        const displayRating = formatRating(rating);
        const ratingClass = displayRating === '—' ? 'none' : getRatingClass(numericRating);
        const barWidth = numericRating !== null ? (numericRating / 10) * 100 : 0;
        
        return `
            <div class="rating-bar-item">
                <span class="rating-bar-name">${member}</span>
                <div class="rating-bar-container">
                    <div class="rating-bar ${ratingClass}" style="width: 0%" data-width="${barWidth}%"></div>
                </div>
                <span class="rating-bar-score ${ratingClass}">${displayRating}</span>
            </div>
        `;
    }).join('');

    // Check if movie is favorited
    const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
    const isFavorited = favorites.includes(movie.title);

    return `
        <div class="detail-poster-section">
            <div class="detail-poster-container">
                <img class="detail-poster" 
                     src="https://via.placeholder.com/380x570/1a1a1e/6e6e73?text=Loading..." 
                     alt="${movie.title} poster"
                     id="movie-poster">
                <div class="detail-average-badge ${ratingClass}">
                    <span class="score">${movie.average.toFixed(1)}</span>
                    <span class="label">Average</span>
                </div>
            </div>
        </div>
        
        <div class="detail-info">
            <span class="detail-picker">${movie.picker}'s Pick</span>
            <h1 class="detail-title">${movie.title}</h1>
            
            <div class="detail-meta">
                <span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    ${voterCount} ratings
                </span>
                <span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    ${movie.average.toFixed(1)} avg
                </span>
                ${movie.dateAdded ? `<span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    ${new Date(movie.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>` : ''}
            </div>

            <div class="ratings-section">
                <h2 class="ratings-section-title">Individual Ratings</h2>
                <div class="ratings-bars">
                    ${ratingBarsHTML}
                </div>

                <div class="rating-stats">
                    <div class="rating-stat">
                        <div class="rating-stat-value">${highestRating}</div>
                        <div class="rating-stat-label">Highest (${highestRater})</div>
                    </div>
                    <div class="rating-stat">
                        <div class="rating-stat-value">${lowestRating}</div>
                        <div class="rating-stat-label">Lowest (${lowestRater})</div>
                    </div>
                    <div class="rating-stat">
                        <div class="rating-stat-value">${ratingSpread.toFixed(1)}</div>
                        <div class="rating-stat-label">Spread</div>
                    </div>
                </div>
            </div>

            <div class="movie-actions">
                <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" id="favorite-btn" data-title="${movie.title}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    ${isFavorited ? 'Saved to Favorites' : 'Add to Favorites'}
                </button>
                
                <button class="edit-btn" id="edit-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit Ratings
                </button>
                
                <button class="delete-btn" id="delete-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                    Delete Movie
                </button>
            </div>
        </div>
    `;
}

// Show not found message
function showNotFound() {
    const container = document.getElementById('movie-detail');
    container.innerHTML = `
        <div class="movie-not-found">
            <h2>Movie Not Found</h2>
            <p>We couldn't find the movie you're looking for.</p>
            <a href="index.html">Browse All Films</a>
        </div>
    `;
}

// Load movie poster
async function loadPoster(title, storedPoster) {
    const posterImg = document.getElementById('movie-poster');
    if (posterImg) {
        const posterUrl = await getPosterUrl(title, storedPoster || undefined);
        posterImg.src = posterUrl;
        posterImg.onerror = () => {
            if (storedPoster && posterImg.src !== storedPoster) {
                posterImg.src = storedPoster;
            } else {
                posterImg.src = `https://via.placeholder.com/380x570/1a1a1e/6e6e73?text=${encodeURIComponent(title)}`;
            }
        };
    }
}

// Animate rating bars
function animateRatingBars() {
    const bars = document.querySelectorAll('.rating-bar');
    setTimeout(() => {
        bars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.width = bar.dataset.width;
            }, index * 100);
        });
    }, 300);
}

// Toggle favorite
function toggleFavorite(title) {
    let favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
    const btn = document.getElementById('favorite-btn');
    
    if (favorites.includes(title)) {
        favorites = favorites.filter(t => t !== title);
        btn.classList.remove('favorited');
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            Add to Favorites
        `;
    } else {
        favorites.push(title);
        btn.classList.add('favorited');
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            Saved to Favorites
        `;
    }
    
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
}

// Show edit modal
function showEditModal(movie) {
    const members = ['Gabe', 'Isa', 'Shane', 'Bo', 'Andrew', 'Rachel'];
    
    const modalHTML = `
        <div class="modal-overlay" id="edit-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Edit Ratings</h2>
                    <button class="modal-close" id="modal-close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <h3>${movie.title}</h3>
                    <form id="edit-ratings-form">
                        ${members.map(member => `
                            <div class="form-group">
                                <label for="rating-${member}">${member}</label>
                                <input 
                                    type="text" 
                                    id="rating-${member}" 
                                    name="${member}"
                                    value="${movie.ratings[member] || ''}"
                                    placeholder="Enter rating (e.g., 8, 9.5, or -)"
                                >
                            </div>
                        `).join('')}
                        <div class="modal-actions">
                            <button type="button" class="btn-secondary" id="cancel-edit">Cancel</button>
                            <button type="submit" class="btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Setup modal event listeners
    const modal = document.getElementById('edit-modal');
    const closeBtn = document.getElementById('modal-close');
    const cancelBtn = document.getElementById('cancel-edit');
    const form = document.getElementById('edit-ratings-form');
    
    const closeModal = () => {
        modal.remove();
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const newRatings = {};
        
        members.forEach(member => {
            newRatings[member] = formData.get(member) || '';
        });
        
        await updateMovieRatings(movie.title, newRatings);
        closeModal();
        
        // Reload the page to show updated ratings
        window.location.reload();
    });
}

// Show delete confirmation
function showDeleteConfirmation(movie) {
    const modalHTML = `
        <div class="modal-overlay" id="delete-modal">
            <div class="modal-content modal-small">
                <div class="modal-header">
                    <h2>Delete Movie</h2>
                    <button class="modal-close" id="modal-close-delete">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete <strong>${movie.title}</strong>?</p>
                    <p class="warning-text">This action cannot be undone.</p>
                    <div class="modal-actions">
                        <button type="button" class="btn-secondary" id="cancel-delete">Cancel</button>
                        <button type="button" class="btn-danger" id="confirm-delete">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.getElementById('delete-modal');
    const closeBtn = document.getElementById('modal-close-delete');
    const cancelBtn = document.getElementById('cancel-delete');
    const confirmBtn = document.getElementById('confirm-delete');
    
    const closeModal = () => {
        modal.remove();
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    confirmBtn.addEventListener('click', async () => {
        await deleteMovie(movie.title);
        closeModal();
        // Redirect to home page
        window.location.href = 'index.html';
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    const title = getMovieTitleFromURL();
    
    if (!title) {
        showNotFound();
        return;
    }

    const movie = await findMovie(decodeURIComponent(title));
    
    if (!movie) {
        showNotFound();
        return;
    }

    // Update page title
    document.title = `${movie.title} - Movie Club`;

    // Render movie details
    const container = document.getElementById('movie-detail');
    container.innerHTML = createMovieDetailHTML(movie);

    // Load poster (use stored poster URL from movie data as fallback)
    loadPoster(movie.title, movie.poster);

    // Animate bars
    animateRatingBars();

    // Setup favorite button
    const favoriteBtn = document.getElementById('favorite-btn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', () => {
            toggleFavorite(movie.title);
        });
    }
    
    // Setup edit button
    const editBtn = document.getElementById('edit-btn');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            showEditModal(movie);
        });
    }
    
    // Setup delete button
    const deleteBtn = document.getElementById('delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            showDeleteConfirmation(movie);
        });
    }
});

