// Notifications Page JavaScript

const placeholderNotifications = [
    {
        id: 1,
        type: 'like',
        user: 'Sarah Johnson',
        handle: '@sarahjohnson',
        avatar: '👩‍💻',
        message: 'liked your post',
        timestamp: '2 minutes ago',
        unread: true,
        postPreview: 'Just launched my new portfolio website...'
    },
    {
        id: 2,
        type: 'follow',
        user: 'Alex Chen',
        handle: '@alexchen',
        avatar: '👨‍🎨',
        message: 'started following you',
        timestamp: '15 minutes ago',
        unread: true,
        action: 'Follow Back'
    },
    {
        id: 3,
        type: 'comment',
        user: 'Emily Rodriguez',
        handle: '@emilyrodriguez',
        avatar: '👩‍🔬',
        message: 'commented on your post',
        timestamp: '1 hour ago',
        unread: true,
        comment: 'Amazing work! Love the design.'
    },
    {
        id: 4,
        type: 'like',
        user: 'Mike Thompson',
        handle: '@mikethompson',
        avatar: '👨‍💼',
        message: 'liked your post',
        timestamp: '3 hours ago',
        unread: false,
        postPreview: 'Just finished reading Clean Code by Robert C. Martin...'
    },
    {
        id: 5,
        type: 'like',
        user: 'Lisa Wang',
        handle: '@lisawang',
        avatar: '👩‍🏫',
        message: 'liked your post',
        timestamp: '5 hours ago',
        unread: false,
        postPreview: 'Beautiful sunset at the coding conference today...'
    },
    {
        id: 6,
        type: 'mention',
        user: 'David Park',
        handle: '@davidpark',
        avatar: '👨‍💻',
        message: 'mentioned you in a post',
        timestamp: '8 hours ago',
        unread: false,
        mentionPreview: '@johndoe you should check this out!'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    loadNotifications();
    setupFilters();
    setupNotificationActions();
});

// Load notifications
function loadNotifications(filter = 'all') {
    const container = document.getElementById('notifications-container');
    container.innerHTML = '';

    let filteredNotifications = placeholderNotifications;

    if (filter !== 'all') {
        filteredNotifications = placeholderNotifications.filter(n => n.type === filter);
    }

    if (filteredNotifications.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--secondary-color); padding: 40px 20px;">No notifications</p>';
        return;
    }

    filteredNotifications.forEach(notification => {
        const notifElement = createNotificationElement(notification);
        container.appendChild(notifElement);
    });

    updateUnreadCount();
}

// Create notification element
function createNotificationElement(notification) {
    const notifDiv = document.createElement('div');
    notifDiv.className = `notification-item ${notification.unread ? 'unread' : ''}`;
    notifDiv.dataset.notifId = notification.id;

    let contentHTML = `<div class="notification-content">
        <div class="notification-text">
            <strong>${notification.user}</strong> ${notification.message}
        </div>`;

    if (notification.postPreview) {
        contentHTML += `<div class="notification-text" style="margin-top: 5px; color: var(--secondary-color); font-size: 12px;">${notification.postPreview}</div>`;
    }

    if (notification.comment) {
        contentHTML += `<div class="notification-text" style="margin-top: 5px; color: var(--secondary-color); font-size: 12px;">"${notification.comment}"</div>`;
    }

    if (notification.mentionPreview) {
        contentHTML += `<div class="notification-text" style="margin-top: 5px; color: var(--secondary-color); font-size: 12px;">${notification.mentionPreview}</div>`;
    }

    contentHTML += `<div class="notification-time">${notification.timestamp}</div>
    </div>`;

    const actionHTML = notification.action ? `<button class="notification-action">${notification.action}</button>` : '';

    notifDiv.innerHTML = `
        <div class="notification-avatar">${notification.avatar}</div>
        ${contentHTML}
        ${actionHTML}
    `;

    return notifDiv;
}

// Setup filters
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;
            loadNotifications(filter);
        });
    });
}

// Setup notification actions
function setupNotificationActions() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.notification-action')) {
            const btn = e.target.closest('.notification-action');
            const notifItem = btn.closest('.notification-item');
            const notifId = notifItem.dataset.notifId;
            const notification = placeholderNotifications.find(n => n.id == notifId);

            if (notification && notification.action === 'Follow Back') {
                btn.textContent = 'Following';
                btn.style.backgroundColor = 'var(--border-color)';
                btn.style.color = 'var(--text-color)';
            }
        }

        // Mark as read on click
        if (e.target.closest('.notification-item')) {
            const notifItem = e.target.closest('.notification-item');
            const notifId = notifItem.dataset.notifId;
            const notification = placeholderNotifications.find(n => n.id == notifId);

            if (notification && notification.unread) {
                notification.unread = false;
                notifItem.classList.remove('unread');
                updateUnreadCount();
            }
        }
    });

    // Mark all as read
    const markAllBtn = document.querySelector('.mark-all-btn');
    if (markAllBtn) {
        markAllBtn.addEventListener('click', function() {
            placeholderNotifications.forEach(n => n.unread = false);
            document.querySelectorAll('.notification-item').forEach(item => {
                item.classList.remove('unread');
            });
            updateUnreadCount();
        });
    }
}

// Update unread count
function updateUnreadCount() {
    const unreadCount = placeholderNotifications.filter(n => n.unread).length;
    const unreadBadge = document.getElementById('unread-count');
    if (unreadBadge) {
        unreadBadge.textContent = unreadCount;
    }
}
