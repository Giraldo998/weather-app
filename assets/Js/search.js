class Busquedas {
	get paramsMapbox() {
		return {
			access_token:
				'pk.eyJ1IjoiLXNlYmFzLSIsImEiOiJjbGs1NjZidHUxMWpyM3Rxb3hwdHI3M2tiIn0.lCq7M7-BrtEdmHhojQoQ7w',
			limit: 5,
			language: 'es',
			types: 'country,place',
		};
	}

	async ciudad(lugar = '') {
		try {
			const instance = axios.create({
				baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
				params: this.paramsMapbox,
			});
			const resp = await instance.get();

			return resp.data.features.map((lugar) => ({
					id: lugar.id,
					name: lugar.place_name,
					lng: lugar.center[0],
					lat: lugar.center[1],
			}));
		} catch (error) {
			return [];
		}
	}
	get paramsOpenWeather() {
		return {
			appid: 'b1245b8df01ce0058c05f34e5a5c7d59',
			units: 'metric',
			lang: 'es',
		};
	}
	async climaLugar(lat, lon) {
		try {
			const instance = axios.create({
				baseURL: `https://api.openweathermap.org/data/2.5/weather`,
				params: { ...this.paramsOpenWeather, lat, lon },
			});
			const resp = await instance.get();
			const { weather, main, wind, dt, timezone } = resp.data;
			const localTime = new Date((dt - timezone) * 1000).toLocaleTimeString();

			return {
				status: weather[0].description, 
				desc: weather[0].main, 
				min: main.temp_min, 
				max: main.temp_max, 
				temp: main.temp, 
				humidity: main.humidity,
				speed: wind.speed,
				time: localTime,
				dt,
				timezone
			};
		} catch (error) {
			return [];
		}
	}
}

export { Busquedas };
