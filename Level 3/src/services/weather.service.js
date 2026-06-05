const {
  getCoordinates,
  searchLocations,
  getFiveDayForecast,
} = require("./externalApi.service");

const {
  DEFAULT_FORECAST_DAYS,
  DEFAULT_SEARCH_LIMIT,
  MAX_FORECAST_DAYS,
} = require("../constants/weather.constants");

// const transformForecastData = (
//   city,
//   country,
//   forecastData,
//   days
// ) => {
//   const dailyForecastMap = new Map();

//   forecastData.list.forEach((forecast) => {
//     const date = forecast.dt_txt.split(" ")[0];

//     if (!dailyForecastMap.has(date)) {
//       dailyForecastMap.set(date, {
//         date,
//         temperature: Math.round(
//           forecast.main.temp
//         ),
//         description:
//           forecast.weather?.[0]?.description ??
//           "No description available",
//       });
//     }
//   });

//   return {
//     city,
//     country,
//     forecast: Array.from(
//       dailyForecastMap.values()
//     ).slice(0, days),
//   };
// };

// Single Location Forecast

const transformForecastData = (city, country, forecastData, days) => {
  const dailyForecastMap = new Map();
  console.log("Forecast data is "+forecastData)
  forecastData.list.forEach((forecast) => {
    const date = forecast.dt_txt.split(" ")[0];

    const temperature = forecast?.main?.temp;
    if (temperature === undefined) {
      return;
    }

    const description =
      forecast?.weather?.[0]?.description ?? "No description available";

    if (!dailyForecastMap.has(date)) {
      dailyForecastMap.set(date, {
        date,
        minTemperature: temperature,
        maxTemperature: temperature,
        description,
      });

      return;
    }

    const existingForecast = dailyForecastMap.get(date);

    existingForecast.minTemperature = Math.min(
      existingForecast.minTemperature,
      temperature,
    );

    existingForecast.maxTemperature = Math.max(
      existingForecast.maxTemperature,
      temperature,
    );
  });

  return {
    city,
    country,
    forecast: Array.from(dailyForecastMap.values())
      .slice(0, days)
      .map((forecast) => ({
        ...forecast,
        minTemperature: Math.round(forecast.minTemperature),
        maxTemperature: Math.round(forecast.maxTemperature),
      })),
  };
};

const getLocationForecast = async (location, days = DEFAULT_FORECAST_DAYS) => {
  const forecastDays = Math.min(days, MAX_FORECAST_DAYS);

  const { name, country, lat, lon } = await getCoordinates(location);

  const forecastData = await getFiveDayForecast(lat, lon);

  return transformForecastData(name, country, forecastData, forecastDays);
};

// Search Multiple Locations
// const searchLocationsForecast =
//   async (
//     query,
//     days = DEFAULT_FORECAST_DAYS,
//     limit = DEFAULT_SEARCH_LIMIT
//   ) => {
//     const forecastDays = Math.min(
//       days,
//       MAX_FORECAST_DAYS
//     );

//     const locations =
//       await searchLocations(
//         query,
//         limit
//       );

//     // const results = await Promise.all(
//     //   locations.map(
//     //     async ({
//     //       name,
//     //       country,
//     //       lat,
//     //       lon,
//     //     }) => {
//     //       const forecastData =
//     //         await getFiveDayForecast(
//     //           lat,
//     //           lon
//     //         );

//     //       return transformForecastData(
//     //         name,
//     //         country,
//     //         forecastData,
//     //         forecastDays
//     //       );
//     //     }
//     //   )
//     // );
//     const forecastResults =
//   await Promise.allSettled(
//     locations.map(async (location) => {
//       const forecastData =
//         await getFiveDayForecast(
//           location.lat,
//           location.lon
//         );

//       return transformForecastData(
//         location.name,
//         location.country,
//         forecastData,
//         forecastDays
//       );
//     })
//   );

// return forecastResults
//   .filter(
//     (result) =>
//       result.status === "fulfilled"
//   )
//   .map((result) => result.value);

//     return results;
//   };

const searchLocationsForecast = async (
  query,
  days = DEFAULT_FORECAST_DAYS,
  limit = DEFAULT_SEARCH_LIMIT,
) => {
  const forecastDays = Math.min(days, MAX_FORECAST_DAYS);

  const locations = await searchLocations(query, limit);

  const results = await Promise.all(
    locations.map(async ({ name, country, lat, lon }) => {
      const forecastData = await getFiveDayForecast(lat, lon);

      return transformForecastData(name, country, forecastData, forecastDays);
    }),
  );

  return results;
};

module.exports = {
  getLocationForecast,
  searchLocationsForecast,
};
