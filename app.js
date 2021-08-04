const express = require('express');
const chalk = require('chalk');
const path = require('path');
const { green } = require('chalk');
const hbs = require('hbs');
const weather = require('./utils/weather');
const geoencode = require('./utils/geoencode');
const app = express();

// Define Paths
const publicPath = path.join(__dirname, 'public');
const viewsPath = path.join(__dirname, '/templates/views');
const partialsPath = path.join(__dirname, '/templates/partials');

// Hbs setup
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicPath));

app.get('/', (req, res) => {
  res.render('index', { title: 'Weather', selectedW: true });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About', selectedA: true });
});

app.get('/Help', (req, res) => {
  res.render('help', { title: 'Help', selectedH: true });
});

app.get('/api/weather/:type', (req, res) => {
  const reqIP = req.connection.remoteAddress.split(':')[3];
  if (req.params.type == 'mapbox' && req.query.place != '') {
    geoencode(
      'mapbox',
      req.query.place,
      (
        geoError,
        { weather_descriptions, temperature, feelslike, imgurl, location } = {},
      ) => {
        if (geoError) {
          console.log(chalk.red.inverse(geoError.message));
          return res.status(500).send({ message: geoError.message });
        }
        res.send({
          weather_descriptions,
          temperature,
          feelslike,
          location,
          imgurl,
        });
      },
    );
  } else if (req.params.type == 'ip') {
    geoencode(
      'ip',
      reqIP,
      (
        geoError,
        { weather_descriptions, temperature, feelslike, imgurl, location } = {},
      ) => {
        if (geoError) {
          console.log(chalk.red.inverse(geoError.message));
          return res.status(500).send({ message: geoError.message });
        }
        res.send({
          weather_descriptions,
          temperature,
          feelslike,
          location,
          imgurl,
        });
      },
    );
  } else {
    res.send('This is the Weather Page');
  }
});

app.get('*', (req, res) => {
  res.render('error', {
    eType: '404',
    eMessage:
      'Page Not Found. Please select a page from any of the links given bellow.',
  });
});

app.listen(3000, () => {
  console.log(chalk.green.inverse('Server is Up and Running on port 3000!'));
});
