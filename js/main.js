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
function getWeather(cityName) {
  let weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&lang=en&units=metric&APPID=d947bf1a0211edc7f91dcb84156c547a`;
  fetch(weatherAPI)
    .then((res) => res.json())
    .then((data) => {
      // lat & long
      let lat = data.city.coord.lat;
      let long = data.city.coord.lon;
      getMap(lat, long);
      assignLatLong(lat, long);
      // city
      console.log(data);
      city.textContent = `${cityName}, ${data.city.country}`;

      // assign current weather info
      currentTemp.textContent = data.list[1].main.temp.toFixed(0);
      weatherDesc.textContent = data.list[1].weather[0].description;
      weatherFeels.textContent = data.list[1].main.feels_like.toFixed(0);
      windSpd.textContent = data.list[1].wind.speed.toFixed(0);
      humidity.textContent = data.list[1].main.humidity;

      weatherImg.src = `http://openweathermap.org/img/wn/${data.list[1].weather[0].icon}@4x.png`;

      // assign forecast weather info
      forecastFirstTemp.textContent = data.list[9].main.temp.toFixed(0);
      forecastFirstImg.src = `http://openweathermap.org/img/wn/${data.list[9].weather[0].icon}@2x.png`;

      forecastSecTemp.textContent = data.list[17].main.temp.toFixed(0);
      forecastSecImg.src = `http://openweathermap.org/img/wn/${data.list[17].weather[0].icon}@2x.png`;

      forecastThirdTemp.textContent = data.list[25].main.temp.toFixed(0);
      forecastThirdImg.src = `http://openweathermap.org/img/wn/${data.list[25].weather[0].icon}@2x.png`;
    });
}

function assignLatLong(lat, long) {
  latitude.textContent = `${lat.toFixed(2)}'`.replace(".", "°");
  longitude.textContent = `${long.toFixed(2)}'`.replace(".", "°");
}

function getMap(lat, long) {
  mapboxgl.accessToken =
    "pk.eyJ1IjoibWFyaWFtbWFudmVsaWR6ZSIsImEiOiJja2lkMWV3djQwNTRvMnVyd3NibGl1bWhoIn0.6J6Vnfk6deSuWUapxzAfSQ";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [long, lat],
    zoom: 8,
  });

  new mapboxgl.Marker().setLngLat([long, lat]).addTo(map);
}

//

let long;
let lat;

if (navigator.geolocation) {
  // get current latitude & longitude
  navigator.geolocation.getCurrentPosition((position) => {
    long = position.coords.longitude;
    lat = position.coords.latitude;

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
        getWeather(data.results[0].components.city);
      });
  });
}

searchButton.addEventListener("click", () => {
  if (searchInput) {
    getWeather(searchInput.value);
  } else {
    alert("Input empty or incorrect city name");
  }
});

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

function celsToFahr() {
  currentTemp = currentTemp * 1.8 + 32;
  weatherFeels = weatherFeels * 1.8 + 32;
  forecastFirstTemp = forecastFirstTemp * 1.8 + 32;
  forecastSecTemp = forecastSecTemp * 1.8 + 32;
  forecastThirdTemp = forecastThirdTemp * 1.8 + 32;
}

// here we run the clockTick function every 1000ms (1 second)
setInterval(clockTick, 1000);

function getImg() {
  const url =
    "https://api.unsplash.com/photos/random?query=morning&client_id=9NLuf3a7wuVVxqyAYgl-7b6mMgPGlOi5jvFetI5yUt4";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      document.body.style.backgroundImage = `url(${data.urls.regular})`;
    });
}

refreshBg.addEventListener("click", () => {
  getImg();
});
