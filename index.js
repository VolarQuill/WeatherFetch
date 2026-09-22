window.addEventListener('DOMContentLoaded', async () => {
    try {
        const coords = await askForLocation();
        document.getElementById('status').innerText = 'Fetching weather data...';
        const weatherData = await fetchWeather(coords.lat, coords.lon);
        displayWeather(weatherData);
    } catch (error) {
        document.getElementById('status').innerText = error;
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

async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch weather data')}
    return await response.json();
} 

function displayWeather(data) {
    document.getElementById('status').style.display = 'none';
    document.getElementById('content').style.display = 'block'; 
}
