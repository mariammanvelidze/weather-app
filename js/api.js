export function getMap(lat, long) {
  mapboxgl.accessToken =
    "pk.eyJ1IjoibWFyaWFtbWFudmVsaWR6ZSIsImEiOiJja2lkMWV3djQwNTRvMnVyd3NibGl1bWhoIn0.6J6Vnfk6deSuWUapxzAfSQ";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [long, lat],
    zoom: 8,
  });
}

export function getMapByCity(city) {
  mapboxgl.accessToken =
    "pk.eyJ1IjoibWFyaWFtbWFudmVsaWR6ZSIsImEiOiJja2lkMWV3djQwNTRvMnVyd3NibGl1bWhoIn0.6J6Vnfk6deSuWUapxzAfSQ";
  var mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
  mapboxClient.geocoding
    .forwardGeocode({
      query: `${city}`,
      autocomplete: false,
      limit: 1,
    })
    .send()
    .then(function (response) {
      if (
        response &&
        response.body &&
        response.body.features &&
        response.body.features.length
      ) {
        var feature = response.body.features[0];

        var map = new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/mapbox/streets-v11",
          center: feature.center,
          zoom: 8,
        });
      }
    });
}

export function getImg(timeOfTheDay) {
  const url = `https://api.unsplash.com/photos/random?query=${timeOfTheDay}&client_id=9NLuf3a7wuVVxqyAYgl-7b6mMgPGlOi5jvFetI5yUt4`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      document.body.style.backgroundImage = `url(${data.urls.regular})`;
    });
}
