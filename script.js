// --- PASTE YOUR API KEY HERE ---
const API_KEY = 'AIzaSyAJszk6T_pxgXTIahpGXfrU8e8-nf9a5y0';

// Get the HTML elements we need to work with
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');

// Event listener for "Press Enter to Search"
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

// Add an event listener to the search button
searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {
        searchVideos(query);
    }
});

// This function calls the YouTube API for SEARCH
async function searchVideos(query) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${API_KEY}&type=video&maxResults=12`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        resultsContainer.innerHTML = ''; // Clear old results
        displayVideos(data.items);
    } 
    catch (error) {
        // This will print the error on your webpage
        resultsContainer.innerHTML = `
            <p><strong>Error:</strong></p>
            <pre>${error.toString()}</pre>
            <p><strong>(This is probably a 'RefererNotAllowedMapError'. Check your Google Console restrictions.)</strong></p>
        `;
    }
}

// --- NEW: Function to get "Popular EDUCATIONAL" videos on page load ---
async function loadPopularVideos() {
    // We now use the /search endpoint to find videos in category 27 (Education)
    // and sort by the viewCount to get the most popular.
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoCategoryId=27&type=video&order=viewCount&key=${API_KEY}&maxResults=12`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        resultsContainer.innerHTML = ''; // Clear loading text
        displayVideos(data.items);
    } catch (error) {
        // This will print the error on your webpage
        resultsContainer.innerHTML = `
            <p><strong>Error loading popular videos:</strong></p>
            <pre>${error.toString()}</pre>
        `;
    }
}
// --- END OF NEW ---

// This function takes the video data and builds the HTML
function displayVideos(videos) {
    if (videos.length === 0) {
        resultsContainer.innerHTML = '<p>No videos found.</p>';
        return;
    }

    videos.forEach(video => {
        // --- NEW: This line is now SIMPLER! ---
        // Both search and popular videos now use the /search endpoint,
        // so we only need 'video.id.videoId'.
        const videoId = video.id.videoId;
        // --- END OF NEW ---

        const videoTitle = video.snippet.title;
        const videoThumbnail = video.snippet.thumbnails.high.url;

        // Create a new div for each video
        const videoElement = document.createElement('div');
        videoElement.className = 'video-item';

        // When a video is clicked, it will open in a new tab
        videoElement.innerHTML = `
            <img src="${videoThumbnail}" alt="${videoTitle}">
            <h4>${videoTitle}</h4>
        `;
        
        videoElement.addEventListener('click', () => {
            window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
        });

        // Add the new video element to our results container
        resultsContainer.appendChild(videoElement);
    });
}

// Call the function to load popular videos when the script first runs
loadPopularVideos();
