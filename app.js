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
    geoencode('ip', '', (geoError, { latitude, longitude, location } = {}) => {
      if (geoError) {
        return console.log(chalk.red.inverse(geoError.message));
      }
      weather(
        latitude,
        longitude,
        (
          weatherError,
          { weather_descriptions, temperature, feelslike } = {},
        ) => {
          if (weatherError) {
            return console.log(chalk.red.inverse(weatherError.message));
          }
          console.log(`Your current location is ${chalk.yellow(location)}`);
          console.log(
            `its ${chalk.green(weather_descriptions)} in ${chalk.yellow(
              location,
            )}. Its ${chalk.green(
              temperature,
            )} degrees out but it feels like ${chalk.green(
              feelslike,
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
    geoencode(
      'mapbox',
      argv.q,
      (geoError, { latitude, longitude, location } = {}) => {
        if (geoError) {
          return console.log(chalk.red.inverse(geoError.message));
        }
        weather(
          latitude,
          longitude,
          (
            weatherError,
            { weather_descriptions, temperature, feelslike } = {},
          ) => {
            if (weatherError) {
              return console.log(chalk.red.inverse(weatherError.message));
            }
            console.log(`Your current location is ${chalk.yellow(location)}`);
            console.log(
              `its ${chalk.green(weather_descriptions)} in ${chalk.yellow(
                location,
              )}. Its ${chalk.green(
                temperature,
              )} degrees out but it feels like ${chalk.green(
                feelslike,
              )} degrees.`,
            );
          },
        );
      },
    );
  },
});

yargs.parse();
