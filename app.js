require('dotenv').config();
const request = require('postman-request');

const geoip = require('geoip-lite');

const api_key = process.env.API_KEY;

const url = (apikey, lat, log) =>
  `http://api.weatherstack.com/current?access_key=${apikey}&query=${lat},${log}&units=m`;

// Request to get current IP
request({ url: 'http://ipinfo.io/ip' }, (err, res) => {
  if (err) {
    console.log(err);
    return;
  }

  // ip lookup to get current location
  const currentLocation = geoip.lookup(res.body);
  console.log(`Your current location is ${currentLocation.city}`);

  //request to get current location weather data
  request(
    {
      url: url(api_key, currentLocation.ll[0], currentLocation.ll[1]),
      json: true,
    },
    (er, wres) => {
      if (er) {
        console.log(er);
        return;
      }
      const jsonData = wres.body;
      console.log(
        `its ${jsonData.current.weather_descriptions[0]} in ${currentLocation.city}. Its ${jsonData.current.temperature} degrees out but it feels like ${jsonData.current.feelslike} degrees.`,
      );
    },
  );
});
