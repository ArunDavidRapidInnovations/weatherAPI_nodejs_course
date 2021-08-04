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
    (er, { body }) => {
      if (er) {
        return callback(
          { message: 'There was an error connecting with the weather API' },
          undefined,
        );
      }
      if (body.error) {
        return callback(
          {
            message:
              'Cannot get the wether for this location. please try again with other location',
          },
          undefined,
        );
      }

      callback(undefined, {
        weather_descriptions: body.current.weather_descriptions[0],
        temperature: body.current.temperature,
        feelslike: body.current.feelslike,
      });
    },
  );
};

module.exports = weather;
