const {
  getLocationForecast,
  searchLocationsForecast,
} = require("../services/weather.service");

const {
  validateForecastRequest,
  validateSearchRequest,
} = require("../utils/validators");

// get Forecast controller
const getForecast = async (req, res) => {
  try {
    const { location, days } = req.body;

    validateForecastRequest(location, days);

    const forecast = await getLocationForecast(location, days);

    return res.status(200).json({
      success: true,
      data: forecast,
    });
  } catch (error) {
    const statusCode = error.message === "Location not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// Search forecast controller

const searchForecasts = async (req, res) => {
  try {
    const { query, days, limit } = req.body;

    validateSearchRequest(query, days, limit);

    const results = await searchLocationsForecast(query, days, limit);
    console.log("Results after searching for each location");
    console.log(results);
    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    const statusCode = error.message === "No locations found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getForecast,
  searchForecasts,
};
