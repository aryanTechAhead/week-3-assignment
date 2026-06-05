# Weather Forecast API

## Overview

This project is a small Express.js API that provides:

- Weather forecast search and retrieval using OpenWeather APIs.
- Example external API usage with JSONPlaceholder endpoints for todos, users, and posts.
- Swagger documentation available at `/api-docs`.

The app uses a clean folder structure to separate routes, controllers, services, constants, and utility helpers.

## Folder Structure

```
Level 3/
 ├── .env
 ├── package.json
 ├── README.md
 ├── server.js
 └── src/
     ├── app.js
     ├── constants/
     │   ├── api.constants.js
     │   └── weather.constants.js
     ├── controllers/
     │   ├── api.controller.js
     │   └── weather.controller.js
     ├── routes/
     │   ├── api.routes.js
     │   └── weather.routes.js
     ├── services/
     │   ├── externalApi.service.js
     │   └── weather.service.js
     └── utils/
         ├── retry.js
         └── validators.js
```

## Entry Point

- `server.js` is the app entry point.
- It loads environment variables using `dotenv`.
- It configures Swagger documentation and mounts it at `/api-docs`.
- It imports the Express app from `src/app.js` and starts the server on port `3000`.

## Express App Setup

- `src/app.js` creates the Express application.
- It registers JSON body parsing with `express.json()`.
- It defines a root route `/` to confirm the app is running.
- It mounts:
  - `src/routes/api.routes.js` at `/api`
  - `src/routes/weather.routes.js` at `/api/weather`

## Routes

### Weather Routes (`src/routes/weather.routes.js`)

This file defines two endpoints:

- `POST /api/weather/forecast`
  - Accepts `location` and optional `days`.
  - Returns a weather forecast for a single location.

- `POST /api/weather/search`
  - Accepts `query`, optional `days`, and optional `limit`.
  - Searches matching locations and returns forecasts for each.

This file also contains Swagger JSDoc comments to document request bodies and responses.

### API Routes (`src/routes/api.routes.js`)

This file defines basic example endpoints for external API consumption:

- `GET /api/todos/:userId`
  - Fetches todos for the specified user and returns counts.
- `GET /api/users`
  - Returns a small list of example users.
- `GET /api/posts`
  - Returns paginated posts.

## Controllers

Controllers handle HTTP request validation, call business logic services, and return structured API responses.

### Weather Controller (`src/controllers/weather.controller.js`)

- `getForecast(req, res)`
  - Reads `location` and `days` from `req.body`.
  - Validates input using `validateForecastRequest` from `src/utils/validators.js`.
  - Calls `getLocationForecast(location, days)` from `src/services/weather.service.js`.
  - Returns JSON with `success: true` and `data` on success.
  - Returns `400` or `404` depending on the error.

- `searchForecasts(req, res)`
  - Reads `query`, `days`, and `limit` from `req.body`.
  - Validates input using `validateSearchRequest`.
  - Calls `searchLocationsForecast(query, days, limit)` from `src/services/weather.service.js`.
  - Returns structured results or an error.

### API Controller (`src/controllers/api.controller.js`)

These controllers handle other example routes and call `src/services/externalApi.service.js`:

- `getTodos(req, res)`
- `getUsersController(req, res)`
- `getPosts(req, res)`

Errors from external calls are handled with `500` responses when the service throws.

## Services

The `src/services` folder is where the business logic lives. It is the layer that interacts with external APIs, transforms data, and returns results to controllers.

### Weather Service (`src/services/weather.service.js`)

This service is the core of the weather functionality.

- `getLocationForecast(location, days)`
  - Uses `getCoordinates(location)` from `src/services/externalApi.service.js` to resolve location coordinates.
  - Uses `getFiveDayForecast(lat, lon)` to fetch forecast data.
  - Converts the raw forecast into daily summaries with `transformForecastData(...)`.
  - Respects `MAX_FORECAST_DAYS` and caps the requested forecast length.

- `searchLocationsForecast(query, days, limit)`
  - Uses `searchLocations(query, limit)` from `src/services/externalApi.service.js`.
  - Fetches the forecast for each matching location.
  - Returns an array of forecast summaries.

#### Data transformation logic

- `transformForecastData(city, country, forecastData, days)`
  - Groups 3-hour forecast records by date.
  - Calculates `minTemperature` and `maxTemperature` for each day.
  - Keeps the first weather description available for the day.
  - Limits results to the requested number of days.

This separation is important:

- Controllers do not know how OpenWeather works.
- Services know how to fetch and reshape raw API data.
- The transformation ensures the response is simple and usable.

### External API Service (`src/services/externalApi.service.js`)

This one file serves two purposes:

1. Fetches weather data from OpenWeather endpoints.
2. Demonstrates making external requests against `jsonplaceholder.typicode.com`.

#### Weather-related functions

- `getCoordinates(location)`
  - Calls the OpenWeather geocoding API to find location coordinates.
  - Throws `Location not found` when the API returns no results.

- `searchLocations(query, limit)`
  - Calls the OpenWeather geocoding API with a search query.
  - Normalizes the query and filters results for better matches.
  - Removes duplicates and limits results.
  - Throws `No locations found` when there are no valid results.

- `getFiveDayForecast(lat, lon)`
  - Calls the OpenWeather 5-day forecast endpoint.
  - Returns the raw forecast object for transformation.

#### Example JSONPlaceholder functions

- `getTodosByUser(userId)`
- `getUsers()`
- `getPaginatedPosts()`

These functions show how to call third-party APIs and use the retry helper when needed.

## Constants

The `src/constants` folder centralizes configuration values.

### `src/constants/weather.constants.js`

This file contains reusable weather-related values:

- `OPEN_WEATHER_BASE_URL` – read from `.env`
- `DEFAULT_FORECAST_DAYS` – default days when none provided
- `MAX_FORECAST_DAYS` – maximum request size supported
- `DEFAULT_SEARCH_LIMIT` – default number of locations returned for search
- `MIN_FORECAST_DAYS` and `MIN_SEARCH_LIMIT` – lower bounds for validation
- `MAX_SEARCH_LIMIT` – maximum allowed search limit

These constants ensure the app behavior is consistent across controllers and services.

### `src/constants/api.constants.js`

This file exports:

- `BASE_URL` – the JSONPlaceholder base URL used by example API functions.

## Utilities

### `src/utils/validators.js`

This file contains validation logic used by controllers to ensure the request body is correct.

- `validateForecastRequest(location, days)`
  - Ensures `location` is a non-empty string.
  - Ensures `days` is a number within allowed range.

- `validateSearchRequest(query, days, limit)`
  - Ensures `query` is valid.
  - Ensures optional `days` and `limit` values are within safe boundaries.

### `src/utils/retry.js`

A retry wrapper for external network requests.

- `fetchWithRetry(fetchFunction, retries = 3)`
  - Calls `fetchFunction()` and retries on failure up to 3 times.
  - Logs each attempt failure.
  - Throws the final error if all retries fail.

The weather service uses this helper around the OpenWeather fetch calls so intermittent network errors do not immediately break a request.

## Environment Variables

The app needs the following values in `.env`:

- `OPEN_WEATHER_API_KEY` – your OpenWeather API key.
- `OPEN_WEATHER_BASE_URL` – base URL for OpenWeather API calls.

Example values are already stored in the included `.env` file for local testing.

## How Request Flow Works

1. Client sends HTTP request to a route in `src/routes/*.js`.
2. The route delegates work to a controller function.
3. Controller validates the request body using `src/utils/validators.js`.
4. Controller calls a service function in `src/services/*.js`.
5. Service functions call external APIs using `src/services/externalApi.service.js`.
6. Raw response data is transformed by service helpers like `transformForecastData`.
7. Controller sends a JSON response back to the client.

## Running the Project

Install dependencies:

```bash
npm install
```

Start the server in development mode:

```bash
npm run dev
```

The API will run on `http://localhost:3000`.

Open Swagger docs at:

```bash
http://localhost:3000/api-docs
```

## Example Routes

### Weather

- `POST /api/weather/forecast`
  - Request body:
    ```json
    {
      "location": "Delhi",
      "days": 3
    }
    ```

- `POST /api/weather/search`
  - Request body:
    ```json
    {
      "query": "del",
      "days": 3,
      "limit": 5
    }
    ```

### Example External API endpoints

- `GET /api/todos/:userId`
- `GET /api/users`
- `GET /api/posts`

## Notes for Junior Developers

- The `controllers` layer handles HTTP and validation.
- The `services` layer handles business logic and external API calls.
- The `constants` folder keeps shared values in one place.
- The `utils` folder holds reusable helpers.
- Swagger documentation lives in route files via JSDoc comments.

This structure is easy to extend:

- Add new endpoints in `src/routes/*.js`.
- Add new request handling in `src/controllers/*.js`.
- Add business logic in `src/services/*.js`.
- Keep validation in `src/utils/validators.js`.
- Update shared settings in `src/constants/*.js`.
