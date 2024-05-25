// Modules
const express = require("express");
const axios = require("axios").default;

// Load config
const config = require("./config.json");

// Init express router
const router = express.Router();

// 
// API-Modules
// 

// Weather
const weather = require("./modules/weather.js");
router.get("/weather", (req, res, next) => {
    weather.getWeather().then((data) => {
        res.json(data);
    }).catch((error) => {
        res.send(error);
    });
});
router.get("/weather/icons/:icon", (req, res, next) => {
    if (!config.weather.icons.cache) axios.get("https://openweathermap.org/img/wn/" + req.params.icon + "@" + config.weather.icons.size + ".png", { responseType: "arraybuffer" }).then((response) => res.send(response.data));
    else weather.iconCacheHandler(req.params.icon, () => res.sendFile(__dirname + "/res/weather-icons/" + req.params.icon + ".png"));
});

// Upchecker
const upchecker = require("./modules/upchecker.js");
router.get("/upchecker", (req, res, next) => {
    res.json(upchecker.getStatuses());
});

module.exports = router;
