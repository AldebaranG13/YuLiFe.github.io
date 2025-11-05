// --- PASTE YOUR API KEY HERE ---
// This is the "password" you got from Google.
const API_KEY = 'AIzaSyAJszk6T_pxgXTIahpGXfrU8e8-nf9a5y0';

// Get the HTML elements we need to work with
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');

// Add an event listener to the search button
searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {
        searchVideos(query);
    }
});

// This function calls the YouTube API
async function searchVideos(query) {
    // This is the official API URL for searching
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${API_KEY}&type=video&maxResults=12`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Clear old results before showing new ones
        resultsContainer.innerHTML = '';
        
        // Display the new videos
        displayVideos(data.items);
    } 
    
    // --- THIS IS THE NEW ERROR CATCH BLOCK ---
    // It will print the error on your webpage so you can see it.
    catch (error) {
        resultsContainer.innerHTML = `
            <p><strong>Error:</strong></p>
            <pre>${error.toString()}</pre>
            <p><strong>(This is probably a 'RefererNotAllowedMapError'. Check your Google Console restrictions.)</strong></p>
        `;
    }
    // --- END OF NEW ERROR CATCH BLOCK ---
}

// This function takes the video data and builds the HTML
function displayVideos(videos) {
    if (videos.length === 0) {
        resultsContainer.innerHTML = '<p>No videos found.</p>';
        return;
    }

    videos.forEach(video => {
        const videoId = video.id.videoId;
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
