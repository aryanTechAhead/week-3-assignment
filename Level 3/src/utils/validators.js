const {
  MAX_FORECAST_DAYS,
  MIN_FORECAST_DAYS,
  MIN_SEARCH_LIMIT,
  MAX_SEARCH_LIMIT
} = require("../constants/weather.constants");

// validateForecastRequest
const validateForecastRequest = (location, days) => {
  if (!location || typeof location !== "string" || !location.trim()) {
    throw new Error("Please provide a location.");
  }

  if (days === undefined) {
    return;
  }

  if (typeof days !== "number") {
    throw new Error("Days must be a number.");
  }

  if (days < MIN_FORECAST_DAYS) {
    throw new Error("Days must be greater than 0.");
  }

  if (days > MAX_FORECAST_DAYS) {
    throw new Error(
      `Maximum forecast range supported is ${MAX_FORECAST_DAYS} days.`,
    );
  }
};

// validateSearchRequest

const validateSearchRequest = (query, days, limit) => {
  if (!query || typeof query !== "string" || !query.trim()) {
    throw new Error("Please provide a search query.");
  }

  if (days !== undefined && typeof days !== "number") {
    throw new Error("Days must be a number.");
  }

  if (days !== undefined && days < MIN_FORECAST_DAYS) {
    throw new Error("Days must be greater than 0.");
  }

  if (days !== undefined && days > MAX_FORECAST_DAYS) {
    throw new Error(
      `Maximum forecast range supported is ${MAX_FORECAST_DAYS} days.`,
    );
  }

  if (limit !== undefined && typeof limit !== "number") {
    throw new Error("Limit must be a number.");
  }

  if (limit !== undefined && limit < MIN_SEARCH_LIMIT) {
    throw new Error("Limit must be greater than 0.");
  }
  if (limit !== undefined && limit > MAX_SEARCH_LIMIT) {
    throw new Error(`Limit cannot exceed ${MAX_SEARCH_LIMIT}`);
  }
};

module.exports = {
  validateForecastRequest,
  validateSearchRequest,
};
