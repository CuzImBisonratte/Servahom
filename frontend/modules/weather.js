const weather_title_current = document.getElementsByClassName("weather-title_current")[0];
const weather_title_day = document.getElementsByClassName("weather-title_day")[0];
const weather_title_prev1 = document.getElementsByClassName("weather-title_prev1")[0];
const weather_icon_current = document.getElementsByClassName("weather-icon_current")[0];
const weather_icon_prev1 = document.getElementsByClassName("weather-icon_prev1")[0];
const weather_icon_day = document.getElementsByClassName("weather-icon_day")[0];
const weather_temp_current = document.getElementsByClassName("weather-temp_current")[0];
const weather_temp_prev1 = document.getElementsByClassName("weather-temp_prev1")[0];
const weather_temp_day = document.getElementsByClassName("weather-temp_day")[0];

// Request weather data
fetch("/api/weather")
    .then((response) => {
        return response.json();
    })
    .then((data) => {

        // Set current weather
        weather_icon_current.innerHTML = "<img src='/api/weather/icons/" + data.list[0].weather[0].icon + "' />";
        weather_temp_current.innerHTML = data.list[0].main.temp + "°C";

        // Set prev1 weather
        weather_icon_prev1.innerHTML = "<img src='/api/weather/icons/" + data.list[1].weather[0].icon + "' />";
        weather_temp_prev1.innerHTML = data.list[1].main.temp + "°C";

        // Set day weather
        weather_icon_day.innerHTML = "<img src='/api/weather/icons/" + data.list[8].weather[0].icon + "' />";
        weather_temp_day.innerHTML = data.list[8].main.temp + "°C";

        // Set weather city
        document.getElementById("weather-city").innerHTML = data.city.name;
    })
    .catch((error) => {
        console.error("Error:", error);
    });
