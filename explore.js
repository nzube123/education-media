// Explore Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadExploreFeed();
    setupCategoryFilters();
    setupSortOptions();
    setupMainSearch();
});

// Load explore feed
function loadExploreFeed(category = 'all', sortBy = 'trending') {
    const exploreFeed = document.getElementById('explore-feed');
    exploreFeed.innerHTML = '';

    // Get posts and optionally filter by category
    let posts = [...placeholderPosts];

    // For demo, we'll just shuffle the posts for different categories
    if (category !== 'all') {
        posts = posts.filter((post, index) => index % 2 === 0);
    }

    // Sort posts
    if (sortBy === 'latest') {
        posts.reverse();
    } else if (sortBy === 'popular') {
        posts.sort((a, b) => b.likes - a.likes);
    }

    posts.forEach(post => {
        const postCard = createExplorePostCard(post);
        exploreFeed.appendChild(postCard);
    });
}

// Create explore post card
function createExplorePostCard(post) {
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

// Setup category filters
function setupCategoryFilters() {
    const categoryBtns = document.querySelectorAll('.category-btn');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;
            const sortBy = document.querySelector('.sort-btn.active').dataset.sort;
            loadExploreFeed(category, sortBy);
        });
    });
}

// Setup sort options
function setupSortOptions() {
    const sortBtns = document.querySelectorAll('.sort-btn');

    sortBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            sortBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const sortBy = this.dataset.sort;
            const category = document.querySelector('.category-btn.active').dataset.category;
            loadExploreFeed(category, sortBy);
        });
    });
}

// Setup main search
function setupMainSearch() {
    const searchInput = document.getElementById('main-search');

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query) {
                alert(`Searching for: "${query}"\n\nSearch results will be displayed here.`);
                this.value = '';
            }
        }
    });
}

// Setup post actions (like, comment, share)
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
});

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

// Handle comment
function handleComment(e) {
    alert('Comment feature coming soon!');
}

// Handle share
function handleShare(e) {
    const shareBtn = e.target.closest('.share-btn');
    const postId = shareBtn.dataset.postId;
    const post = placeholderPosts.find(p => p.id == postId);

    if (post) {
        post.shares++;
        updatePostStats(postId, post);
        alert('Post shared successfully!');
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
