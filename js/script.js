
placeholderPosts = JSON.parse(localStorage.getItem('myAppPosts')) || [
    {
        id: 1,
        author: "Default User",
        handle: "@default",
        avatar: "👤",
        timestamp: "Joined",
        content: "Welcome to SocialHub! Your posts will now persist after a page reload.",
        image: null,
        likes: 0,
        comments: [],
        shares: 0,
        liked: false
    }
];

// Suggested users fallback if data.js is missing
const suggestedUsers = (typeof window.suggestedUsers !== 'undefined') ? window.suggestedUsers : [
    { id: 101, name: "Jane Smith", handle: "@janes", avatar: "👩‍💻" },
    { id: 102, name: "Tech News", handle: "@technews", avatar: "📡" }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadFeed();
    loadSuggestions();
    setupEventListeners();
});

// Save to LocalStorage
function saveToStorage() {
    localStorage.setItem('myAppPosts', JSON.stringify(placeholderPosts));
}

// Load feed to UI
function loadFeed() {
    const feedContainer = document.getElementById('feed-container');
    if (!feedContainer) return;
    feedContainer.innerHTML = '';

    placeholderPosts.forEach(post => {
        const postCard = createPostCard(post);
        feedContainer.appendChild(postCard);
    });
}

// Create individual post card
function createPostCard(post) {
    const postCard = document.createElement('div');
    postCard.className = 'post-card'; // Ensure this matches your CSS
    postCard.dataset.postId = post.id;

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
            <span class="stat-item"><strong>${post.comments.length}</strong> Comments</span>
            <span class="stat-item"><strong>${post.shares}</strong> Shares</span>
        </div>
        <div class="post-actions-bar">
            <button class="action-btn like-btn ${post.liked ? 'liked' : ''}" data-post-id="${post.id}">
                <span>❤️ Like</span>
            </button>
            <button class="action-btn comment-btn" data-post-id="${post.id}">
                <span>💬 Comment</span>
            </button>
            <button class="action-btn share-btn" data-post-id="${post.id}">
                <span>↗️ Share</span>
            </button>
        </div>
        <div class="comment-section" id="comment-section-${post.id}" style="display: none; padding: 10px; border-top: 1px solid #eee;">
            <div class="comments-list">
                ${post.comments.map(c => `<div class="comment" style="margin-bottom: 5px;"><strong>${c.author}:</strong> ${c.text}</div>`).join('')}
            </div>
            <div style="display: flex; margin-top: 10px;">
                <input type="text" class="comment-input" placeholder="Add a comment..." data-post-id="${post.id}" style="flex: 1; margin-right: 5px;">
               <button class="submit-comment-btn" data-post-id="${post.id}">Send</button>
            </div>
        </div>
    `;
    return postCard;
}

// Event Listeners
function setupEventListeners() {
    const postBtn = document.getElementById('postBtn');
    if (postBtn) postBtn.addEventListener('click', handleCreatePost);

    // Delegation for dynamic elements
    document.addEventListener('click', function(e) {
        if (e.target.closest('.like-btn')) handleLike(e);
        if (e.target.closest('.comment-btn')) handleComment(e);
        if (e.target.closest('.share-btn')) handleShare(e);
        if (e.target.closest('.submit-comment-btn')) handleSubmitComment(e);
        if (e.target.closest('.follow-btn')) handleFollow(e);
    });
}

// Post Creation
function handleCreatePost() {
    const postInput = document.querySelector('.post-input');
    const content = postInput.value.trim();

    if (!content) {
        alert('Please write something!');
        return;
    }

    const newPost = {
        id: Date.now(), // Unique ID
        author: "John Doe",
        handle: "@johndoe",
        avatar: "👤",
        timestamp: "Just now",
        content: content,
        image: null,
        likes: 0,
        comments: [],
        shares: 0,
        liked: false
    };

    placeholderPosts.unshift(newPost);
    saveToStorage();
    postInput.value = '';
    loadFeed();
    showNotification('Post shared!');
}

function handleLike(e) {
    const btn = e.target.closest('.like-btn');
    const postId = btn.dataset.postId;
    const post = placeholderPosts.find(p => p.id == postId);

    if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        btn.classList.toggle('liked', post.liked);
        saveToStorage();
        updatePostStats(postId, post);
    }
}

function handleComment(e) {
    const btn = e.target.closest('.comment-btn');
    const section = document.getElementById(`comment-section-${btn.dataset.postId}`);
    section.style.display = (section.style.display === 'none') ? 'block' : 'none';
}

function handleSubmitComment(e) {
    const btn = e.target.closest('.submit-comment-btn');
    const postId = btn.dataset.postId;
    const input = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
    const text = input.value.trim();

    if (text) {
        const post = placeholderPosts.find(p => p.id == postId);
        post.comments.push({ author: "You", text: text });
        saveToStorage();
        input.value = '';
        loadFeed(); // Refresh to show new comment
    }
}

// Handle share button
function handleShare(e) {
    const shareBtn = e.target.closest('.share-btn');
    const post = placeholderPosts.find(p => p.id == shareBtn.dataset.postId);
    if (post) {
        post.shares++;
        saveToStorage();
        updatePostStats(shareBtn.dataset.postId, post);
        showNotification('Shared to your profile!');
    }
}

function updatePostStats(postId, post) {
    const card = document.querySelector(`[data-post-id="${postId}"]`);
    if (card) {
        card.querySelector('.post-stats').innerHTML = `
            <span class="stat-item"><strong>${post.likes}</strong> Likes</span>
            <span class="stat-item"><strong>${post.comments.length}</strong> Comments</span>
            <span class="stat-item"><strong>${post.shares}</strong> Shares</span>
        `;
    }
}

function loadSuggestions() {
    const container = document.getElementById('suggestions-container');
    if (!container) return;
    container.innerHTML = suggestedUsers.map(user => `
        <div class="suggestion-item" style="display: flex; align-items: center; margin-bottom: 10px;">
            <div style="margin-right: 10px;">${user.avatar}</div>
            <div style="flex: 1;">
                <div style="font-weight: bold;">${user.name}</div>
                <div style="font-size: 0.8em; color: #666;">${user.handle}</div>
            </div>
            <button class="follow-btn" style="padding: 2px 8px;">Follow</button>
        </div>
    `).join('');
}

function handleFollow(e) {
    const btn = e.target.closest('.follow-btn');
    btn.textContent = btn.textContent === 'Follow' ? 'Following' : 'Follow';
    btn.style.background = btn.textContent === 'Following' ? '#eee' : '';
}

function showNotification(msg) {
    const note = document.createElement('div');
    note.style.cssText = "position:fixed; bottom:20px; right:20px; background:#1DA1F2; color:white; padding:10px 20px; border-radius:50px; box-shadow:0 4px 12px rgba(0,0,0,0.1); z-index:9999;";
    note.textContent = msg;
    document.body.appendChild(note);
    setTimeout(() => note.remove(), 3000);
}