

const BASE_URL = "https://jsonplaceholder.typicode.com";

/**
 * Utility: Retry a failed request up to maxRetries times.
 */
async function fetchWithRetry(url, maxRetries = 3) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      attempt++;

      console.error(
        `Attempt ${attempt}/${maxRetries} failed`
      );

      if (attempt >= maxRetries) {
        throw new Error(
          `Failed after ${maxRetries} attempts`
        );
      }
    }
  }
}

/**
 * Task 1
 * Fetch all todos for a user and count completed ones.
 */
async function getTodosByUser(userId) {
  try {
    const todos = await fetchWithRetry(
      `${BASE_URL}/todos?userId=${userId}`
    );

    const completedCount = todos.filter(
      todo => todo.completed
    ).length;

    console.log("TODOS ");
    console.log(`User ID: ${userId}`);
    console.log(`Total Todos: ${todos.length}`);
    console.log(`Completed Todos: ${completedCount}`);

    return todos;
  } catch (error) {
    console.error(
      "Failed to fetch todos:",
      error.message
    );
  }
}

console.log(getTodosByUser(1))
/**
 * Task 2
 * Fetch users 1,2,3 simultaneously.
 */
async function getUsers() {
  try {
    const users = await Promise.all([
      fetchWithRetry(`${BASE_URL}/users/1`),
      fetchWithRetry(`${BASE_URL}/users/2`),
      fetchWithRetry(`${BASE_URL}/users/3`)
    ]);
    // throw new Error("Something went wrong");
    console.log(" USERS ");

    users.forEach(user => {
        
      console.log(
        `${user.name} - ${user.company.name}`
      );
    });

    return users;
  } catch (error) {
    console.error(
      "Failed to fetch users:",
      error.message
    );
  }
}
console.log(getUsers())
/**
 * Task 3
 * Auto-pagination (pages 1..5).
 */
async function fetchAllPosts() {
  try {
    const allPosts = [];

    for (let page = 1; page <= 5; page++) {
      const posts = await fetchWithRetry(
        `${BASE_URL}/posts?_page=${page}&_limit=10`
      );

      console.log(
        `Fetched page ${page} (${posts.length} posts)`
      );

      allPosts.push(...posts);
    }

    console.log("POSTS ");
    console.log(
      `Total Posts Fetched: ${allPosts.length}`
    );

    return allPosts;
  } catch (error) {
    console.error(
      "Pagination failed:",
      error.message
    );
  }
}
console.log(fetchAllPosts())