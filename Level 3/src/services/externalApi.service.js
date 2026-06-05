const fetchWithRetry = require("../utils/retry");
const { OPEN_WEATHER_BASE_URL } = require("../constants/weather.constants");
const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;
const { BASE_URL } = require("../constants/api.constants");

const getTodosByUser = async (userId) => {
  const todos = await fetchWithRetry(async () => {
    const response = await fetch(`${BASE_URL}/todos?userId=${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch todos");
    }

    return response.json();
  });

  const completedTodos = todos.filter((todo) => todo.completed).length;

  return {
    totalTodos: todos.length,
    completedTodos,
    todos,
  };
};

const getUsers = async () => {
  const users = await Promise.all([
    fetch(`${BASE_URL}/users/1`).then((res) => res.json()),

    fetch(`${BASE_URL}/users/2`).then((res) => res.json()),

    fetch(`${BASE_URL}/users/3`).then((res) => res.json()),
  ]);

  return users.map((user) => ({
    name: user.name,
    company: user.company.name,
  }));
};

const getPaginatedPosts = async () => {
  const posts = [];

  for (let page = 1; page <= 5; page++) {
    const response = await fetch(`${BASE_URL}/posts?_page=${page}&_limit=10`);

    if (!response.ok) {
      throw new Error(`Failed page ${page}`);
    }

    const data = await response.json();

    posts.push(...data);
  }

  return {
    totalPosts: posts.length,
    posts,
  };
};

//   Weather Project Logics

const getCoordinates = async (location) => {
  const locations = await fetchWithRetry(async () => {
    const response = await fetch(
      `${OPEN_WEATHER_BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(
        location,
      )}&limit=1&appid=${OPEN_WEATHER_API_KEY}`,
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch coordinates. Status: ${response.status}`,
      );
    }

    return response.json();
  });

  if (!Array.isArray(locations) || locations.length === 0) {
    throw new Error("Location not found");
  }

  const [locationData] = locations;

  return {
    name: locationData.name,
    country: locationData.country,
    lat: locationData.lat,
    lon: locationData.lon,
  };
};

// const searchLocations = async (query, limit) => {
//   const locations = await fetchWithRetry(async () => {
//     const response = await fetch(
//       `${OPEN_WEATHER_BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(
//         query,
//       )}&limit=${limit}&appid=${OPEN_WEATHER_API_KEY}`,
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to search locations. Status: ${response.status}`);
//     }

//     return response.json();
//   });

//   if (!Array.isArray(locations) || locations.length === 0) {
//     throw new Error("No locations found");
//   }

//   return locations.map((location) => ({
//     name: location.name,
//     country: location.country,
//     lat: location.lat,
//     lon: location.lon,
//   }));
// };

// Updated Search location with the duplication issue
// const searchLocations = async (query, limit) => {
//   const fetchLimit = Math.max(limit * 3, 20);

//   const locations = await fetchWithRetry(async () => {
//     const response = await fetch(
//       `${OPEN_WEATHER_BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(
//         query,
//       )}&limit=${fetchLimit}&appid=${OPEN_WEATHER_API_KEY}`,
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to search locations. Status: ${response.status}`);
//     }

//     return response.json();
//   });

//   if (!Array.isArray(locations) || locations.length === 0) {
//     throw new Error("No locations found");
//   }

//   const filteredLocations = locations.filter((location) =>
//     location?.name?.toLowerCase().startsWith(query.toLowerCase()),
//   );

//   if (filteredLocations.length === 0) {
//     throw new Error("No locations found");
//   }

//   return filteredLocations.slice(0, limit).map((location) => ({
//     name: location.name,
//     country: location.country,
//     lat: location.lat,
//     lon: location.lon,
//   }));
// };

// Filtered response function
const searchLocations = async (query, limit) => {
  const normalizedQuery = query.trim().toLowerCase();

  const fetchLimit = Math.max(limit * 3, 20);

  const locations = await fetchWithRetry(async () => {
    const response = await fetch(
      `${OPEN_WEATHER_BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(
        normalizedQuery,
      )}&limit=${fetchLimit}&appid=${OPEN_WEATHER_API_KEY}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to search locations. Status: ${response.status}`);
    }
    return response.json();
  });

  if (!Array.isArray(locations) || locations.length === 0) {
    throw new Error("No locations found");
  }
  console.log("The locations the API returned are");
  console.log(locations);
  const filteredLocations = locations.filter(
    (location) =>
      location?.name?.toLowerCase().startsWith(normalizedQuery) &&
      location.name.trim().length > 1,
  );
  console.log("Filtered locations");
  console.log(filteredLocations);
  if (filteredLocations.length === 0) {
    throw new Error("No locations found");
  }

  const uniqueLocations = [
    ...new Map(
      filteredLocations.map((location) => [
        `${location.name}-${location.country}`,
        location,
      ]),
    ).values(),
  ];

  uniqueLocations.sort((a, b) => a.name.length - b.name.length);

  return uniqueLocations.slice(0, limit).map((location) => ({
    name: location.name,
    country: location.country,
    lat: location.lat,
    lon: location.lon,
  }));
};

const getFiveDayForecast = async (lat, lon) => {
  const forecast = await fetchWithRetry(async () => {
    const response = await fetch(
      `${OPEN_WEATHER_BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}&units=metric`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch forecast. Status: ${response.status}`);
    }

    return response.json();
  });

  if (!forecast?.list) {
    throw new Error("Invalid forecast response received");
  }

  return forecast;
};

module.exports = {
  getTodosByUser,
  getUsers,
  getPaginatedPosts,
  getCoordinates,
  searchLocations,
  getFiveDayForecast,
};
