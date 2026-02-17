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

// Member names
const members = ['Gabe', 'Isa', 'Shane', 'Bo', 'Andrew', 'Rachel'];

// Current year filter
let currentYear = '2025';

// Filter movies by year
function filterMoviesByYear(movies, year) {
    if (year === 'all') return movies;
    
    return movies.filter(movie => {
        if (!movie.dateAdded) return false;
        const movieYear = new Date(movie.dateAdded).getFullYear();
        return movieYear === parseInt(year);
    });
}

// Calculate statistics
async function calculateStats(year = currentYear) {
    let allMovies = await getAllMovies();
    allMovies = filterMoviesByYear(allMovies, year);
    const stats = {
        totalFilms: allMovies.length,
        totalAverage: 0,
        topFilms: [],
        bottomFilms: [],
        memberStats: {},
        pickerStats: {},
        ratingDistribution: {},
        perfectScores: [],
        mostControversial: null,
        mostAgreement: null,
        highestSingleRating: { movie: null, member: null, rating: 0 },
        lowestSingleRating: { movie: null, member: null, rating: 10 }
    };

    // Initialize member stats
    members.forEach(member => {
        stats.memberStats[member] = {
            ratingsGiven: 0,
            totalScore: 0,
            average: 0,
            highest: { movie: null, rating: 0 },
            lowest: { movie: null, rating: 10 },
            tens: 0,
            harsh: 0 // ratings 5 or below
        };
    });

    // Initialize picker stats
    members.forEach(member => {
        stats.pickerStats[member] = {
            films: [],
            totalScore: 0,
            average: 0
        };
    });

    // Initialize rating distribution
    for (let i = 1; i <= 10; i++) {
        stats.ratingDistribution[i] = 0;
    }

    // Process each movie
    allMovies.forEach(movie => {
        // Add to picker stats
        if (stats.pickerStats[movie.picker]) {
            stats.pickerStats[movie.picker].films.push(movie);
            stats.pickerStats[movie.picker].totalScore += movie.average;
        }

        // Process individual ratings
        const movieRatings = [];
        members.forEach(member => {
            const ratingStr = movie.ratings[member];
            if (ratingStr && ratingStr !== '-' && ratingStr !== '' && !isNaN(parseFloat(ratingStr))) {
                const rating = parseFloat(ratingStr);
                movieRatings.push(rating);

                // Update member stats
                stats.memberStats[member].ratingsGiven++;
                stats.memberStats[member].totalScore += rating;

                // Track highest/lowest
                if (rating > stats.memberStats[member].highest.rating) {
                    stats.memberStats[member].highest = { movie: movie.title, rating };
                }
                if (rating < stats.memberStats[member].lowest.rating) {
                    stats.memberStats[member].lowest = { movie: movie.title, rating };
                }

                // Track 10s and harsh ratings
                if (rating === 10) stats.memberStats[member].tens++;
                if (rating <= 5) stats.memberStats[member].harsh++;

                // Global highest/lowest single ratings
                if (rating > stats.highestSingleRating.rating) {
                    stats.highestSingleRating = { movie: movie.title, member, rating };
                }
                if (rating < stats.lowestSingleRating.rating) {
                    stats.lowestSingleRating = { movie: movie.title, member, rating };
                }

                // Rating distribution
                const roundedRating = Math.round(rating);
                if (stats.ratingDistribution[roundedRating] !== undefined) {
                    stats.ratingDistribution[roundedRating]++;
                }
            }
        });

        // Calculate controversy (standard deviation)
        if (movieRatings.length > 1) {
            const mean = movieRatings.reduce((a, b) => a + b, 0) / movieRatings.length;
            const variance = movieRatings.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / movieRatings.length;
            const stdDev = Math.sqrt(variance);
            movie.controversy = stdDev;

            if (!stats.mostControversial || stdDev > stats.mostControversial.controversy) {
                stats.mostControversial = { ...movie };
            }
            if (!stats.mostAgreement || stdDev < stats.mostAgreement.controversy) {
                stats.mostAgreement = { ...movie };
            }
        }

        // Track perfect scores
        if (movie.average === 10) {
            stats.perfectScores.push(movie);
        }
    });

    // Calculate averages
    stats.totalAverage = allMovies.length > 0 
        ? allMovies.reduce((sum, m) => sum + m.average, 0) / allMovies.length 
        : 0;

    members.forEach(member => {
        if (stats.memberStats[member].ratingsGiven > 0) {
            stats.memberStats[member].average = 
                stats.memberStats[member].totalScore / stats.memberStats[member].ratingsGiven;
        }
    });

    members.forEach(member => {
        if (stats.pickerStats[member].films.length > 0) {
            stats.pickerStats[member].average = 
                stats.pickerStats[member].totalScore / stats.pickerStats[member].films.length;
        }
    });

    // Sort movies by average
    stats.topFilms = [...allMovies].sort((a, b) => b.average - a.average);
    stats.bottomFilms = [...allMovies].sort((a, b) => a.average - b.average);

    return stats;
}

// Get poster - uses posters.js with caching
async function fetchPoster(title) {
    return await getPosterUrl(title);
}

// Render hero stats
function renderHeroStats(stats) {
    document.getElementById('total-films').textContent = stats.totalFilms;
    document.getElementById('avg-score').textContent = stats.totalAverage.toFixed(1);
    
    // Estimate hours (assuming average movie is ~2 hours)
    const hours = Math.round(stats.totalFilms * 2);
    document.getElementById('total-hours').textContent = hours;
}

// Render top films podium
async function renderTopFilms(stats) {
    const podium = document.getElementById('top-films-podium');
    const mentions = document.getElementById('honorable-mentions');
    
    const top3 = stats.topFilms.slice(0, 3);
    const order = [1, 0, 2]; // Silver, Gold, Bronze display order
    
    let podiumHTML = '';
    for (const idx of order) {
        const movie = top3[idx];
        const poster = await fetchPoster(movie.title);
        const rankLabels = ['🥇', '🥈', '🥉'];
        const classes = idx === 0 ? 'podium-item first' : 'podium-item';
        
        podiumHTML += `
            <div class="${classes}">
                <span class="podium-rank">${rankLabels[idx]}</span>
                <img class="podium-poster" src="${poster}" alt="${movie.title}">
                <div class="podium-info">
                    <div class="podium-title">${movie.title}</div>
                    <div class="podium-score">${movie.average.toFixed(1)}</div>
                </div>
            </div>
        `;
    }
    podium.innerHTML = podiumHTML;

    // Honorable mentions (4-7)
    const honorable = stats.topFilms.slice(3, 7);
    let mentionsHTML = '';
    for (const movie of honorable) {
        const poster = await fetchPoster(movie.title);
        mentionsHTML += `
            <div class="honorable-item">
                <img src="${poster}" alt="${movie.title}">
                <div class="honorable-info">
                    <h4>${movie.title}</h4>
                    <span>${movie.average.toFixed(1)}</span>
                </div>
            </div>
        `;
    }
    mentions.innerHTML = mentionsHTML;
}

// Render member cards
function renderMemberCards(stats) {
    const container = document.getElementById('member-cards');
    
    const badges = {
        mostGenerous: { label: '🎁 Most Generous', check: (s) => s.average },
        harshCritic: { label: '⚔️ Harsh Critic', check: (s) => s.harsh },
        perfectTen: { label: '⭐ Perfect 10 Giver', check: (s) => s.tens }
    };

    // Find badge winners
    let highestAvg = { member: null, value: 0 };
    let mostHarsh = { member: null, value: 0 };
    let mostTens = { member: null, value: 0 };

    members.forEach(member => {
        const s = stats.memberStats[member];
        if (s.ratingsGiven > 0) {
            if (s.average > highestAvg.value) highestAvg = { member, value: s.average };
            if (s.harsh > mostHarsh.value) mostHarsh = { member, value: s.harsh };
            if (s.tens > mostTens.value) mostTens = { member, value: s.tens };
        }
    });

    const memberBadges = {};
    if (highestAvg.member) memberBadges[highestAvg.member] = '🎁 Most Generous';
    if (mostHarsh.member && mostHarsh.value > 0) memberBadges[mostHarsh.member] = '⚔️ Toughest Critic';
    if (mostTens.member && mostTens.value > 0) memberBadges[mostTens.member] = '⭐ Perfect 10 Giver';

    let html = '';
    members.forEach(member => {
        const s = stats.memberStats[member];
        if (s.ratingsGiven === 0) return;

        const badge = memberBadges[member] 
            ? `<span class="member-badge">${memberBadges[member]}</span>` 
            : '';

        html += `
            <div class="member-card">
                <div class="member-card-header">
                    <div class="member-avatar">${member[0]}</div>
                    <div class="member-name">${member}</div>
                </div>
                ${badge}
            </div>
        `;
    });
    container.innerHTML = html;
}

// Render picker rankings
function renderPickerRankings(stats) {
    const container = document.getElementById('picker-rankings');
    
    // Sort pickers by average
    const sortedPickers = members
        .filter(m => stats.pickerStats[m].films.length > 0)
        .sort((a, b) => stats.pickerStats[b].average - stats.pickerStats[a].average);

    const maxAvg = Math.max(...sortedPickers.map(m => stats.pickerStats[m].average));
    
    let html = '';
    sortedPickers.forEach((member, idx) => {
        const s = stats.pickerStats[member];
        const positionClass = idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : '';
        const barWidth = (s.average / 10) * 100;

        html += `
            <div class="picker-rank-item">
                <div class="picker-position ${positionClass}">#${idx + 1}</div>
                <div class="picker-info">
                    <div class="picker-name">${member}</div>
                    <div class="picker-films">${s.films.length} films picked</div>
                    <div class="picker-bar">
                        <div class="picker-bar-fill" style="width: ${barWidth}%"></div>
                    </div>
                </div>
                <div class="picker-avg">
                    <div class="picker-avg-value">${s.average.toFixed(2)}</div>
                    <div class="picker-avg-label">avg</div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Render rating distribution
function renderDistribution(stats) {
    const container = document.getElementById('distribution-chart');
    
    const maxCount = Math.max(...Object.values(stats.ratingDistribution));
    
    let html = '';
    for (let rating = 10; rating >= 5; rating--) {
        const count = stats.ratingDistribution[rating] || 0;
        const width = maxCount > 0 ? (count / maxCount) * 100 : 0;
        
        html += `
            <div class="distribution-bar-container">
                <div class="distribution-label">${rating}</div>
                <div class="distribution-bar-wrapper">
                    <div class="distribution-bar rating-${rating}" style="width: ${width}%"></div>
                </div>
                <div class="distribution-count">${count}</div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// Render superlatives
function renderSuperlatives(stats) {
    const container = document.getElementById('superlatives-grid');
    
    // Find various superlatives
    const superlatives = [];

    // Perfect score movie(s)
    if (stats.perfectScores.length > 0) {
        superlatives.push({
            emoji: '💯',
            title: 'Perfect Score',
            winner: stats.perfectScores[0].title,
            detail: `The only film to achieve a perfect 10`
        });
    }

    // Most controversial
    if (stats.mostControversial) {
        superlatives.push({
            emoji: '🔥',
            title: 'Most Divisive',
            winner: stats.mostControversial.title,
            detail: `Opinions varied wildly on this one`
        });
    }

    // Most agreement
    if (stats.mostAgreement) {
        superlatives.push({
            emoji: '🤝',
            title: 'Most Agreed Upon',
            winner: stats.mostAgreement.title,
            detail: `Everyone was on the same page`
        });
    }

    // Most prolific picker
    const prolificPicker = members.reduce((best, m) => 
        stats.pickerStats[m].films.length > (best ? stats.pickerStats[best].films.length : 0) ? m : best
    , null);
    if (prolificPicker) {
        superlatives.push({
            emoji: '🎬',
            title: 'Most Prolific Curator',
            winner: prolificPicker,
            detail: `Picked ${stats.pickerStats[prolificPicker].films.length} films`
        });
    }

    // Highest single rating
    if (stats.highestSingleRating.movie) {
        superlatives.push({
            emoji: '❤️',
            title: 'Highest Single Rating',
            winner: `${stats.highestSingleRating.member} → ${stats.highestSingleRating.movie}`,
            detail: `A perfect ${stats.highestSingleRating.rating}`
        });
    }

    // Harshest single rating
    if (stats.lowestSingleRating.movie && stats.lowestSingleRating.rating < 6) {
        superlatives.push({
            emoji: '💔',
            title: 'Harshest Rating',
            winner: `${stats.lowestSingleRating.member} → ${stats.lowestSingleRating.movie}`,
            detail: `Only gave it a ${stats.lowestSingleRating.rating}`
        });
    }

    let html = '';
    superlatives.forEach(s => {
        html += `
            <div class="superlative-card">
                <div class="superlative-emoji">${s.emoji}</div>
                <div class="superlative-title">${s.title}</div>
                <div class="superlative-winner">${s.winner}</div>
                <div class="superlative-detail">${s.detail}</div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Render flops
async function renderFlops(stats) {
    const container = document.getElementById('flops-list');
    
    const flops = stats.bottomFilms.slice(0, 5);
    
    let html = '';
    for (const movie of flops) {
        const poster = await fetchPoster(movie.title);
        html += `
            <div class="flop-item">
                <img src="${poster}" alt="${movie.title}">
                <div class="flop-info">
                    <h4>${movie.title}</h4>
                    <span>${movie.average.toFixed(1)}</span>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// Render timeline
async function renderTimeline(stats) {
    const container = document.getElementById('films-timeline');
    const allMovies = await getAllMovies();
    
    let html = '';
    for (const movie of allMovies) {
        const poster = await fetchPoster(movie.title);
        html += `
            <div class="timeline-item" data-score="${movie.average.toFixed(1)}">
                <img src="${poster}" alt="${movie.title}">
                <div class="timeline-tooltip">${movie.title}</div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// Initialize page
async function init(year = currentYear) {
    currentYear = year;
    const stats = await calculateStats(year);
    
    // Update hero year display
    const heroYear = document.getElementById('hero-year');
    if (heroYear) {
        heroYear.textContent = year === 'all' ? 'All Time' : year;
    }
    
    // Render sync sections
    renderHeroStats(stats);
    renderMemberCards(stats);
    renderPickerRankings(stats);
    renderDistribution(stats);
    renderSuperlatives(stats);
    
    // Render async sections (with posters)
    await renderTopFilms(stats);
    await renderFlops(stats);
    await renderTimeline(stats);
}

// Setup year selector
function setupYearSelector() {
    const yearSelect = document.getElementById('year-select');
    if (yearSelect) {
        yearSelect.addEventListener('change', () => {
            init(yearSelect.value);
        });
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    setupYearSelector();
    
    // Get current year or use 2025 as default
    const yearSelect = document.getElementById('year-select');
    const initialYear = yearSelect ? yearSelect.value : '2025';
    init(initialYear);
});

