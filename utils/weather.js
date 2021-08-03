require('dotenv').config();
const request = require('postman-request');
const chalk = require('chalk');
const weather_api_key = process.env.WEATHER_API_KEY;

const weather_url = (apikey, lat, log) =>
  `http://api.weatherstack.com/current?access_key=${apikey}&query=${lat},${log}&units=m`;

const weather = (latitude, longitude, callback) => {
  request(
    {
      url: weather_url(weather_api_key, latitude, longitude),
      json: true,
    },
    (er, wres) => {
      if (er) {
        return callback(
          { message: 'There was an error connecting with the weather API' },
          undefined,
        );
      }
      const jsonData = wres.body;
      if (jsonData.error) {
        return callback(
          {
            message:
              'Cannot get the wether for this location. please try again with other location',
          },
          undefined,
        );
      }

      callback(undefined, {
        weather_descriptions: jsonData.current.weather_descriptions[0],
        temperature: jsonData.current.temperature,
        feelslike: jsonData.current.feelslike,
      });
    },
  );
};

module.exports = weather;
