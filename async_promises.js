function fetchUserData(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve({
                    id: userId,
                    name: `Mujahid ${userId}`,
                    email: `moegamad101${userId}@icloud.com`,
                    registrationDate: new Date().toISOString()
                });
            } else {
                reject(new Error("Invalid userId"));
            }
        }, 1500);
    });
}


function generateUserHTML(user) {
    return `
        <div class="user-card">
            <h2>${user.name}</h2>
            <p>Email: ${user.email}</p>
            <p>Registered on: ${new Date(user.registrationDate).toDateString()}</p>
        </div>
    `;
}


function fetchUserPosts(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                const posts = [
                    { id: 1, title: "Post 1", content: "Content 1", userId },
                    { id: 2, title: "Post 2", content: "Content 2", userId },
                    { id: 3, title: "Post 3", content: "Content 3", userId },
                ];
                resolve(posts);
            } else {
                reject(new Error("User posts not found"));
            }
        }, 1000);
    });
}


function fetchUserWithPosts(userId) {
    return fetchUserData(userId)
        .then(user => {
            return fetchUserPosts(user.id).then(posts => {
                return { ...user, posts };
            });
        })
        .catch(err => {
            console.error("Error fetching user or posts:", err.message);
            throw err;
        });
}


async function fetchUserWithPostsAsync(userId) {
    try {
        console.log("Fetching user data...");
        const user = await fetchUserData(userId);
        console.log("User data fetched:", user);

        console.log("Fetching user posts...");
        const posts = await fetchUserPosts(user.id);
        console.log("User posts fetched:", posts);

        return { ...user, posts };
    } catch (error) {
        console.error("Error in async fetch:", error.message);
        throw error;
    }
}


async function fetchMultipleUsers(userIds) {
    const promises = userIds.map(id =>
        fetchUserData(id).catch(err => {
            console.error(`Failed to fetch user ${id}: ${err.message}`);
            return null; 
        })
    );

    const users = await Promise.all(promises);
    return users.filter(u => u !== null); 
}


async function fetchUsersWithPosts(userIds) {
    const users = await fetchMultipleUsers(userIds);

    const postsPromises = users.map(user =>
        fetchUserPosts(user.id)
            .then(posts => ({ ...user, posts }))
            .catch(err => {
                console.error(`Failed to fetch posts for user ${user.id}: ${err.message}`);
                return { ...user, posts: [] }; 
            })
    );

    const usersWithPosts = await Promise.all(postsPromises);
    return usersWithPosts;
}



(async () => {
    const singleUser = await fetchUserWithPostsAsync(1);
    console.log(singleUser);
    console.log(generateUserHTML(singleUser));

    console.log("\n=== Multiple users fetch ===");
    const multipleUsers = await fetchMultipleUsers([1, 2, -3, 4]);
    console.log(multipleUsers);

    console.log("\n=== Multiple users with posts ===");
    const usersWithPosts = await fetchUsersWithPosts([1, 2, 3]);
    console.log(usersWithPosts);

    console.log("\n=== Error handling test ===");
    try {
        await fetchUserWithPostsAsync(-1);
    } catch (error) {
        console.log("Caught error as expected:", error.message);
    }
})();