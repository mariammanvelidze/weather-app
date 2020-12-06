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

function getWeather(city) {
  let weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=en&units=metric&APPID=d947bf1a0211edc7f91dcb84156c547a`;
  fetch(weatherAPI)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      // assign current weather info
      currentTemp.textContent = data.list[1].main.temp.toFixed(0);
      weatherDesc.textContent = data.list[1].weather[0].main;
      weatherFeels.textContent = data.list[1].main.feels_like.toFixed(0);
      windSpd.textContent = data.list[1].wind.speed.toFixed(0);
      humidity.textContent = data.list[1].main.humidity;

      // assign forecast weather info
      forecastFirstTemp.textContent = data.list[9].main.temp.toFixed(0);
      forecastSecTemp.textContent = data.list[17].main.temp.toFixed(0);
      forecastThirdTemp.textContent = data.list[25].main.temp.toFixed(0);
    });
}

window.addEventListener("load", () => {
  let long;
  let lat;

  if (navigator.geolocation) {
    // get current latitude & longitude
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;

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
          // assign current location to html
          city.textContent = `${data.results[0].components.city}, ${data.results[0].components.country}`;

          // get & assign current location weather info
          getWeather(data.results[0].components.city);

          console.log(data);
        });
    });
  }

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
});
