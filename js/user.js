document.addEventListener('DOMContentLoaded', function() {
    GetProfile()
});

function GetProfile() {
const Profile = document.getElementById("user-profile")
Profile.innerHTML = '';
   
    const user = Users[1];
    const profileCard = HomeProfile(user)
    Profile.appendChild(profileCard);
}

function HomeProfile(user) {
    const profileCard = document.createElement('div');
    profileCard.className = 'post-card';
    profileCard.dataset.userId = user.id;


    profileCard.innerHTML = `
    <div class="user-avatar">${user.avatar}</div>
                <h3>${user.name}</h3>
                <p>${user.userName}</p>
                <div class="user-stats">
                    <div class="stat">
                        <span class="stat-count">${user.followers}</span>
                        <span class="stat-label">Followers</span>
                    </div>
                    <div class="stat">
                        <span class="stat-count">${user.following}</span>
                        <span class="stat-label">Following</span>
                    </div>
                </div>
               <a href="Edit.html"> <button class="edit-profile-btn">Edit Profile</button></a>
    `

    return profileCard;
}