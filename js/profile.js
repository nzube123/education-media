// Profile Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    setupTabNavigation();
    loadUserProfile();
    loadUserPosts();
    loadSuggestions();
    setupProfileInteractions();
});

// Setup tab navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.quick-link[data-tab]');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.dataset.tab;
            
            // Remove active class from all buttons and sections
            document.querySelectorAll('.quick-link').forEach(btn => {
                btn.classList.remove('active-tab');
            });
            document.querySelectorAll('.tab-content').forEach(section => {
                section.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding section
            this.classList.add('active-tab');
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });
}

// Load user's posts
function loadUserPosts() {
    const userPostsContainer = document.getElementById('user-posts');
    userPostsContainer.innerHTML = '';
    
    // Filter posts by current user
    const userPosts = placeholderPosts.filter(post => post.handle === '@johndoe');
    
    if (userPosts.length === 0) {
        userPostsContainer.innerHTML = '<p style="text-align: center; color: var(--secondary-color); padding: 40px 20px;">No posts yet. Create your first post!</p>';
        return;
    }
    
    userPosts.forEach(post => {
        const postCard = createPostCard(post);
        userPostsContainer.appendChild(postCard);
    });
}

// Create post card (reuse from main script)
function createPostCard(post) {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
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

// Load liked posts
function loadLikedPosts() {
    const likedPostsContainer = document.getElementById('liked-posts');
    likedPostsContainer.innerHTML = '';
    
    const likedPosts = placeholderPosts.filter(post => post.liked);
    
    if (likedPosts.length === 0) {
        likedPostsContainer.innerHTML = '<p style="text-align: center; color: var(--secondary-color); padding: 40px 20px;">You haven\'t liked any posts yet</p>';
        return;
    }
    
    likedPosts.forEach(post => {
        const postCard = createPostCard(post);
        likedPostsContainer.appendChild(postCard);
    });
}

// Load suggestions
function loadSuggestions() {
    const suggestionsContainer = document.getElementById('suggestions-container');
    suggestionsContainer.innerHTML = '';

    suggestedUsers.forEach(user => {
        const suggestionCard = createSuggestionCard(user);
        suggestionsContainer.appendChild(suggestionCard);
    });
}

// Create suggestion card
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

// Load user profile from localStorage and apply to UI
function loadUserProfile() {
    const defaultProfile = {
        name: 'John Doe',
        handle: '@johndoe',
        bio: 'Full-stack developer | Tech enthusiast | Coffee lover ☕ | Always learning something new',
        location: 'San Francisco, CA',
        website: 'www.johndoe.com',
        avatar: '👤',
        joined: 'Joined March 2020'
    };

    let stored = null;
    try {
        stored = JSON.parse(localStorage.getItem('userProfile'));
    } catch (e) {
        stored = null;
    }

    const profile = Object.assign({}, defaultProfile, stored || {});
    updateProfileUI(profile);
}

function updateProfileUI(profile) {
    const nameEl = document.querySelector('.profile-name-section h1');
    const handleEl = document.querySelector('.profile-handle');
    const bioEl = document.querySelector('.profile-bio');
    const metaEl = document.querySelector('.profile-meta');
    const avatarEl = document.querySelector('.profile-avatar-large');

    if (nameEl) nameEl.textContent = profile.name;
    if (handleEl) handleEl.textContent = profile.handle;
    if (bioEl) bioEl.textContent = profile.bio;
    if (metaEl) {
        metaEl.innerHTML = '';
        if (profile.location) metaEl.innerHTML += `<span>📍 ${profile.location}</span>`;
        if (profile.website) metaEl.innerHTML += `<span>🔗 ${profile.website}</span>`;
        if (profile.joined) metaEl.innerHTML += `<span>📅 ${profile.joined}</span>`;
    }
    if (avatarEl) {
        // If avatar looks like a URL, use an image tag, otherwise show emoji/text
        if (/^https?:\/\//i.test(profile.avatar)) {
            avatarEl.innerHTML = `<img src="${profile.avatar}" alt="avatar" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
        } else {
            avatarEl.textContent = profile.avatar || '👤';
        }
    }
}

// Setup profile interactions (navigate to edit page and reuse existing interactions)
function setupProfileInteractions() {
    // Make both the header/profile action edit button and sidebar edit button navigate to edit page
    const headerEditBtn = document.querySelector('.edit-btn');
    const sidebarEditBtn = document.querySelector('.edit-profile-btn');

    [headerEditBtn, sidebarEditBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function() {
                window.location.href = 'Edit.html';
            });
        }
    });

    // Like and follow handlers
    document.addEventListener('click', function(e) {
        if (e.target.closest('.like-btn')) {
            handleLike(e);
        }
        if (e.target.closest('.follow-btn')) {
            handleFollow(e);
        }
    });
}

// Handle like
function handleLike(e) {
    const likeBtn = e.target.closest('.like-btn');
    const postId = likeBtn.dataset.postId;
    const post = placeholderPosts.find(p => p.id == postId);

    if (post) {
        post.liked = !post.liked;
        if (post.liked) {
            post.likes++;
            likeBtn.classList.add('liked');
        } else {
            post.likes--;
            likeBtn.classList.remove('liked');
        }
        updatePostStats(postId, post);
    }
}

// Handle follow
function handleFollow(e) {
    const followBtn = e.target.closest('.follow-btn');
    const userId = followBtn.dataset.userId;
    const user = suggestedUsers.find(u => u.id == userId);

    if (user) {
        user.following = !user.following;
        if (user.following) {
            followBtn.textContent = 'Following';
            followBtn.classList.add('following');
        } else {
            followBtn.textContent = 'Follow';
            followBtn.classList.remove('following');
        }
    }
}

// Update post stats
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
