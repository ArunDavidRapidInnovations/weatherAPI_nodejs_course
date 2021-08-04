document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('location').value = '';
  fetch('https://ipinfo.io/ip')
    .then((res) => {
      res.text().then((ipData) => {
        fetch(`/api/weather/ip?ip=${ipData}`).then((response) => {
          response.json().then((data) => {
            console.log(data);
            setWetherData(data);
            setTimeout(() => {
              let loadingContainer =
                document.getElementById('loadingAnimation');
              let mainWeatherContainer = document.getElementById(
                'mainWeatherContainer',
              );
              loadingContainer.classList.add('noDisplay');
              mainWeatherContainer.classList.remove('noDisplay');
            }, 0);
          });
        });
      });
    })
    .catch((err) => {
      document.getElementById('location').value = 'Hyderabad';
      searchBasedOnPlace();
    });
});

const searchBasedOnPlace = () => {
  const query = document.getElementById('location').value;
  let loadingContainer = document.getElementById('loadingAnimation');
  let mainWeatherContainer = document.getElementById('mainWeatherContainer');
  mainWeatherContainer.classList.add('noDisplay');
  loadingContainer.classList.remove('noDisplay');
  console.log(query);
  if (query !== '') {
    console.log(query);
    fetch(`/api/weather/mapbox?place=${query}`).then((response) => {
      response.json().then((data) => {
        console.log(data);
        setWetherData(data);
        setTimeout(() => {
          let loadingContainer = document.getElementById('loadingAnimation');
          let mainWeatherContainer = document.getElementById(
            'mainWeatherContainer',
          );
          loadingContainer.classList.add('noDisplay');
          mainWeatherContainer.classList.remove('noDisplay');
        }, 500);
      });
    });
  } else {
    alert('Empty Input Field');
  }
};

const setWetherData = ({
  weather_descriptions,
  temperature,
  feelslike,
  location,
  imgurl,
}) => {
  const wetherDataContainer = document.getElementById('wetherDataContainer');
  wetherDataContainer.innerHTML = `
  <img src="${imgurl}" alt="wetherIcon" class="weatherIcon">
  <div class="weatherString">
      It's <b>${weather_descriptions}</b> in <b>${location}</b>, <br> It's <b>${temperature}</b> degrees outside but it feels like <b>${feelslike}</b> degrees.  
  </div>`;
};
