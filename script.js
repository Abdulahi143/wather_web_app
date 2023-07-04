const cityInput = document.querySelector('.city-input');
const searchButton = document.querySelector('.search-btn');
const locationButton = document.querySelector('.location-btn');
const currentWeatherDiv = document.querySelector('.current-weather');
const weatherCardsDiv = document.querySelector('.weather-cards');

const API_KEY = 'f66873c3467442f180eda451dbc27c34';

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) {
        return  `          <div class="details">
        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt=""/>
        <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed()}°C</h6>
        <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
        <h6>Humidity: ${weatherItem.main.humidity}%</h6>
      </div>`;
    } else {
        return  `            <li class="card">
        <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt=""/>
        <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed()}°C</h6>
        <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
        <h6>Humidity: ${weatherItem.main.humidity}%</h6>
      </li>`;
    }

}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {        
        //Kala shaandhaynaya macluumadka hawada kuna siinaya xogta aan ubahanahay maalin waliba!
        const uniqueForecastDays = [];
       const fiveDayForecast = data.list.filter(forecast =>{
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        })

        //tirtaraya xogta magaaladii hore!
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = ""; 

       // samaynaya kaararka ay macluumadka ku qoran yihiin kuna daray DOM
        fiveDayForecast.forEach((weatherItem, index) => {
            if(index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend",  createWeatherCard(cityName, weatherItem, index));  
            }else {
                weatherCardsDiv.insertAdjacentHTML("beforeend",  createWeatherCard(cityName, weatherItem, index));  
            }                    
        });
    }).catch(() => {
        alert("Cilad ayaa dhacday dhanka so gudbinta macluumaadka hawada!")
    });
}
async function handleSearch() {
    const cityName = cityInput.value.trim();
    if (!cityName) return;
    const geoCoding_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    // helaya magaalada warbixinta sida lattitude, longtitude iyo magaca
    fetch(geoCoding_API_URL)    
        .then((response) => response.json())
        .then((data) => {
            if(!data.length) return alert("Goobta aad ku qortay waa meel aan la heli karin!");
            const {name, lat, lon} = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch((error) => {
            alert("Cilad ayaa ku timid dhanka raadiska goobta!");
        });
}

cityInput.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        handleSearch();
    }
});

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

            //Helaya magaalada aad joogta ayada loo isticmalaya reverse geocoding api
            fetch(REVERSE_GEOCODING_URL)
                .then((response) => response.json())
                .then((data) => {
                    const { name } = data[0];
                    getWeatherDetails(name, latitude, longitude);
                })
                .catch((error) => {
                    alert(
                        "Cilad ayaa ku timid dhanka raadiska goobta aad immika ku sugan tahay!"
                    );
                });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert(
                    "Helida halka aad joogto waa diiday o ma aadan oran (Allow!)"
                );
                
            }
        }
    );
};

const handleLocationSearch = () => {
    getUserCoordinates();
};

locationButton.addEventListener("click", handleLocationSearch, { once: true });
// locationButton.addEventListener('click', handleSearch);
// locationButton.addEventListener('click', getUserCoordinates);
searchButton.addEventListener('click', handleSearch);

