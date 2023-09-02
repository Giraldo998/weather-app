import { Busquedas } from './search.js';

const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const placeContainer = document.querySelector('.choice-places');
const places = document.querySelector('.choice-places ul');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

const main = async () => {
	search.addEventListener('click', async () => {
		const busquedas = new Busquedas();
		const place = document.querySelector('.search-box input');
		const city = place.value;
		let infoLat = 0;
		let infoLng = 0;

		if (city === '') return;

		const cities = await busquedas.ciudad(city);

		if (cities.length === 0) {
			container.style.height = '400px';
			weatherBox.style.display = 'none';
			weatherDetails.style.display = 'none';
			error404.style.display = 'block';
			error404.classList.add('fadeIn');
			return;
		}
		error404.style.display = 'none';
		error404.classList.remove('fadeIn');
		console.log(cities);

		const listOfCities = await cities.map((c) => c.nombre);
		
		const cityListHTML = `${listOfCities
			.map((cityName) => `<li class="city-option">${cityName}</li><br>`)
			.join('')}`;
			places.innerHTML = cityListHTML;
			placeContainer.style.display = 'block';
			
		const cityOptions = document.querySelectorAll('.city-option');

		cityOptions.forEach((option) => {
			option.addEventListener('click', () => {
				const selectedCityName = option.textContent;
				const selectedCity = cities.find(
					(city) => city.nombre === selectedCityName
				);

				if (selectedCity) {
					infoLat = selectedCity.lat;
					infoLng = selectedCity.lng;

					const valueToShow = `${selectedCityName}`;
					place.value = valueToShow;
				} else {
					place.value = selectedCityName;
				}

				placeContainer.style.display = 'none';

				if (placeContainer.style.display !== 'block') {
					container.style.height = '660px';
				}

				busquedas.climaLugar(infoLat, infoLng).then((data) => {
					if (data.length === 0) {
						container.style.height = '400px';
						weatherBox.style.display = 'none';
						weatherDetails.style.display = 'none';
						error404.style.display = 'block';
						error404.classList.add('fadeIn');
						return;
					}

					console.log(data);
					error404.style.display = 'none';
					error404.classList.remove('fadeIn');

					const image = document.querySelector('.weather-box img');
					const temperature = document.querySelector('.weather-box .temperature');
					const description = document.querySelector('.weather-box .description');
					const humidity = document.querySelector('.weather-details .humidity span');
					const wind = document.querySelector('.weather-details .wind span');
					const	high = document.querySelector('.weather-details .high span');
					const low = document.querySelector('.weather-details .low span');

					switch (data.desc) {
						case 'Clear':
							image.src = '/assets/img/clear.png';
							break;
						case 'Rain':
							image.src = '/assets/img/rain.png';
							break;
						case 'Snow':
							image.src = '/assets/img/snow.png';
							break;
						case 'Clouds':
							image.src = '/assets/img/cloud.png';
							break;
						case 'Haze':
							image.src = '/assets/img/mist.png';
							break;
						default:
							image.src = '';
					}

					temperature.innerHTML = `${parseInt(data.temp)}<span>°C</span>`;
					description.innerHTML = `${data.status}`;
					humidity.innerHTML = `${data.humidity}%`;
					wind.innerHTML = `${parseInt(data.speed)}Km/h`;
					high.innerHTML = `${parseInt(data.max)}<span>°C</span>`;
					low.innerHTML = `${parseInt(data.min)}<span>°C</span>`;

					weatherBox.style.display = '';
					weatherDetails.style.display = '';
					weatherBox.classList.add('fadeIn');
					weatherDetails.classList.add('fadeIn');
				});
			});
			weatherBox.style.display = 'none';
			weatherDetails.style.display = 'none';
			if (placeContainer.style.display === 'block') {
				container.style.height = '400px';
			}
		});
	});
};
main();
