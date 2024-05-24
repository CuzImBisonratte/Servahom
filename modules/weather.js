const config = require("../config.json");
const log = require("../log.js");
var axios = require("axios").default;

// Set up API options
var api_options = {
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/forecast',
    params: { lat: config.weather.lat, lon: config.weather.lon, appid: config.weather.api_key }
};

var lastResponse = {
    time: 0,
    data: {}
}

/**
 * Internal function to get new weather data from the OpenWeatherMap API and cache it
 * @returns {Promise} A promise that resolves when the data is fetched
 * @throws {Error} If the API request fails
 * @example newData().then(() => console.log("Data fetched"));
 */
newData = () => {
    return new Promise((resolve, reject) => {
        axios.request(api_options).then((response) => {
            lastResponse.time = Date.now();
            lastResponse.data = response.data;
            resolve();
        }).catch((error) => {
            reject(error.response.status + " - " + error.response.statusText);
        });
    });
}

/**
 * Get the weather data from the cache or fetch it from the API if it is outdated
 * @returns {Promise} A promise that resolves with the weather data
 * @throws {Error} If the API request fails
 * @example getWeather().then((data) => console.log(data));
 */
getWeather = () => {
    return new Promise((resolve, reject) => {
        if (lastResponse.time + config.weather.timeout * 1000 < Date.now()) {
            log.log("Refreshing weather data", 0);
            newData().then(() => {
                resolve(lastResponse.data);
            }).catch((error) => {
                reject(error);
            });
        } else {
            resolve(lastResponse.data);
        }
    });
}

// Initialize the weather module
log.log("Initializing weather module", 0);
getWeather().then(() => log.log("Weather module initialized", 3)).catch((error) => log.log("Error initializing weather module: " + error, 2));

module.exports = { getWeather };