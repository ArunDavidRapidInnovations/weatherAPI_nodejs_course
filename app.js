require('dotenv').config();
const request = require('postman-request');
const yargs = require('yargs');
const ipbasedWeather = require('./ipBasedLocation');
const mapboxBasedWeather = require('./mapboxLocationWeather');
const weather_api_key = process.env.WEATHER_API_KEY;
const mapbox_api_key = process.env.MAPBOX_API_KEY;

yargs.command({
  command: 'ip',
  description: 'Ip based wether info',
  handler(argv) {
    ipbasedWeather(weather_api_key);
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
    console.log(argv.q);
    mapboxBasedWeather(mapbox_api_key, weather_api_key, argv.q);
  },
});

yargs.parse();
