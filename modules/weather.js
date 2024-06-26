const config = require("../config.json");
const log = require("../log.js");
var axios = require("axios").default;
const fs = require("fs");

// Set up API options
var api_options = {
    method: 'GET',
    url: 'https://api.openweathermap.org/data/2.5/forecast',
    params: { lat: config.weather.lat, lon: config.weather.lon, appid: config.weather.api_key, units: 'metric' }
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
            log.log("Refreshing weather data", 0, "Weather");
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

cachedIcons = {};
/**
 * Cache a weather icon from the OpenWeatherMap API
 * @param {string} icon The icon name to cache
 * @param {function} cb The callback function to call when the icon is cached
 */
iconCacheHandler = (icon, cb) => {
    if (cachedIcons.hasOwnProperty(icon) && Date.now() - cachedIcons[icon].time < config.weather.icons.cacheTime * 1000) {
        cb();
        return;
    }
    log.log("Fetching weather-icon " + icon + " from OpenWeatherMap", 0, "Weather");
    axios.get("https://openweathermap.org/img/wn/" + icon + "@" + config.weather.icons.size + ".png", { responseType: "arraybuffer" }).then((response) => {
        fs.writeFileSync("./res/weather-icons/" + icon + ".png", response.data);
        cachedIcons[icon] = { time: Date.now() };
        cb();
    });
}

// Initialize the weather module
log.log("Initializing weather module", 0, "Weather");
getWeather().then(() => log.log("Received initial weather state", 3, "Weather")).catch((error) => log.log("Error initializing weather module: " + error, 2, "Weather"));
if (!fs.existsSync("./res/weather-icons")) {
    log.log("Creating weather-icon cache-directory", 0, "Weather");
    fs.mkdirSync("./res/weather-icons");
}
if (config.weather.icons.cache) config.weather.icons.precache.forEach((icon) => iconCacheHandler(icon, () => { }));

module.exports = { getWeather, iconCacheHandler };