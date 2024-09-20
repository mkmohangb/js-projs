'use strict';

const countriesContainer = document.querySelector('.countries');
const btn = document.querySelector('.btn-country');

const renderCountryData = function (data, className = '') {
  console.log(data);
  const languages = Object.values(data.languages);
  const lang = languages.length > 1 ? languages[1] : languages[0];
  const html = `
    <article class="country ${className}">
          <img class="country__img" src="${data.flags.png}" />
          <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${
              (data.population / 1000000).toFixed(1) + ' million people'
            }</p>
            <p class="country__row"><span>🗣️</span>${lang}</p>
            <p class="country__row"><span>💰</span>${
              data.currencies[Object.keys(data.currencies)[0]].name
            }</p>
          </div>
        </article>
    `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const getJSON = function (url, errorMsg = 'something went wrong') {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};

function getCountryData(name) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${name}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(request.responseText);
    console.log(data);
    renderCountryData(data);
  });
}

function fetchCountryData(name) {
  getJSON(`https://restcountries.com/v3.1/name/${name}`, 'Country not found')
    .then((data) => {
      renderCountryData(data[0]);
      const neighbor = data[0].borders?.[0];
      if (!neighbor) throw new Error('No neighbour found');
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbor}`,
        'Country not found'
      );
    })
    .then((data) => renderCountryData(data[0], 'neighbour'))
    .catch((err) => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong 💥💥 ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
}

function whereAmI(lat, lng) {
  const token = 'pk.b970f2e04a656523356806d7805c1478';
  fetch(
    `https://us1.locationiq.com/v1/reverse?key=${token}&lat=${lat}&lon=${lng}&format=json&`
  )
    .then((response) => {
      if (!response.ok) throw new Error('too many requests');
      return response.json();
    })
    .then((data) => {
      console.log(`you're in ${data.address.city}, ${data.address.country}`);
      fetchCountryData(data.address.country);
    })
    .catch((err) => {
      console.error(`${err} 💥💥💥`);
    });
}

btn.addEventListener('click', function () {
  //fetchCountryData('Australia');
  //whereAmI(19.037, 72.873);
  whereAmI(52.508, 13.381);
  //whereAmI(-33.933, 18.474);
});

//fetchCountryData('Sri Lanka');
