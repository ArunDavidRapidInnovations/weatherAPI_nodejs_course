const request = require('postman-request');
const chalk = require('chalk');
const geoip = require('geoip-lite');

const url = (apikey, lat, log) =>
  `http://api.weatherstack.com/current?access_key=${apikey}&query=${lat},${log}&units=m`;

const getWeatherDataBasedOnIp = (api_key) => {
  // Request to get current IP
  request({ url: 'http://ipinfo.io/ip' }, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }

    // ip lookup to get current location
    const currentLocation = geoip.lookup(res.body);
    console.log(
      `Your current location is ${chalk.yellow(currentLocation.city)}`,
    );
    console.log(currentLocation.ll[0], currentLocation.ll[1]);

    //request to get current location weather data
    request(
      {
        url: url(api_key, currentLocation.ll[0], currentLocation.ll[1]),
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
          )} in ${chalk.yellow(currentLocation.city)}. Its ${chalk.green(
            jsonData.current.temperature,
          )} degrees out but it feels like ${chalk.green(
            jsonData.current.feelslike,
          )} degrees.`,
        );
      },
    );
  });
};

module.exports = getWeatherDataBasedOnIp;
