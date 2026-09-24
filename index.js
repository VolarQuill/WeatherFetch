window.addEventListener('DOMContentLoaded', async () => {
    startClock();
    try {
        const coords = await askForLocation();
        document.getElementById('status').innerText = 'Fetching weather data...';

        const weatherData = await fetchWeather(coords.lat, coords.lon);
        const locationName = await fetchLocationName(coords.lat, coords.lon);
        const aqiData = await fetchAirQuality(coords.lat, coords.lon);
        displayWeather(weatherData, locationName, aqiData);
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
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code&daily=uv_index_max&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch weather data')}
    return await response.json();
} 

const weatherConditions = {
    0: "Sunny",
    1: "Clear Sky", 
    2: "Partly Cloudy",
    3: "Cloudy",
    45: "foggy",
    51: "light drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Slight Snowfall",
    73: "Moderate Snowfall",
    75: "Heavy Snowfall",
    95: "ThunderStorm",
    99: "Hailstorm"
}; 

function displayWeather(data, locationName, aqiData) {
    document.getElementById('status').style.display = 'none';
    document.getElementById('content').style.display = 'block'; 
    
    document.getElementById('locationName').innerText = locationName;

    if (aqiData && aqiData.current) {
        const aqiValue = aqiData.current.us_aqi;
        document.getElementById('aqi').innerText = aqiValue;
        const level = aqiLevels.find(item => aqiValue <= item.max);
        const statusSpan = document.getElementById('aqiStatus');
        statusSpan.innerText = level.label; 
        statusSpan.style.color = level.color;
    } else {
        document.getElementById('aqiStatus').innerText = "Unavailable";
    }
 
    const code = data.current.weather_code;
    document.getElementById('condition').innerText = weatherConditions[code];
    document.getElementById('temp').innerText= data.current.temperature_2m;
    document.getElementById('humidity').innerText = data.current.relative_humidity_2m;
    document.getElementById('windspeed').innerText = data.current.wind_speed_10m;
    document.getElementById('feeltemp').innerText = data.current.apparent_temperature;
    document.getElementById('precip').innerText = data.current.precipitation;
    document.getElementById('uv').innerText = data.daily.uv_index_max[0];
} 

async function fetchLocationName(lat, lon) {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const response = await fetch(url);    
        if (!response.ok) { 
            return "Unkown Location"; 
        } 

    const data = await response.json();

    const city = data.city || data.locality || "Unknown City"; 
    const country = data.countryName || "";

    return country ? `${city}, ${country}` : city;
    } 

function startClock() {
    setInterval(() => {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('time').innerText = timeString;
    }, 1000);
}

const aqiLevels = [
    { max: 50, label: "Good", color: "#2ecc71"},
    { max: 100, label: "Moderate", color: "#f1c40f"},
    {max: 150, label: "Compromised", color: "#e67e22"},
    {max: 200, label: "Unhealthy", color: "#e74c3c"},
    {max: 300, label: "Very Unhealthy", color: "#9b59b6"},
    {max: Infinity, label: "Hazardous", color: "#7f8c8d"}
];

async function fetchAirQuality(lat, lon) {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) {
        return null; 
    }
    return await response.json();
}