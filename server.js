const express = require('express');
const axios = require('axios');
const path = require('path');
const config = require('./config');

const app = express();

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Weather App - OpenWeather',
    apiKey: config.OPENWEATHER_API_KEY 
  });
});

// Weather API endpoint
app.get('/api/weather', async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    
    if (!city && (!lat || !lon)) {
      return res.status(400).json({ error: 'City name or coordinates are required' });
    }

    let url = 'https://api.openweathermap.org/data/2.5/weather?';
    
    if (city) {
      url += `q=${encodeURIComponent(city)}`;
    } else {
      url += `lat=${lat}&lon=${lon}`;
    }
    
    url += `&appid=${config.OPENWEATHER_API_KEY}&units=metric`;

    const response = await axios.get(url);
    
    if (response.data.cod === '404') {
      return res.status(404).json({ error: 'City not found' });
    }

    const weatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: Math.round(response.data.main.temp),
      feels_like: Math.round(response.data.main.feels_like),
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      wind_speed: response.data.wind.speed,
      wind_direction: response.data.wind.deg,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      sunrise: new Date(response.data.sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(response.data.sys.sunset * 1000).toLocaleTimeString()
    };

    res.json(weatherData);
  } catch (error) {
    console.error('Weather API Error:', error.message);
    console.error('Full error:', error);
    
    // Check if it's an OpenWeather API error
    if (error.response) {
      console.error('OpenWeather API Response:', error.response.data);
      console.error('Status:', error.response.status);
      
      if (error.response.status === 401) {
        return res.status(500).json({ error: 'Invalid API key. Please check your OpenWeather API key.' });
      } else if (error.response.status === 429) {
        return res.status(500).json({ error: 'API rate limit exceeded. Please try again later.' });
      }
    }
    
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Forecast API endpoint
app.get('/api/forecast', async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    
    if (!city && (!lat || !lon)) {
      return res.status(400).json({ error: 'City name or coordinates are required' });
    }

    let url = 'https://api.openweathermap.org/data/2.5/forecast?';
    
    if (city) {
      url += `q=${encodeURIComponent(city)}`;
    } else {
      url += `lat=${lat}&lon=${lon}`;
    }
    
    url += `&appid=${config.OPENWEATHER_API_KEY}&units=metric`;

    const response = await axios.get(url);
    
    if (response.data.cod === '404') {
      return res.status(404).json({ error: 'City not found' });
    }

    // Group forecast by day and get daily forecast
    const dailyForecast = response.data.list.reduce((acc, item) => {
      const date = new Date(item.dt * 1000).toDateString();
      
      if (!acc[date]) {
        acc[date] = {
          date: date,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          humidity: item.main.humidity,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          wind_speed: item.wind.speed
        };
      } else {
        acc[date].temp_min = Math.min(acc[date].temp_min, item.main.temp_min);
        acc[date].temp_max = Math.max(acc[date].temp_max, item.main.temp_max);
      }
      
      return acc;
    }, {});

    const forecastData = Object.values(dailyForecast).slice(0, 5); // 5 days

    res.json(forecastData);
  } catch (error) {
    console.error('Forecast API Error:', error.message);
    console.error('Full error:', error);
    
    // Check if it's an OpenWeather API error
    if (error.response) {
      console.error('OpenWeather API Response:', error.response.data);
      console.error('Status:', error.response.status);
      
      if (error.response.status === 401) {
        return res.status(500).json({ error: 'Invalid API key. Please check your OpenWeather API key.' });
      } else if (error.response.status === 429) {
        return res.status(500).json({ error: 'API rate limit exceeded. Please try again later.' });
      }
    }
    
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

// Start server
app.listen(config.PORT, () => {
  console.log(`Server running on http://localhost:${config.PORT}`);
});
