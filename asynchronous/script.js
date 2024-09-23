'use strict';

const countriesContainer = document.querySelector('.countries');

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

const getLocation = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

function whereAmI(lat = 0, lng = 0) {
  getLocation()
    .then((pos) => {
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
      console.log(`lat long is ${lat}, ${lng}`);
      const token = '---';
      return fetch(
        `https://us1.locationiq.com/v1/reverse?key=${token}&lat=${lat}&lon=${lng}&format=json&`
      );
    })
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

//const btn = document.querySelector('.btn-country');
//btn.addEventListener('click', function () {
//fetchCountryData('Australia');
//whereAmI(19.037, 72.873);
//whereAmI(52.508, 13.381);
//whereAmI();
//whereAmI(-33.933, 18.474);
//});

//fetchCountryData('Sri Lanka');
const container = document.querySelector('.images');
const createImage = function (path) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = path;
    img.addEventListener('load', function () {
      container.append(img);
      resolve(img);
    });
    img.addEventListener('error', function () {
      reject(new Error('image not found'));
    });
  });
};

const wait = function (duration) {
  return new Promise(function (resolve) {
    setTimeout(resolve, duration * 1000);
  });
};

// let currentImg;
// createImage('imgs/img-1.jpg')
//   .then((img) => {
//     currentImg = img;
//     return wait(2);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//     return createImage('imgs/img-2.jpg');
//   })
//   .then((img) => {
//     currentImg = img;
//     return wait(2);
//   })
//   .then(() => (currentImg.style.display = 'none'))
//   .catch((err) => console.error(err));
const whereAmIAsync = async function () {
  try {
    const pos = await getLocation();
    const { latitude: lat, longitude: lng } = pos.coords;
    const token = '____';
    let resp = await fetch(
      `https://us1.locationiq.com/v1/reverse?key=${token}&lat=${lat}&lon=${lng}&format=json&`
    );
    if (!resp.ok) throw new Error('Problem getting location data');
    const datag = await resp.json();
    resp = await fetch(
      `https://restcountries.com/v3.1/name/${datag.address.country}`
    );
    const data = await resp.json();
    if (!resp.ok) throw new Error('Problem getting country');
    renderCountryData(data[0]);
    return `You're in ${datag.address.city}, ${datag.address.country}`;
  } catch (err) {
    console.error(err);
    renderError(`💥 ${err.message}`);
  }
};

const btn = document.querySelector('.btn-country');
//btn.addEventListener('click', whereAmIAsync);
(async function () {
  const location = await whereAmIAsync();
  console.log(location);
})();

async function get3countries(c1, c2, c3) {
  try {
    const data = await Promise.all([
      getJSON(`https://restcountries.com/v3.1/name/${c1}`),
      getJSON(`https://restcountries.com/v3.1/name/${c2}`),
      getJSON(`https://restcountries.com/v3.1/name/${c3}`),
    ]);
    console.log(data.map((d) => d[0].capital));
  } catch (err) {
    console.error(err);
  }
}

get3countries('India', 'Poland', 'Australia');

const timeout = function (duration) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error('Request took long...'));
    }, duration * 1000);
  });
};

Promise.race([
  getJSON(`https://restcountries.com/v3.1/name/Egypt`),
  timeout(0.4),
])
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
]).then((res) => console.log(`all settled: ${res.map((r) => r.value)}`));

Promise.all([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
])
  .then((res) => console.log(res))
  .catch((err) => console.error(err));

// Promise.any [ES2021]
Promise.any([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
])
  .then((res) => console.log(`any: ${res}`))
  .catch((err) => console.error(err));
