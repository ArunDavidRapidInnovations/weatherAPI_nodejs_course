require('dotenv').config();
const request = require('postman-request');
const chalk = require('chalk');
const geoip = require('geoip-lite');
const mapbox_api_key = process.env.MAPBOX_API_KEY;
const weather = require('./weather');

const mapbox_url = (apikey, query) =>
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${apikey}&limit=1&type=place`;

const geoencode = (type = 'ip', query = 'Hyderabad', callback) => {
  if (type == 'ip') {
    if (query == '127.0.0.1') {
      request({ url: 'http://ipinfo.io/ip' }, (err, { body }) => {
        if (err) {
          return callback(
            { message: 'cannot Reach the ipinfo API' },
            undefined,
          );
        }

        // ip lookup to get current location
        const currentLocation = geoip.lookup(body);
        let tempData = {
          latitude: currentLocation.ll[0],
          longitude: currentLocation.ll[1],
          location: currentLocation.city,
        };
        weather(
          tempData.latitude,
          tempData.longitude,
          (
            weatherError,
            { weather_descriptions, temperature, feelslike, imgurl } = {},
          ) => {
            if (weatherError) {
              return callback({ message: weatherError.message }, undefined);
            }
            callback(undefined, {
              weather_descriptions,
              temperature,
              feelslike,
              location: tempData.location,
              imgurl,
            });
          },
        );
      });
    } else {
      const currentLocation = geoip.lookup(query);
      let tempData = {
        latitude: currentLocation.ll[0],
        longitude: currentLocation.ll[1],
        location: currentLocation.city,
      };
      weather(
        tempData.latitude,
        tempData.longitude,
        (
          weatherError,
          { weather_descriptions, temperature, feelslike, imgurl } = {},
        ) => {
          if (weatherError) {
            return callback({ message: weatherError.message }, undefined);
          }
          callback(undefined, {
            weather_descriptions,
            temperature,
            feelslike,
            location: tempData.location,
            imgurl,
          });
        },
      );
    }
  } else {
    request(
      { url: mapbox_url(mapbox_api_key, query), json: true },
      (err, { body }) => {
        if (err) {
          return callback(
            { message: 'cannot Reach the map box API' },
            undefined,
          );
        }

        if (body.features.length == 0) {
          return callback(
            {
              message:
                'There are no locations with that name, please try with something else',
            },
            undefined,
          );
        }
        const tempData = {
          latitude: body.features[0].center[1],
          longitude: body.features[0].center[0],
          location: body.features[0].place_name,
        };
        weather(
          tempData.latitude,
          tempData.longitude,
          (
            weatherError,
            { weather_descriptions, temperature, feelslike, imgurl } = {},
          ) => {
            if (weatherError) {
              return callback({ message: weatherError.message }, undefined);
            }
            callback(undefined, {
              weather_descriptions,
              temperature,
              feelslike,
              location: tempData.location,
              imgurl,
            });
          },
        );
      },
    );
  }
};

module.exports = geoencode;
