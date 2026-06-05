const express = require("express");

const {
  getForecast,
  searchForecasts,
} = require("../controllers/weather.controller");

const router = express.Router();

/**
 * @openapi
 * /api/weather/forecast:
 *   post:
 *     summary: Get weather forecast for a location
 *     description: Returns a weather forecast for the specified location using OpenWeather Geocoding and Forecast APIs.
 *     tags:
 *       - Weather
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *             properties:
 *               location:
 *                 type: string
 *                 example: Delhi
 *               days:
 *                 type: integer
 *                 example: 3
 *                 description: Number of forecast days requested. Maximum supported value is 5.
 *     responses:
 *       200:
 *         description: Forecast retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     city:
 *                       type: string
 *                       example: Delhi
 *                     country:
 *                       type: string
 *                       example: IN
 *                     forecast:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             example: 2026-06-05
 *                           minTemperature:
 *                             type: number
 *                             example: 28
 *                           maxTemperature:
 *                             type: number
 *                             example: 38
 *                           description:
 *                             type: string
 *                             example: clear sky
 *       400:
 *         description: Invalid request payload.
 *       404:
 *         description: Location not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/forecast", getForecast);

/**
 * @openapi
 * /api/weather/search:
 *   post:
 *     summary: Search locations and retrieve forecasts
 *     description: Searches locations matching the provided query and returns weather forecasts for each matching location.
 *     tags:
 *       - Weather
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 example: de
 *               days:
 *                 type: integer
 *                 example: 3
 *               limit:
 *                 type: integer
 *                 example: 10
 *                 description: Maximum number of matching locations to return.
 *     responses:
 *       200:
 *         description: Forecasts retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalLocations:
 *                       type: integer
 *                       example: 10
 *                     successfulCount:
 *                       type: integer
 *                       example: 8
 *                     failedCount:
 *                       type: integer
 *                       example: 2
 *                     results:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           city:
 *                             type: string
 *                             example: Delhi
 *                           country:
 *                             type: string
 *                             example: IN
 *                           forecast:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 date:
 *                                   type: string
 *                                 minTemperature:
 *                                   type: number
 *                                 maxTemperature:
 *                                   type: number
 *                                 description:
 *                                   type: string
 *                     failures:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           city:
 *                             type: string
 *                             example: Detroit
 *                           country:
 *                             type: string
 *                             example: US
 *                           message:
 *                             type: string
 *                             example: Unable to fetch forecast
 *       400:
 *         description: Invalid request payload.
 *       404:
 *         description: No locations found.
 *       500:
 *         description: Internal server error.
 */
router.post("/search", searchForecasts);

module.exports = router;