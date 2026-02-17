// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyACMSV6CrQ-47kqJgzb2HHRxzL4P8Z_T2c",
    authDomain: "movie-club-48291.firebaseapp.com",
    databaseURL: "https://movie-club-48291-default-rtdb.firebaseio.com",
    projectId: "movie-club-48291",
    storageBucket: "movie-club-48291.firebasestorage.app",
    messagingSenderId: "454863998891",
    appId: "1:454863998891:web:f9694278b865c556c0ccee"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Sanitize title for use as Firebase key (Firebase doesn't allow . # $ [ ])
function sanitizeKey(title) {
    return title.replace(/[.#$\[\]\/]/g, '_');
}

// Check if Firebase has been populated with movies
async function fbIsPopulated() {
    const snapshot = await db.ref('movies').once('value');
    return snapshot.exists();
}

// Migrate movies.js data to Firebase (one-time)
async function fbMigrateIfNeeded() {
    const populated = await fbIsPopulated();
    if (populated) return false;

    if (typeof movies === 'undefined' || !Array.isArray(movies)) return false;

    console.log('Migrating movies.js to Firebase...');
    const updates = {};
    movies.forEach(movie => {
        updates[sanitizeKey(movie.title)] = movie;
    });

    // Also migrate any localStorage movies
    try {
        const stored = localStorage.getItem('movieClubData');
        if (stored) {
            const data = JSON.parse(stored);
            if (data.movies && Array.isArray(data.movies)) {
                data.movies.forEach(movie => {
                    const key = sanitizeKey(movie.title);
                    if (!updates[key]) {
                        updates[key] = {
                            title: movie.title,
                            picker: movie.picker,
                            ratings: movie.ratings,
                            average: movie.average,
                            dateAdded: movie.dateAdded
                        };
                    }
                });
            }
        }
    } catch (e) {
        console.warn('Could not read localStorage for migration:', e);
    }

    await db.ref('movies').set(updates);
    console.log(`Migrated ${Object.keys(updates).length} movies to Firebase`);
    return true;
}

// Get all movies from Firebase
async function fbGetAllMovies() {
    const snapshot = await db.ref('movies').once('value');
    const data = snapshot.val();
    if (!data) return [];
    return Object.values(data);
}

// Add a movie to Firebase
async function fbAddMovie(movie) {
    const cleanMovie = {
        title: movie.title,
        picker: movie.picker,
        ratings: movie.ratings,
        average: movie.average,
        dateAdded: movie.dateAdded
    };
    await db.ref('movies/' + sanitizeKey(movie.title)).set(cleanMovie);
    return cleanMovie;
}

// Update a movie in Firebase
async function fbUpdateMovie(title, updates) {
    await db.ref('movies/' + sanitizeKey(title)).update(updates);
}

// Delete a movie from Firebase
async function fbDeleteMovie(title) {
    await db.ref('movies/' + sanitizeKey(title)).remove();
}
