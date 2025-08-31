 class WeatherApp {
    constructor() {
        this.currentWeather = null;
        this.forecast = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.showWelcome();
    }

    bindEvents() {
        // Search button click
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.searchWeather();
        });

        // Enter key in input
        document.getElementById('cityInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });

        // Location button click
        document.getElementById('locationBtn').addEventListener('click', () => {
            this.getCurrentLocation();
        });

        // Retry button click
        document.getElementById('retryBtn').addEventListener('click', () => {
            this.hideError();
            this.showWelcome();
        });
    }

    async searchWeather() {
        const cityInput = document.getElementById('cityInput');
        const city = cityInput.value.trim();

        if (!city) {
            this.showError('Please enter a city name');
            return;
        }

        this.showLoading();
        try {
            await this.fetchWeatherData(city);
            cityInput.value = '';
        } catch (error) {
            this.showError(error.message);
        }
    }

    async getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by your browser');
            return;
        }

        this.showLoading();
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    await this.fetchWeatherData(null, latitude, longitude);
                } catch (error) {
                    this.showError(error.message);
                }
            },
            (error) => {
                let errorMessage = 'Unable to get your location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied. Please allow location access.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                }
                this.showError(errorMessage);
            }
        );
    }

    async fetchWeatherData(city = null, lat = null, lon = null) {
        try {
            // Fetch current weather
            const weatherParams = city ? `city=${city}` : `lat=${lat}&lon=${lon}`;
            const weatherResponse = await fetch(`/api/weather?${weatherParams}`);
            
            if (!weatherResponse.ok) {
                const errorData = await weatherResponse.json();
                throw new Error(errorData.error || 'Failed to fetch weather data');
            }

            this.currentWeather = await weatherResponse.json();

            // Fetch forecast
            const forecastParams = city ? `city=${city}` : `lat=${lat}&lon=${lon}`;
            const forecastResponse = await fetch(`/api/forecast?${forecastParams}`);
            
            if (!forecastResponse.ok) {
                const errorData = await forecastResponse.json();
                throw new Error(errorData.error || 'Failed to fetch forecast data');
            }

            this.forecast = await forecastResponse.json();

            this.displayWeather();
            this.displayForecast();
            this.hideLoading();
            this.hideWelcome();
            this.hideError();

        } catch (error) {
            this.hideLoading();
            throw error;
        }
    }

    displayWeather() {
        if (!this.currentWeather) return;

        const weather = this.currentWeather;

        // Update current weather display
        document.getElementById('cityName').textContent = weather.city;
        document.getElementById('countryName').textContent = weather.country;
        document.getElementById('temperature').textContent = weather.temperature;
        document.getElementById('feelsLike').textContent = `${weather.feels_like}°C`;
        document.getElementById('humidity').textContent = `${weather.humidity}%`;
        document.getElementById('windSpeed').textContent = `${weather.wind_speed} m/s`;
        document.getElementById('pressure').textContent = `${weather.pressure} hPa`;
        document.getElementById('description').textContent = weather.description;
        document.getElementById('sunrise').textContent = weather.sunrise;
        document.getElementById('sunset').textContent = weather.sunset;

        // Update weather icon
        const weatherIcon = document.getElementById('weatherIcon');
        weatherIcon.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
        weatherIcon.alt = weather.description;

        // Show current weather section
        document.getElementById('currentWeather').classList.remove('hidden');
    }

    displayForecast() {
        if (!this.forecast || !this.forecast.length) return;

        const forecastContainer = document.getElementById('forecastContainer');
        forecastContainer.innerHTML = '';

        this.forecast.forEach(day => {
            const forecastCard = document.createElement('div');
            forecastCard.className = 'forecast-card';

            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            forecastCard.innerHTML = `
                <div class="forecast-date">${dayName}<br>${monthDay}</div>
                <div class="forecast-icon">
                    <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.description}">
                </div>
                <div class="forecast-temp">
                    <span class="min">${Math.round(day.temp_min)}°</span>
                    <span class="max">${Math.round(day.temp_max)}°</span>
                </div>
                <div class="forecast-description">${day.description}</div>
            `;

            forecastContainer.appendChild(forecastCard);
        });

        // Show forecast section
        document.getElementById('forecast').classList.remove('hidden');
    }

    showLoading() {
        this.hideAllSections();
        document.getElementById('loading').classList.remove('hidden');
    }

    showError(message) {
        this.hideAllSections();
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('error').classList.remove('hidden');
    }

    showWelcome() {
        this.hideAllSections();
        document.getElementById('welcome').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }

    hideError() {
        document.getElementById('error').classList.add('hidden');
    }

    hideWelcome() {
        document.getElementById('welcome').classList.add('hidden');
    }

    hideAllSections() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('error').classList.add('hidden');
        document.getElementById('welcome').classList.add('hidden');
        document.getElementById('currentWeather').classList.add('hidden');
        document.getElementById('forecast').classList.add('hidden');
    }

    // Utility method to format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});
