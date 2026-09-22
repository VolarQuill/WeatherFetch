window.addEventListener('DOMContentLoaded', async () => {
    try {
        const coords = await askForLocation();
        document.getElementById('status').innerText = 'Fetching weather data...';
        const weatherData = await fetchWeather(coords.lat, coords.lon);
        displayWeather(weatherData);
    } catch (error) {
        document.getElementById('status').innerText = errorMessage;
    }
});

function askForLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject('Geolocation is not supported by your browser');
        }

        navigator.geolocation.getCurrentPosition(
            (position) => resolve({ lat: position.coords.latitude, lon: position.coords.longitude }),
            (error) => reject('Unable to retrieve your location')
        );
    });
}


