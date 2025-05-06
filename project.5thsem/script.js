const baseIconUrl = "https://weather.visualcrossing.com/icons/"; // Replace with the actual base URL for icons

async function getWeather() {
    const apiKey = "HPT7RWCHX3FA5TQQTZAJW3Z8Q";
    const city = document.getElementById('city').value.trim() || "Delhi"; // Default to Delhi
    const weatherInfo = document.getElementById('weather-info');
    const weatherForecast = document.getElementById('weather-forecast');

    if (!city) {
        weatherInfo.innerHTML = '<p>Please enter a city name.</p>';
        return;
    }

    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(city)}?unitGroup=metric&key=${apiKey}&contentType=json`);
        if (!response.ok) throw new Error('City not found or API limit exceeded');

        const data = await response.json();
        console.log(data); // Log the data to understand its structure

        if (!data.currentConditions || !data.days) {
            throw new Error('Unexpected API response structure');
        }

        const currentConditions = data.currentConditions;
        const dailyForecast = data.days;

        // Display current weather
        weatherInfo.innerHTML = `
            <h2>Weather in ${city}</h2>
            <img src="1779940.png" alt="Weather icon" style="width: 50px; height: 50px;">
            <p><strong>Temperature:</strong> ${currentConditions.temp} °C</p>
            <p><strong>Feels Like:</strong> ${currentConditions.feelslike} °C</p>
            <p><strong>Weather:</strong> ${currentConditions.conditions}</p>
            <p><strong>Humidity:</strong> ${currentConditions.humidity}%</p>
            <p><strong>Pressure:</strong> ${currentConditions.pressure} hPa</p>
            <p><strong>Wind Speed:</strong> ${currentConditions.windspeed} m/s</p>
            <button class="back-button" onclick="resetPage()">Back</button>
        `;

        // Display weather forecast
        if (dailyForecast.length) {
            weatherForecast.innerHTML = '';
            dailyForecast.slice(1, 6).forEach(day => {
                const date = new Date(day.datetime);
                const formattedDate = date.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                });

                // Construct icon URL
                const iconUrl = `${baseIconUrl}${day.icon}.png`;

                weatherForecast.innerHTML += `
                    <div class="forecast-card">
                        <h3>${formattedDate}</h3>
                        <img src="WeatherIcon.jpg" alt="Weather icon" style="width: 50px; height: 50px;">
                        <p><strong>Max Temp:</strong> ${day.tempmax} °C</p>
                        <p><strong>Min Temp:</strong> ${day.tempmin} °C</p>
                        <p><strong>Weather:</strong> ${day.conditions}</p>
                        <p><strong>Precipitation:</strong> ${day.precip} mm</p>
                        <p><strong>Wind Speed:</strong> ${day.windspeed} m/s</p>
                    </div>
                `;
            });
        } else {
            weatherForecast.innerHTML = '<p>No forecast data available.</p>';
        }

    } catch (error) {
        weatherInfo.innerHTML = `<p>${error.message}</p>`;
        weatherForecast.innerHTML = '';
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = "HPT7RWCHX3FA5TQQTZAJW3Z8Q"; // Replace with your Visual Crossing API key

            try {
                const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&key=${apiKey}&contentType=json`);
                if (!response.ok) throw new Error('Location not found or API limit exceeded');

                const data = await response.json();
                console.log(data); // Log the data to understand its structure

                if (!data.currentConditions || !data.days) {
                    throw new Error('Unexpected API response structure');
                }

                const currentConditions = data.currentConditions;
                const dailyForecast = data.days;

                // Display current weather
                document.getElementById('weather-info').innerHTML = `
                    <h2>Weather at your location</h2>
                    <img src="Day.png" alt="Weather icon" style="width: 50px; height: 50px;">
                    <p><strong>Temperature:</strong> ${currentConditions.temp} °C</p>
                    <p><strong>Feels Like:</strong> ${currentConditions.feelslike} °C</p>
                    <p><strong>Weather:</strong> ${currentConditions.conditions}</p>
                    <p><strong>Humidity:</strong> ${currentConditions.humidity}%</p>
                    <p><strong>Pressure:</strong> ${currentConditions.pressure} hPa</p>
                    <p><strong>Wind Speed:</strong> ${currentConditions.windspeed} m/s</p>
                    <button class="back-button" onclick="resetPage()">Back</button>
                `;

                // Display weather forecast
                const weatherForecast = document.getElementById('weather-forecast');
                if (dailyForecast.length) {
                    weatherForecast.innerHTML = '';
                    dailyForecast.slice(1, 6).forEach(day => {
                        const date = new Date(day.datetime);
                        const formattedDate = date.toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        });

                        // Construct icon URL
                        const iconUrl = `${baseIconUrl}${day.icon}.png`;

                        weatherForecast.innerHTML += `
                            <div class="forecast-card">
                                <h3>${formattedDate}</h3>
                                <img src="1779940.png" alt="Weather icon" style="width: 50px; height: 50px;">
                                <p><strong>Max Temp:</strong> ${day.tempmax} °C</p>
                                <p><strong>Min Temp:</strong> ${day.tempmin} °C</p>
                                <p><strong>Weather:</strong> ${day.conditions}</p>
                                <p><strong>Precipitation:</strong> ${day.precip} mm</p>
                                <p><strong>Wind Speed:</strong> ${day.windspeed} m/s</p>
                            </div>
                        `;
                    });
                } else {
                    weatherForecast.innerHTML = '<p>No forecast data available.</p>';
                }

            } catch (error) {
                document.getElementById('weather-info').innerHTML = `<p>${error.message}</p>`;
                document.getElementById('weather-forecast').innerHTML = '';
            }
        }, () => {
            document.getElementById('weather-info').innerHTML = '<p>Unable to retrieve your location.</p>';
        });
    } else {
        document.getElementById('weather-info').innerHTML = '<p>Geolocation is not supported by this browser.</p>';
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetPage() {
    document.getElementById('weather-info').innerHTML = '';
    document.getElementById('weather-forecast').innerHTML = '';
    document.getElementById('city').value = '';
}

function convertTemperature() {
    const tempInput = parseFloat(document.getElementById('temp-input').value);
    const unit = document.getElementById('temp-unit').value;
    const convertedTemp = document.getElementById('converted-temp');

    if (isNaN(tempInput)) {
        convertedTemp.innerHTML = '<p>Please enter a valid temperature.</p>';
        return;
    }

    let result;
    if (unit === 'C') {
        result = (tempInput * 9 / 5) + 32;
        convertedTemp.innerHTML = `${tempInput} °C is ${result.toFixed(2)} °F`;
    } else {
        result = (tempInput - 32) * 5 / 9;
        convertedTemp.innerHTML = `${tempInput} °F is ${result.toFixed(2)} °C`;
    }
}

// Call getWeather for Delhi when the page loads
window.onload = function() {
    getWeather(); // Default to fetching weather for Delhi
}
