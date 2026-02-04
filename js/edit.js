// Edit Profile page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('editProfileForm');
    const nameInput = document.getElementById('nameInput');
    const handleInput = document.getElementById('handleInput');
    const bioInput = document.getElementById('bioInput');
    const locationInput = document.getElementById('locationInput');
    const websiteInput = document.getElementById('websiteInput');
    const avatarInput = document.getElementById('avatarInput');
    const avatarPreview = document.getElementById('avatarPreview');
    const cancelBtn = document.getElementById('cancelBtn');

    // Load stored profile or defaults
    const stored = getStoredProfile();

    nameInput.value = stored.name || '';
    handleInput.value = stored.handle || '';
    bioInput.value = stored.bio || '';
    locationInput.value = stored.location || '';
    websiteInput.value = stored.website || '';
    avatarInput.value = stored.avatar || '';

    updateAvatarPreview(avatarInput.value);

    avatarInput.addEventListener('input', function() {
        updateAvatarPreview(this.value);
    });

    cancelBtn.addEventListener('click', function() {
        window.location.href = 'profile.html';
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const profile = {
            name: nameInput.value || 'John Doe',
            handle: handleInput.value || '@johndoe',
            bio: bioInput.value || '',
            location: locationInput.value || '',
            website: websiteInput.value || '',
            avatar: avatarInput.value || '👤',
            joined: stored.joined || 'Joined March 2020'
        };

        try {
            localStorage.setItem('userProfile', JSON.stringify(profile));
            // Optionally show a tiny confirmation
            alert('Profile saved');
            window.location.href = 'profile.html';
        } catch (err) {
            console.error('Failed to save profile', err);
            alert('Could not save profile. Please try again.');
        }
    });

    function getStoredProfile() {
        try {
            return JSON.parse(localStorage.getItem('userProfile')) || {};
        } catch (e) {
            return {};
        }
    }

    function updateAvatarPreview(value) {
        if (!avatarPreview) return;
        if (!value) {
            avatarPreview.textContent = '👤';
            return;
        }
        if (/^https?:\/\//i.test(value)) {
            avatarPreview.innerHTML = `<img src="${value}" alt="avatar" style="width:100%; height:100%; object-fit:cover;">`;
        } else {
            avatarPreview.textContent = value;
        }
    }
});