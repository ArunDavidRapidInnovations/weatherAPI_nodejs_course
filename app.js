require('dotenv').config();
const request = require('postman-request');

const api_key = process.env.API_KEY;

const url = `http://api.weatherstack.com/current?access_key=${api_key}&query=17.3850,78.4867`;

request(url, (err, res) => {
  if (err) {
    console.log(err);
    return;
  }
  const jsonData = JSON.parse(res.body);
  console.log(jsonData);
});
