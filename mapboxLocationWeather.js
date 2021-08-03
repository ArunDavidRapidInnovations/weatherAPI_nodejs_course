const request = require('postman-request');
const chalk = require('chalk');
const mapbox_url = (apikey, query) =>
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${apikey}&limit=1&type=place`;

const url = (apikey, lat, log) =>
  `http://api.weatherstack.com/current?access_key=${apikey}&query=${lat},${log}&units=m`;

const mapBoxWeather = (api_key, wether_api_key, txt) => {
  request({ url: mapbox_url(api_key, txt), json: true }, (err, res) => {
    if (err) {
      console.log(chalk.red.inverse('cannot Reach the map box API'));
      return;
    }

    if (res.body.features.length == 0) {
      console.log(
        chalk.red.inverse(
          ' There are no locations with that name, please try with something else ',
        ),
      );
      return;
    }
    const currentLocation = res.body.features[0];

    console.log(
      `Your current location is ${chalk.yellow(currentLocation.place_name)}`,
    );
    // request to get current location weather data
    request(
      {
        url: url(
          wether_api_key,
          currentLocation.center[1],
          currentLocation.center[0],
        ),
        json: true,
      },
      (er, wres) => {
        if (er) {
          console.log(
            chalk.red.inverse(
              'There was an error connecting with the weather API',
            ),
          );
          return;
        }

        const jsonData = wres.body;
        if (jsonData.error) {
          console.log(
            chalk.red.inverse(
              'Cannot get the wether for this location. please try again with other location',
            ),
          );
          return;
        }
        console.log(
          `its ${chalk.green(
            jsonData.current.weather_descriptions[0],
          )} in ${chalk.yellow(currentLocation.place_name)}. Its ${chalk.green(
            jsonData.current.temperature,
          )} degrees out but it feels like ${chalk.green(
            jsonData.current.feelslike,
          )} degrees.`,
        );
      },
    );
  });
};

module.exports = mapBoxWeather;
