async function fetchWithRetry(fetchFunction, retries = 3) {
  let attempt = 1;

  while (attempt <= retries) {
    try {
      return await fetchFunction();
    } catch (error) {
      console.error(`Attempt ${attempt} failed  ${error.message}`);

      if (attempt === retries) {
        throw error;
      }

      attempt++;
    }
  }
}

module.exports = fetchWithRetry;
