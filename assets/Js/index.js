import { Busquedas } from './search.js';

const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const placeContainer = document.querySelector('.choice-places');
const places = document.querySelector('.choice-places ul');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const place = document.querySelector('.search-box input');

place.addEventListener ('click', ()=>{
	place.value = '';
})

const main = async () => {
	search.addEventListener('click', async () => {
		const busquedas = new Busquedas();
		const place = document.querySelector('.search-box input');
		const city = place.value;
		let lat = 0;
		let lng = 0;
		
		if (city === '') return;
		
		const cities = await busquedas.ciudad(city);
		
		console.log(cities);
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

		const lugarSelec = cities.map( c => (c.name));
   	const cityListHTML = `${lugarSelec.map(cityName => 
			`<li class="city-option"><p>${cityName.split(',')[0]}<span>,</span></p><p class="subtitle">${(cityName.split(',')[1] === undefined) ? '' : `${cityName.split(',')[1]},${cityName.split(',')[2]}`}</li><br>`).join('')}`;
			
		places.innerHTML = cityListHTML;
		placeContainer.style.display = 'block';
		
		if (placeContainer.style.display === 'block') {
			container.style.height = '400px';
		}

		const cityOptions = document.querySelectorAll('.city-option');
		
		cityOptions.forEach((option) => {
			option.addEventListener('click', () => {
				const selectedCityName = option.textContent;
				const selectedCity = cities.find((city) => city.name === selectedCityName);
				
				if (selectedCity) {
					lat = selectedCity.lat;
					lng = selectedCity.lng;

					// const valueToShow = `${selectedCityName}`;
					
					place.value = selectedCityName;
				} else {
					place.value = selectedCityName;
				}
				
				placeContainer.style.display = 'none';
				
				if (placeContainer.style.display !== 'block') {
					container.style.height = '660px';
				}

				busquedas.climaLugar(lat, lng).then((data) => {

					if (data.length === 0) {
						container.style.height = '400px';
						weatherBox.style.display = 'none';
						weatherDetails.style.display = 'none';
						error404.style.display = 'block';
						error404.classList.add('fadeIn');
						return;
					}
					console.log(selectedCity);
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
							(data.time>=18 || data.time<=6 )
								? image.src = '/assets/img/weather-status/night-clear.png'
								: image.src = '/assets/img/weather-status/clear.png';
							break;
						case 'Rain':
							image.src = '/assets/img/weather-status/rain.png';
							break;
						case 'Drizzle':
							image.src = '/assets/img/weather-status/raindrop.png';
							break;
						case 'Snow':
							image.src = '/assets/img/weather-status/snow.png';
							break;
						case 'Clouds':
							image.src = '/assets/img/weather-status/clouds.png';
							break;
						case 'Haze':
								image.src = '/assets/img/weather-status/mist.png';
								break;
						case 'Fog':
							(data.time>= 18 || data.time<= 6)
								? image.src = '/assets/img/weather-status/night-cloudy.png'
								: image.src = '/assets/img/weather-status/cloudy.png';
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
			
		});
	});
};
main();
