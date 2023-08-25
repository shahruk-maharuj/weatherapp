// api = 49e3d67f9c35b526d21b434defb70f52

const API_KEY = '49e3d67f9c35b526d21b434defb70f52'; // Replace with your API key


$( function() {
    var availableCities = [
      "New York",
      "Los Angeles",
      "Chicago",
      // Add more cities here
    ];
    $( "#city-input" ).autocomplete({
      source: availableCities
    });
} );

$('#submit-btn').click(function() {
    const cityName = $('#city-input').val();
    fetchWeatherDataByCity(cityName);
    localStorage.setItem('city', cityName);
});

$(document).ready(function() {
    const cityName = localStorage.getItem('city');
    if (cityName) {
        fetchWeatherDataByCity(cityName);
    } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherDataByLocation(lat, lon);
        });
    }
});

function fetchWeatherDataByCity(cityName) {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '404') {
                showError('City not found');
            } else {
                displayWeatherData(data);
                fetchForecastData(cityName);
            }
        })
        .catch(() => showError('An error occurred'));
}

function fetchWeatherDataByLocation(lat, lon) {
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '404') {
                showError('Location not found');
            } else {
                displayWeatherData(data);
                fetchForecastData(data.name);
            }
        })
        .catch(() => showError('An error occurred'));
}

function displayWeatherData(data) {
    const weatherContainer = $('#weather-container');
    const tempC = (data.main.temp - 273.15).toFixed(2);
    const tempF = ((data.main.temp - 273.15) * 9/5 + 32).toFixed(2);
    weatherContainer.html(`
        <h2 class="text-4xl">${data.name}, ${data.sys.country}</h2>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather icon">
        <p class="text-2xl">${data.weather[0].main}</p>
        <p>${data.weather[0].description}</p>
        <p>Temperature: ${tempC} °C / ${tempF} °F</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind speed: ${data.wind.speed} m/s</p>
    `);
}

function fetchForecastData(cityName) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => displayForecastData(data))
        .catch(() => showError('An error occurred'));
}

function displayForecastData(data) {
    const forecastContainer = $('#forecast-container');
    forecastContainer.html('');
    for (let i = 0; i < data.list.length; i += 8) {
        const tempC = (data.list[i].main.temp - 273.15).toFixed(2);
        const tempF = ((data.list[i].main.temp - 273.15) * 9/5 + 32).toFixed(2);
        forecastContainer.append(`
            <div class="mt-10">
                <h2 class="text-2xl">${data.list[i].dt_txt.split(' ')[0]}</h2>
                <img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png" alt="Weather icon">
                <p>${data.list[i].weather[0].main}</p>
                <p>${data.list[i].weather[0].description}</p>
                <p>Temperature: ${tempC} °C / ${tempF} °F</p>
                <p>Humidity: ${data.list[i].main.humidity}%</p>
                <p>Wind speed: ${data.list[i].wind.speed} m/s</p>
            </div>
        `);
    }
}

function showError(message) {
    const errorMessage = $('#error-message');
    errorMessage.text(message);
}



