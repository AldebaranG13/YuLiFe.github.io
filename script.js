// --- PASTE YOUR (FULL!) API KEY HERE ---
const API_KEY = 'AIzaSyAJszk6T_pxgXTIahpGXfrU8e8-nf9a5y0';

// Get the HTML elements we need to work with
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');
const loadMoreButton = document.getElementById('load-more-button');

// --- Get the modal elements ---
const modalContainer = document.getElementById('modal-container');
const modalCloseButton = document.getElementById('modal-close-button');
const videoPlayerContainer = document.getElementById('video-player-container');

// A variable to hold our "magic ticket"
let nextPageToken = '';
let currentChannelId = 'UCaO-aO_m-iN8G0_7-yE-1fQ'; // FIWA Official ID

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++
// This function builds the HTML for each video
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++
function displayVideos(videos) {
    if (!videos || videos.length === 0) {
        if (resultsContainer.innerHTML === '') {
             resultsContainer.innerHTML = '<p>No videos found.</p>';
        }
        return;
    }

    videos.forEach(video => {
        const videoId = video.id.videoId;
        const videoTitle = video.snippet.title;
        const videoThumbnail = video.snippet.thumbnails.high.url;

        const videoElement = document.createElement('div');
        videoElement.className = 'video-item';

        videoElement.innerHTML = `
            <img src="${videoThumbnail}" alt="${videoTitle}">
            <h4>${videoTitle}</h4>
        `;
        
        videoElement.addEventListener('click', () => {
            openModal(videoId);
        });

        resultsContainer.appendChild(videoElement);
    });
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++
// END OF FUNCTION
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++

// --- Function to open the modal ---
function openModal(videoId) {
    videoPlayerContainer.innerHTML = `
        <iframe 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    `;
    modalContainer.style.display = 'flex'; // This shows the pop-up
}

// --- Function to close the modal ---
function closeModal() {
    videoPlayerContainer.innerHTML = '';
    modalContainer.style.display = 'none'; // This hides the pop-up
}

// This function calls the YouTube API for SEARCH
async function searchVideos(query) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${API_KEY}&type=video&maxResults=12`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        resultsContainer.innerHTML = ''; 

        if (data.items) {
            displayVideos(data.items); // Calls the function
        } else if (data.error) {
            throw new Error(data.error.message);
        } else {
            throw new Error("API returned no videos for this search.");
        }

    } 
    catch (error) {
        resultsContainer.innerHTML = `<p><strong>Error:</strong> <pre>${error.toString()}</pre></p>`;
    }
}

// This function loads the FIWA channel videos
async function loadChannelVideos() {
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${currentChannelId}&order=date&type=video&key=${API_KEY}&maxResults=50`;
    if (nextPageToken) {
        url += `&pageToken=${nextPageToken}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items) {
            nextPageToken = data.nextPageToken; 
            if (!url.includes(`&pageToken=`)) {
                 resultsContainer.innerHTML = ''; 
            }
            displayVideos(data.items); // Calls the function
            
            if (nextPageToken) {
                loadMoreButton.style.display = 'block';
            } else {
                loadMoreButton.style.display = 'none';
            }
        } else if (data.error) {
            throw new Error(data.error.message);
        } else {
            if (resultsContainer.innerHTML === '') {
                 resultsContainer.innerHTML = '<p>Could not load channel videos.</p>';
            }
        }
    } catch (error) {
        resultsContainer.innerHTML = `<p><strong>Error loading channel videos:</strong> <pre>${error.toString()}</pre></p>`;
    }
}

// --- ALL THE EVENT LISTENERS ARE DOWN HERE ---
// This ensures they run *after* the page is loaded
// This should fix the silent crash

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
        nextPageToken = ''; 
        loadMoreButton.style.display = 'none';
        searchVideos(query);
    }
});

// Add event listener for the load more button
loadMoreButton.addEventListener('click', () => {
    loadChannelVideos();
});

// --- Event listeners for closing the modal ---
modalCloseButton.addEventListener('click', () => {
    closeModal();
});
modalContainer.addEventListener('click', (event) => {
    if (event.target === modalContainer) {
        closeModal();
    }
});

// --- Finally, load the first videos ---
loadChannelVideos();
