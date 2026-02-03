// Settings Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    setupSettingsMenu();
    setupToggleCheckboxes();
    setupThemeOptions();
    setupFontOptions();
    setupFormButtons();
});

// Setup settings menu navigation
function setupSettingsMenu() {
    const menuItems = document.querySelectorAll('.settings-menu-item');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionName = this.dataset.section;

            // Remove active from all items and sections
            menuItems.forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.settings-section').forEach(section => {
                section.classList.remove('active');
            });

            // Add active to clicked item and corresponding section
            this.classList.add('active');
            document.getElementById(sectionName + '-section').classList.add('active');
        });
    });
}

// Setup toggle checkboxes
function setupToggleCheckboxes() {
    const toggleCheckboxes = document.querySelectorAll('.toggle-checkbox');

    toggleCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.closest('.toggle-item').querySelector('label').textContent;
            const status = this.checked ? 'enabled' : 'disabled';
            showSettingNotification(`${label} ${status}`);
        });
    });
}

// Setup theme options
function setupThemeOptions() {
    const themeOptions = document.querySelectorAll('.theme-option');

    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');

            const theme = this.textContent.trim();
            showSettingNotification(`Theme changed to ${theme}`);
        });
    });
}

// Setup font options
function setupFontOptions() {
    const fontOptions = document.querySelectorAll('.font-option');

    fontOptions.forEach(option => {
        option.addEventListener('click', function() {
            fontOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');

            const fontSize = this.textContent.trim();
            showSettingNotification(`Font size changed to ${fontSize}`);
        });
    });
}

// Setup form buttons
function setupFormButtons() {
    // Edit email button
    const editEmailBtn = document.querySelector('.edit-setting-btn');
    if (editEmailBtn) {
        editEmailBtn.addEventListener('click', function() {
            alert('Email change functionality coming soon!');
        });
    }

    // Save phone button
    const savePhoneBtn = document.querySelector('.save-setting-btn');
    if (savePhoneBtn) {
        savePhoneBtn.addEventListener('click', function() {
            const phoneInput = this.previousElementSibling;
            if (phoneInput && phoneInput.value) {
                showSettingNotification('Phone number saved successfully!');
            }
        });
    }

    // Change password
    const changePasswordBtns = document.querySelectorAll('.edit-setting-btn');
    if (changePasswordBtns.length > 1) {
        changePasswordBtns[1].addEventListener('click', function() {
            alert('Password change functionality coming soon!');
        });
    }

    // Deactivate account
    const deactivateBtn = document.querySelector('.danger-btn');
    if (deactivateBtn) {
        deactivateBtn.addEventListener('click', function() {
            const confirmed = confirm('Are you sure you want to deactivate your account? This action cannot be undone.');
            if (confirmed) {
                alert('Account deactivation request submitted. Your account will be deactivated in 7 days.');
            }
        });
    }

    // Unblock buttons
    const unblockBtns = document.querySelectorAll('.unblock-btn');
    unblockBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const blockedUser = this.closest('.blocked-user');
            const userName = blockedUser.querySelector('.blocked-name').textContent;
            blockedUser.remove();
            showSettingNotification(`${userName} has been unblocked`);
        });
    });

    // Settings button in notifications
    const settingsBtn = document.querySelector('.settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            document.querySelector('.settings-menu-item[data-section="notifications"]').click();
        });
    }

    // Help link
    const helpLink = document.querySelector('.help-link');
    if (helpLink) {
        helpLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Help center functionality coming soon!');
        });
    }
}

// Show setting notification
function showSettingNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-weight: bold;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Populate blocked users (if any)
function loadBlockedUsers() {
    const blockedListContainer = document.getElementById('blocked-users');
    
    // For demo, we'll assume no blocked users initially
    // In a real app, this would be populated from server data
    const blockedUsers = [
        // { id: 1, name: 'Spam User', avatar: '🚫' }
    ];

    if (blockedUsers.length === 0) {
        return;
    }

    blockedListContainer.innerHTML = '';

    blockedUsers.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'blocked-user';

        userElement.innerHTML = `
            <div class="blocked-user-info">
                <div class="blocked-avatar">${user.avatar}</div>
                <div class="blocked-name">${user.name}</div>
            </div>
            <button class="unblock-btn">Unblock</button>
        `;

        blockedListContainer.appendChild(userElement);
    });
}

// Initialize blocked users on load
loadBlockedUsers();
