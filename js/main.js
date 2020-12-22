import { getImg, getMap, getMapByCity } from './api.js';

// get main elemenets from html
const city = document.getElementById('city');
const date = document.getElementById('date');
const time = document.getElementById('time');
const currentTemp = document.getElementById('current-temperature');
const weatherImg = document.getElementById('current-weather-img');
const weatherDesc = document.getElementById('weather-desc');
const weatherFeels = document.getElementById('weather-feels-like');
const windSpd = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');

// Forecast
const forecastFirst = document.getElementById('forecast-day-1');
const forecastFirstTemp = document.getElementById('forecast-day-1-temp');
const forecastFirstImg = document.getElementById('forecast-day-1-img');

const forecastSec = document.getElementById('forecast-day-2');
const forecastSecTemp = document.getElementById('forecast-day-2-temp');
const forecastSecImg = document.getElementById('forecast-day-2-img');

const forecastThird = document.getElementById('forecast-day-3');
const forecastThirdTemp = document.getElementById('forecast-day-3-temp');
const forecastThirdImg = document.getElementById('forecast-day-3-img');

// search input & button
const searchInput = document.getElementById('header-search-input');
const searchButton = document.getElementById('header-search-button');

// latitude, longitude, map
const latitude = document.getElementById('latitude');
const longitude = document.getElementById('longitude');
// const map = document.getElementById('map');

// refresh bg button
const refreshBg = document.getElementById('refresh-button');

// units
const tempSelect = document.getElementById('temperature-unit');

function assignLatLong(lat, long) {
  latitude.textContent = `${lat.toFixed(2)}'`.replace('.', '°');
  longitude.textContent = `${long.toFixed(2)}'`.replace('.', '°');
}

function assignWeather(data, cityName) {
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
}

function assignMap(data) {
  const { lat } = data.city.coord;
  const long = data.city.coord.lon;

  assignLatLong(lat, long);
}

// get weather info from api & invoke assign function
function getWeather(cityName, unit) {
  const apiKey = 'd947bf1a0211edc7f91dcb84156c547a';
  const weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&lang=en&units=${unit}&APPID=${apiKey}`;
  fetch(weatherAPI)
    .then((res) => res.json())
    .then((data) => {
      assignWeather(data, cityName);
      assignMap(data);
    });
}

function weatherByUnit(chosenCity) {
  getWeather(chosenCity, tempSelect.value);
  tempSelect.onchange = () => {
    getWeather(chosenCity, tempSelect.value);
  };
}

function getCurrentCity(lat, long) {
  const apikey = 'e4f7ce76ece34f5fa88d15a1e67d9f9f';
  const apiUrl = 'https://api.opencagedata.com/geocode/v1/json';
  const url = `${apiUrl}?`
    + `key=${apikey}&q=${encodeURIComponent(`${lat},${long}`)}&pretty=1`
    + '&no_annotations=1';

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      weatherByUnit(data.results[0].components.city);
    });
}

// get current lat/long & assign info

if (navigator.geolocation) {
  // get current latitude & longitude
  navigator.geolocation.getCurrentPosition((position) => {
    const long = position.coords.longitude;
    const lat = position.coords.latitude;

    // assing latitude & longitude
    assignLatLong(lat, long);
    // display map
    getMap(lat, long);

    getCurrentCity(lat, long);
  });
}

// get city name from input and display info
searchButton.addEventListener('click', () => {
  if (searchInput.value.length === 0 || searchInput.value.match(/^ *$/) !== null) {
    searchInput.classList.add('invalid');
    searchInput.placeholder = 'Empty Field';
  } else {
    getMapByCity(searchInput.value);
    weatherByUnit(searchInput.value);
    searchInput.classList.remove('invalid');
  }
});

// display date & time
function clockTick() {
  const d = new Date();
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  const fullWeekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
  ];

  // get current & forecast days
  const currentWeekday = weekday[d.getDay()];
  const secondDay = fullWeekday[d.getDay() + 1];
  const thirdDay = fullWeekday[d.getDay() + 2];
  const fourthDay = fullWeekday[d.getDay() + 3];

  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // assign current time
  const currentMonth = month[d.getMonth()];
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
  const hours = time.textContent.split(':')[0];
  if (hours > 17) {
    getImg('night');
  } else {
    getImg('morning');
  }
}

// change background image on refresh button click
refreshBg.addEventListener('click', () => {
  getImgByTime();
});

// change background image on page load
window.addEventListener('load', () => {
  getImgByTime();
});

// hides page loader
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.querySelector('.loader');
    loader.className += ' hidden';
  }, 3000);
});

// ellipsis animation

const lds = document.getElementsByClassName('lds-ellipsis')[0];
for (let i = 0; i < 4; i += 1) {
  const loadingCircles = document.createElement('div');
  lds.appendChild(loadingCircles);
}

// search button animation

for (let i = 0; i < 4; i += 1) {
  const spans = document.createElement('span');
  searchButton.appendChild(spans);
}
