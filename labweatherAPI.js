async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=eab19e11b8034550b2303551240202&q=${city}&days=7&aqi=no&alerts=no`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Extract relevant weather information from the API response
        const location = data.location.name + ', ' + data.location.region + ', ' + data.location.country;
        const temperature = data.current.temp_c + '°C';
        const condition = data.current.condition.text;

        // Display current weather information on the webpage
        const weatherContainer = document.getElementById('weather-container');
        weatherContainer.innerHTML = `
            <h2>Current Weather</h2>
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Temperature:</strong> ${temperature}</p>
            <p><strong>Condition:</strong> ${condition}</p>
        `;

        // Display 7-day forecast
        const forecastContainer = document.getElementById('container');
        forecastContainer.innerHTML = '<h2>7-Day Forecast</h2>';
        const forecastDays = data.forecast.forecastday;
        forecastDays.forEach(day => {
            const date = day.date;
            const temperature = day.day.avgtemp_c + '°C';
            const condition = day.day.condition.text;
            const dayForecast = `
                <p><u><strong>Date:</strong> ${date}</u></p>
                <p><strong>Temperature:</strong> ${temperature}</p>
                <p><strong>Condition:</strong> ${condition}</p>
            `;
            forecastContainer.innerHTML += dayForecast;
        });
    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Display error message on the webpage
        const weatherContainer = document.getElementById('weather-container');
        weatherContainer.innerHTML = '<p>Failed to fetch weather data. Please try again later.</p>';
    }
}

// Call the fetchWeather function when the page loads
document.addEventListener('DOMContentLoaded', function () {
    // Fetch weather for the default selected city
    const defaultCity = document.getElementById('city').value;
    fetchWeather(defaultCity);

    // Listen for changes in the city selection
    const citySelect = document.getElementById('city');
    citySelect.addEventListener('change', function () {
        const selectedCity = citySelect.value;
        fetchWeather(selectedCity);
    });
});
