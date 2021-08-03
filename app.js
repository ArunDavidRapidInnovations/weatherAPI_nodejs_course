require('dotenv').config();
const request = require('postman-request');
const yargs = require('yargs');
const chalk = require('chalk');
const weather = require('./utils/weather');
const geoencode = require('./utils/geoencode');

yargs.command({
  command: 'ip',
  description: 'Ip based wether info',
  handler(argv) {
    geoencode('ip', '', (geoError, geoData) => {
      if (geoError) {
        return console.log(chalk.red.inverse(geoError.message));
      }
      weather(
        geoData.latitude,
        geoData.longitude,
        (weatherError, weatherData) => {
          if (weatherError) {
            return console.log(chalk.red.inverse(weatherError.message));
          }
          console.log(
            `Your current location is ${chalk.yellow(geoData.location)}`,
          );
          console.log(
            `its ${chalk.green(
              weatherData.weather_descriptions,
            )} in ${chalk.yellow(geoData.location)}. Its ${chalk.green(
              weatherData.temperature,
            )} degrees out but it feels like ${chalk.green(
              weatherData.feelslike,
            )} degrees.`,
          );
        },
      );
    });
  },
});

yargs.command({
  command: 'mapbox',
  description: 'mapbox location based wether info',
  builder: {
    q: {
      describe: 'Query string, this can be city name or village name',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    geoencode('mapbox', argv.q, (geoError, geoData) => {
      if (geoError) {
        return console.log(chalk.red.inverse(geoError.message));
      }
      weather(
        geoData.latitude,
        geoData.longitude,
        (weatherError, weatherData) => {
          if (weatherError) {
            return console.log(chalk.red.inverse(weatherError.message));
          }
          console.log(
            `Your current location is ${chalk.yellow(geoData.location)}`,
          );
          console.log(
            `its ${chalk.green(
              weatherData.weather_descriptions,
            )} in ${chalk.yellow(geoData.location)}. Its ${chalk.green(
              weatherData.temperature,
            )} degrees out but it feels like ${chalk.green(
              weatherData.feelslike,
            )} degrees.`,
          );
        },
      );
    });
  },
});

yargs.parse();
