const request = require('postman-request');

const mapbox_url = (apikey, query) =>
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${apikey}&limit=1`;

const url = (apikey, lat, log) =>
  `http://api.weatherstack.com/current?access_key=${apikey}&query=${lat},${log}&units=m`;

const mapBoxWeather = (api_key, wether_api_key, txt) => {
  request({ url: mapbox_url(api_key, txt), json: true }, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }

    const currentLocation = res.body.features[0];

    console.log(`Your current location is ${currentLocation.place_name}`);

    // request to get current location weather data
    request(
      {
        url: url(
          wether_api_key,
          currentLocation.center[0],
          currentLocation.center[1],
        ),
        json: true,
      },
      (er, wres) => {
        if (er) {
          console.log(er);
          return;
        }
        const jsonData = wres.body;
        console.log(
          `its ${jsonData.current.weather_descriptions[0]} in ${currentLocation.place_name}. Its ${jsonData.current.temperature} degrees out but it feels like ${jsonData.current.feelslike} degrees.`,
        );
      },
    );
  });
};

module.exports = mapBoxWeather;
