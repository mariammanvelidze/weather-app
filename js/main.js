import { getImg, getMap, getMapByCity } from "./api.js";

// get main elemenets from html
let city = document.getElementById("city");
let date = document.getElementById("date");
let time = document.getElementById("time");
let currentTemp = document.getElementById("current-temperature");
let weatherImg = document.getElementById("current-weather-img");
let weatherDesc = document.getElementById("weather-desc");
let weatherFeels = document.getElementById("weather-feels-like");
let windSpd = document.getElementById("wind-speed");
let humidity = document.getElementById("humidity");

// Forecast
let forecastFirst = document.getElementById("forecast-day-1");
let forecastFirstTemp = document.getElementById("forecast-day-1_temp");
let forecastFirstImg = document.getElementById("forecast-day-1_img");

let forecastSec = document.getElementById("forecast-day-2");
let forecastSecTemp = document.getElementById("forecast-day-2_temp");
let forecastSecImg = document.getElementById("forecast-day-2_img");

let forecastThird = document.getElementById("forecast-day-3");
let forecastThirdTemp = document.getElementById("forecast-day-3_temp");
let forecastThirdImg = document.getElementById("forecast-day-3_img");

// search input & button
let searchInput = document.getElementById("header-search-input");
let searchButton = document.getElementById("header-search-button");

// latitude, longitude, map
let latitude = document.getElementById("latitude");
let longitude = document.getElementById("longitude");
let map = document.getElementById("map");

// refresh bg button
let refreshBg = document.getElementById("refresh-button");

// units
let fahrUnit = document.getElementById("temperature-units_fahr");
let celsUnit = document.getElementById("temperature-units_cels");

// get weather info from api & assign
function getWeather(cityName, unit) {
  let weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&lang=en&units=${unit}&APPID=d947bf1a0211edc7f91dcb84156c547a`;
  fetch(weatherAPI)
    .then((res) => res.json())
    .then((data) => {
      // lat & long
      let lat = data.city.coord.lat;
      let long = data.city.coord.lon;
      // getMap(lat, long);
      assignLatLong(lat, long);
      // city
      city.textContent = `${cityName}, ${data.city.country}`;

      // assign current weather info
      currentTemp.textContent = data.list[0].main.temp.toFixed(0);
      weatherDesc.textContent = data.list[0].weather[0].description;
      weatherFeels.textContent = data.list[0].main.feels_like.toFixed(0);
      windSpd.textContent = data.list[0].wind.speed.toFixed(0);
      humidity.textContent = data.list[0].main.humidity;

      weatherImg.src = `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@4x.png`;

      // assign forecast weather info
      forecastFirstTemp.textContent = data.list[8].main.temp.toFixed(0);
      forecastFirstImg.src = `http://openweathermap.org/img/wn/${data.list[9].weather[0].icon}@2x.png`;

      forecastSecTemp.textContent = data.list[16].main.temp.toFixed(0);
      forecastSecImg.src = `http://openweathermap.org/img/wn/${data.list[17].weather[0].icon}@2x.png`;

      forecastThirdTemp.textContent = data.list[24].main.temp.toFixed(0);
      forecastThirdImg.src = `http://openweathermap.org/img/wn/${data.list[25].weather[0].icon}@2x.png`;
    });
}

function assignLatLong(lat, long) {
  latitude.textContent = `${lat.toFixed(2)}'`.replace(".", "°");
  longitude.textContent = `${long.toFixed(2)}'`.replace(".", "°");
}

// get current city & assign info

if (navigator.geolocation) {
  // get current latitude & longitude
  navigator.geolocation.getCurrentPosition((position) => {
    let long = position.coords.longitude;
    let lat = position.coords.latitude;

    // assing latitude & longitude
    assignLatLong(lat, long);
    // display map
    getMap(lat, long);

    // get current city
    const apikey = "e4f7ce76ece34f5fa88d15a1e67d9f9f";
    const api_url = "https://api.opencagedata.com/geocode/v1/json";
    let url =
      api_url +
      "?" +
      "key=" +
      apikey +
      "&q=" +
      encodeURIComponent(lat + "," + long) +
      "&pretty=1" +
      "&no_annotations=1";

    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // get & assign current location weather info
        // has to change ??
        getWeather(data.results[0].components.city, "metric");
        fahrUnit.addEventListener("click", () => {
          getWeather(data.results[0].components.city, "imperial");
          fahrUnit.classList.remove("inactive");
          celsUnit.classList.add("inactive");
        });
        celsUnit.addEventListener("click", () => {
          getWeather(data.results[0].components.city, "metric");
          fahrUnit.classList.add("inactive");
          celsUnit.classList.remove("inactive");
        });
      });
  });
}

// get city name from input and display info
searchButton.addEventListener("click", () => {
  getMapByCity(searchInput.value);
  getWeather(searchInput.value, "metric");
  setToCels();
  fahrUnit.addEventListener("click", () => {
    getWeather(searchInput.value, "imperial");
    fahrUnit.classList.remove("inactive");
    celsUnit.classList.add("inactive");
  });
  celsUnit.addEventListener("click", () => {
    getWeather(searchInput.value, "metric");
    fahrUnit.classList.add("inactive");
    celsUnit.classList.remove("inactive");
  });
});

function setToCels() {
  fahrUnit.classList.add("inactive");
  celsUnit.classList.remove("inactive");
}

// display date & time
function clockTick() {
  let d = new Date();
  let weekday = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  let fullWeekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // get current & forecast days
  let currentWeekday = weekday[d.getDay()];
  let secondDay = fullWeekday[d.getDay() + 1];
  let thirdDay = fullWeekday[d.getDay() + 2];
  let fourthDay = fullWeekday[d.getDay() + 3];

  let month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // assign current time
  let currentMonth = month[d.getMonth()];
  date.textContent = `${currentWeekday} ${d.getDate()} ${currentMonth}`;
  time.textContent = `${d.getHours()}:${d.getMinutes()}`;

  // assign week days to forecast
  forecastFirst.textContent = secondDay;
  forecastSec.textContent = thirdDay;
  forecastThird.textContent = fourthDay;
}

// here we run the clockTick function every 1000ms (1 second)
setInterval(clockTick, 1000);

// gets background image according to time (day/night)
function getImgByTime() {
  let hours = time.textContent.split(":")[0];
  if (hours > 17) {
    getImg("night");
  } else {
    getImg("morning");
  }
}

// change background image on refresh button click
refreshBg.addEventListener("click", () => {
  getImgByTime();
});

// change background image on page load
window.addEventListener("load", () => {
  getImgByTime();
});
