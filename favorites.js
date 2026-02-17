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

// Member descriptions
const memberDescriptions = {
    Gabe: "A champion of international cinema and psychological dramas",
    Shane: "Curator of arthouse gems and visual masterpieces",
    Bo: "A fan of classic Hollywood and genre-bending films",
    Andrew: "Appreciator of intense character studies",
    Rachel: "Lover of emotionally resonant cinema"
};

// Get poster - uses posters.js with caching
async function fetchPoster(title) {
    return await getPosterUrl(title);
}

// Parse rating helper
function parseRating(ratingStr) {
    if (!ratingStr || ratingStr === '-' || ratingStr === '') return null;
    
    let rating = parseFloat(ratingStr);
    if (isNaN(rating)) {
        if (ratingStr.toLowerCase().includes('high')) {
            rating = 9.5;
        } else {
            return null;
        }
    }
    return rating;
}

// Calculate rating distribution for a member
async function calculateMemberStats(member) {
    const stats = {};
    const allMovies = await getAllMovies();
    
    // Get all rated movies for this member
    const ratedMovies = allMovies
        .map(movie => {
            const rating = parseRating(movie.ratings[member]);
            if (rating === null) return null;
            return { ...movie, memberRating: rating };
        })
        .filter(m => m !== null);
    
    if (ratedMovies.length === 0) return stats;
    
    // Rating distribution
    const distribution = {
        tens: ratedMovies.filter(m => m.memberRating === 10).length,
        nines: ratedMovies.filter(m => m.memberRating >= 9 && m.memberRating < 10).length,
        eights: ratedMovies.filter(m => m.memberRating >= 8 && m.memberRating < 9).length,
        sevens: ratedMovies.filter(m => m.memberRating >= 7 && m.memberRating < 8).length,
        sixes: ratedMovies.filter(m => m.memberRating >= 6 && m.memberRating < 7).length,
        belowSix: ratedMovies.filter(m => m.memberRating < 6).length
    };
    stats.distribution = distribution;
    
    return stats;
}

// Get member's favorite movies
async function getMemberFavorites(member) {
    const favorites = {
        perfectTens: [],
        allRatings: []
    };
    
    const allMovies = await getAllMovies();

    // Get all movies this member rated
    const ratedMovies = allMovies
        .map(movie => {
            const rating = parseRating(movie.ratings[member]);
            if (rating === null) return null;
            
            return {
                ...movie,
                memberRating: rating
            };
        })
        .filter(m => m !== null)
        .sort((a, b) => b.memberRating - a.memberRating);

    // Perfect 10s
    favorites.perfectTens = ratedMovies.filter(m => m.memberRating === 10);

    // All ratings (excluding perfect 10s if they exist, otherwise all movies)
    if (favorites.perfectTens.length > 0) {
        favorites.allRatings = ratedMovies.filter(m => m.memberRating < 10);
    } else {
        favorites.allRatings = ratedMovies;
    }

    // Stats
    favorites.totalRated = ratedMovies.length;
    favorites.avgRating = ratedMovies.length > 0 
        ? ratedMovies.reduce((sum, m) => sum + m.memberRating, 0) / ratedMovies.length 
        : 0;
    favorites.numTens = favorites.perfectTens.length;
    
    // Calculate interesting stats
    favorites.stats = await calculateMemberStats(member);

    return favorites;
}

// Render member favorites
async function renderMemberFavorites(member) {
    const container = document.getElementById('favorites-container');
    const favorites = await getMemberFavorites(member);

    let html = `
        <div class="member-profile">
            <div class="member-avatar-large">${member[0]}</div>
            <div class="member-info">
                <h2>${member}'s Favorites</h2>
                <p>${memberDescriptions[member] || 'Movie club member'}</p>
            </div>
        </div>
    `;

    // Perfect 10s section
    if (favorites.perfectTens.length > 0) {
        html += `
            <div class="favorites-section">
                <div class="favorites-section-title">
                    <span class="emoji">⭐</span>
                    <h3>Perfect 10s</h3>
                    <span class="favorites-section-subtitle">${favorites.perfectTens.length} film${favorites.perfectTens.length > 1 ? 's' : ''}</span>
                </div>
                <div class="perfect-tens-grid" id="perfect-tens-grid">
                    ${favorites.perfectTens.map(movie => `
                        <a href="movie.html?title=${encodeURIComponent(movie.title)}" class="favorite-card" data-title="${movie.title}">
                            <div class="favorite-card-poster">
                                <img src="https://via.placeholder.com/200x300/1a1a1e/6e6e73?text=Loading..." 
                                     alt="${movie.title}" 
                                     data-title="${movie.title}">
                                <div class="favorite-card-rating perfect">10</div>
                            </div>
                            <div class="favorite-card-info">
                                <div class="favorite-card-title">${movie.title}</div>
                                <div class="favorite-card-picker">${movie.picker}'s pick</div>
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // All Ratings section
    if (favorites.allRatings.length > 0) {
        const sectionTitle = 'All Ratings';
        html += `
            <div class="favorites-section">
                <div class="favorites-section-title">
                    <span class="emoji">❤️</span>
                    <h3>${sectionTitle}</h3>
                </div>
                <div class="top-rated-list" id="top-rated-list">
                    ${favorites.allRatings.map((movie, idx) => `
                        <a href="movie.html?title=${encodeURIComponent(movie.title)}" class="top-rated-item" data-title="${movie.title}">
                            <div class="top-rated-rank">#${idx + 1}</div>
                            <img class="top-rated-poster" 
                                 src="https://via.placeholder.com/60x90/1a1a1e/6e6e73?text=..." 
                                 alt="${movie.title}"
                                 data-title="${movie.title}">
                            <div class="top-rated-info">
                                <div class="top-rated-title">${movie.title}</div>
                                <div class="top-rated-picker">${movie.picker}'s pick</div>
                            </div>
                            <div class="top-rated-score">${movie.memberRating}</div>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // No favorites state
    if (favorites.perfectTens.length === 0 && favorites.allRatings.length === 0) {
        html += `
            <div class="no-favorites">
                <div class="emoji">🎬</div>
                <p>No ratings from ${member} yet</p>
            </div>
        `;
    }

    container.innerHTML = html;

    // Load posters
    await loadPosters();
}

// Load posters for all images
async function loadPosters() {
    const images = document.querySelectorAll('img[data-title]');
    
    for (const img of images) {
        const title = img.dataset.title;
        const poster = await fetchPoster(title);
        img.src = poster;
    }
}

// Setup tab navigation
function setupTabs() {
    const tabs = document.querySelectorAll('.member-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active state
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Render favorites for selected member
            const member = tab.dataset.member;
            renderMemberFavorites(member);
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    // Start with Gabe's favorites
    renderMemberFavorites('Gabe');
});

