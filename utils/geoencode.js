require('dotenv').config();
const request = require('postman-request');
const chalk = require('chalk');
const geoip = require('geoip-lite');
const mapbox_api_key = process.env.MAPBOX_API_KEY;

const mapbox_url = (apikey, query) =>
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${apikey}&limit=1&type=place`;

const geoencode = (type = 'ip', query = 'Hyderabad', callback) => {
  if (type == 'ip') {
    request({ url: 'http://ipinfo.io/ip' }, (err, res) => {
      if (err) {
        return callback({ message: 'cannot Reach the ipinfo API' }, undefined);
      }

      // ip lookup to get current location
      const currentLocation = geoip.lookup(res.body);

      return callback(undefined, {
        latitude: currentLocation.ll[0],
        longitude: currentLocation.ll[1],
        location: currentLocation.city,
      });
    });
  } else {
    request(
      { url: mapbox_url(mapbox_api_key, query), json: true },
      (err, res) => {
        if (err) {
          return callback(
            { message: 'cannot Reach the map box API' },
            undefined,
          );
        }

        if (res.body.features.length == 0) {
          return callback(
            {
              message:
                'There are no locations with that name, please try with something else',
            },
            undefined,
          );
        }
        const currentLocation = res.body.features[0];
        callback(undefined, {
          latitude: currentLocation.center[1],
          longitude: currentLocation.center[0],
          location: currentLocation.place_name,
        });
      },
    );
  }
};

module.exports = geoencode;
