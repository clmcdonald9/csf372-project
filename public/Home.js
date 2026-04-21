async function fetchUserInfo() {
    try {
        const response = await fetch('/auth/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }
        
        const userInfo = await response.json();
        return userInfo;

    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    }
}

async function checkUserRole() {
    const userInfo = await fetchUserInfo();

    console.log("User info:", userInfo);

    if (!userInfo || !userInfo.loggedIn) {
        window.location.href = 'Login.html';
        return;
    }

}

checkUserRole();