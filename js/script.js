// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadFeed();
    loadSuggestions();
    setupEventListeners();
});

// Load posts from placeholder data
function loadFeed() {
    const feedContainer = document.getElementById('feed-container');
    feedContainer.innerHTML = '';

    placeholderPosts.forEach(post => {
        const postCard = createPostCard(post);
        feedContainer.appendChild(postCard);
    });
}

  

// Create a post card element
function createPostCard(post) {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.dataset.postId = post.id;
    
   /* window.onload = function() {
    const savedPosts = JSON.parse(localStorage.getItem('post-card')) || [];
    const now = Date.now();
    
    const activePosts = savedPosts.filter(post => post.expiryTime > now);

    localStorage.setItem('post-card', JSON.stringify(activePosts));
    activePosts.forEach(post => displayPost(post.text, post.expiryTime));
};
    function createPost() {
    const postText = document.getElementById('postInput').value;
    const duration = parseInt(document.getElementById('duration').value);
    const expiryTime = Date.now() + (duration * 1000);
    const savedPosts = JSON.parse(localStorage.getItem('post-card')) || [];
    savedPosts.push({ text: postText, expiryTime: expiryTime });
    localStorage.setItem('post-card', JSON.stringify(savedPosts));
    displayPost(postText, expiryTime);
}
    function displayPost(text, expiryTime) {
    const feed = document.getElementById('feed');
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.innerHTML = `<p>${text}</p><span class="timer"></span>`;
    feed.prepend(postDiv);

    const timerSpan = postDiv.querySelector('.timer');

    const interval = setInterval(() => {
        const timeLeft = Math.round((expiryTime - Date.now()) / 1000);

        if (timeLeft <= 0) {
            clearInterval(interval);
            postDiv.remove();
            removePostFromStorage(expiryTime); // Clean up memory
        } else {
            timerSpan.innerText = `Expires in ${timeLeft}s`;
        }
    }, 1000);
}*/

function removePostFromStorage(expiryTime) {
    let posts = JSON.parse(localStorage.getItem('post-card')) || [];
    posts = posts.filter(p => p.expiryTime !== expiryTime);
    localStorage.setItem('post-card', JSON.stringify(posts));
}

    const imageHTML = post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : '';

    postCard.innerHTML = `
        <div class="post-card-header">
            <div class="post-user-avatar">${post.avatar}</div>
            <div class="post-user-info">
                <div class="post-user-name">${post.author}</div>
                <div class="post-user-handle">${post.handle}</div>
            </div>
            <div class="post-time">${post.timestamp}</div>
        </div>
        <div class="post-card-content">
            <p class="post-text">${post.content}</p>
            ${imageHTML}
        </div>
        <div class="post-stats">
            <span class="stat-item"><strong>${post.likes}</strong> Likes</span>
            <span class="stat-item"><strong>${post.comments}</strong> Comments</span>
            <span class="stat-item"><strong>${post.shares}</strong> Shares</span>
        </div>
        <div class="post-actions-bar">
            <button class="action-btn like-btn" data-post-id="${post.id}">
                <span>❤️</span>
                <span>Like</span>
            </button>
            <button class="action-btn comment-btn" data-post-id="${post.id}">
                <span>💬</span>
                <span>Comment</span>
            </button>
            <button class="action-btn share-btn" data-post-id="${post.id}">
                <span>↗️</span>
                <span>Share</span>
            </button>
        </div>
    `;

    return postCard;

}

// Load suggested users
function loadSuggestions() {
    const suggestionsContainer = document.getElementById('suggestions-container');
    suggestionsContainer.innerHTML = '';

    suggestedUsers.forEach(user => {
        const suggestionCard = createSuggestionCard(user);
        suggestionsContainer.appendChild(suggestionCard);
    });
}

// Create a suggestion card element
function createSuggestionCard(user) {
    const suggestionCard = document.createElement('div');
    suggestionCard.className = 'suggestion-card';
    suggestionCard.dataset.userId = user.id;

    suggestionCard.innerHTML = `
        <div class="suggestion-avatar">${user.avatar}</div>
        <div class="suggestion-info">
            <div class="suggestion-name">${user.name}</div>
            <div class="suggestion-handle">${user.handle}</div>
        </div>
        <button class="follow-btn" data-user-id="${user.id}">Follow</button>
    `;

    return suggestionCard;
}

// Setup event listeners
function setupEventListeners() {
    // Post button
    const postBtn = document.getElementById('postBtn');
    postBtn.addEventListener('click', handleCreatePost);

    // Like buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.like-btn')) {
            handleLike(e);
        }
        if (e.target.closest('.comment-btn')) {
            handleComment(e);
        }
        if (e.target.closest('.share-btn')) {
            handleShare(e);
        }
        if (e.target.closest('.follow-btn')) {
            handleFollow(e);
        }
    });

    // Post input
    const postInput = document.querySelector('.post-input');
    postInput.addEventListener('focus', function() {
        this.style.minHeight = '60px';
    });

    postInput.addEventListener('blur', function() {
        if (this.value === '') {
            this.style.minHeight = 'auto';
        }
    });
}

// Handle creating a new post
function handleCreatePost() {
    const postInput = document.querySelector('.post-input');
    const content = postInput.value.trim();

    if (content === '') {
        alert('Please write something to post!');
        return;
    }

    const newPost = {
        id: placeholderPosts.length + 1,
        author: "John Doe",
        handle: "@johndoe",
        avatar: "👤",
        timestamp: "now",
        content: content,
        image: null,
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false
    };

    // Add new post to the beginning of the array
    placeholderPosts.unshift(newPost);

    // Clear input
    postInput.value = '';
    postInput.style.minHeight = 'auto';

    // Reload feed
    loadFeed();

    // Show success message
    showNotification('Post published successfully!');
}

// Handle like button
function handleLike(e) {
    const likeBtn = e.target.closest('.like-btn');
    const postId = likeBtn.dataset.postId;
    const post = placeholderPosts.find(p => p.id == postId);

    if (post) {
        post.liked = !post.liked;
        if (post.liked) {
            post.likes++;
            likeBtn.classList.add('active');
            likeBtn.classList.add('liked');
        } else {
            post.likes--;
            likeBtn.classList.remove('active');
            likeBtn.classList.remove('liked');
        }

        // Update the post stats
        updatePostStats(postId, post);
    }
}

// Handle comment button
function handleComment(e) {
    const commentBtn = e.target.closest('.comment-btn');
    const postId = commentBtn.dataset.postId;
    showNotification('Comment feature will be available soon!');
}

// Handle share button
function handleShare(e) {
    const shareBtn = e.target.closest('.share-btn');
    const postId = shareBtn.dataset.postId;
    const post = placeholderPosts.find(p => p.id == postId);

    if (post) {
        post.shares++;
        updatePostStats(postId, post);
        showNotification('Post shared successfully!');
    }
}

// Handle follow button
function handleFollow(e) {
    const followBtn = e.target.closest('.follow-btn');
    const userId = followBtn.dataset.userId;
    const user = suggestedUsers.find(u => u.id == userId);

    if (user) {
        user.following = !user.following;
        if (user.following) {
            followBtn.textContent = 'Following';
            followBtn.classList.add('following');
            showNotification(`You're now following ${user.name}!`);
        } else {
            followBtn.textContent = 'Follow';
            followBtn.classList.remove('following');
            showNotification(`You unfollowed ${user.name}`);
        }
    }
}

// Update post stats display
function updatePostStats(postId, post) {
    const postCard = document.querySelector(`[data-post-id="${postId}"]`);
    if (postCard) {
        const statsDiv = postCard.querySelector('.post-stats');
        statsDiv.innerHTML = `
            <span class="stat-item"><strong>${post.likes}</strong> Likes</span>
            <span class="stat-item"><strong>${post.comments}</strong> Comments</span>
            <span class="stat-item"><strong>${post.shares}</strong> Shares</span>
        `;
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #1DA1F2;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Search functionality (basic)
const searchInput = document.querySelector('.nav-search input');
if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query) {
                showNotification(`Searching for "${query}"...`);
                this.value = '';
            }
        }
    })};
