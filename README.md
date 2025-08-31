# Weather App - OpenWeather API

A beautiful retro-style weather application built with Node.js, Express, and EJS templating.

## 🎨 Features

- **Retro Vintage Design**: Inspired by classic poster aesthetics with high contrast colors
- **Real-time Weather**: Current weather conditions and 5-day forecast
- **Location Services**: Use current GPS location or search by city name
- **Responsive Design**: Works perfectly on all devices
- **Modern Tech Stack**: Node.js, Express, EJS, and OpenWeather API

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenWeather API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd OpenWeatherAPI
```

2. Install dependencies:
```bash
npm install
```

3. **Get Your OpenWeather API Key**:
   - Go to [OpenWeatherMap](https://openweathermap.org/)
   - Sign up for a free account
   - Navigate to "My API Keys" section
   - Copy your API key

4. Update the API key in `config.js`:
```javascript
module.exports = {
  OPENWEATHER_API_KEY: 'YOUR_ACTUAL_API_KEY_HERE',
  PORT: process.env.PORT || 3000
};
```

5. Start the server:
```bash
npm start
```

6. Open your browser and navigate to `http://localhost:3000`

## 🔧 API Key Issues

If you're getting "Failed to fetch weather data" errors:

1. **Check API Key**: Ensure your API key is correct and active
2. **Wait for Activation**: New API keys may take a few hours to activate
3. **Rate Limits**: Free tier has 1000 calls/day limit
4. **API Status**: Check [OpenWeather Status](https://status.openweathermap.org/)

## 🎨 Design Features

- **Color Palette**: Red to black gradient background
- **Typography**: Impact font for that classic poster look
- **Animations**: Smooth hover effects and transitions
- **High Contrast**: Accessible design with bold colors
- **Vintage Aesthetic**: Inspired by classic Art Deco posters

## 📱 Responsive Design

- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface
- Adaptive layouts

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: EJS, HTML5, CSS3, JavaScript
- **API**: OpenWeather API
- **Styling**: Custom CSS with retro design
- **Icons**: Font Awesome

## 📄 License

MIT License - feel free to use and modify!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your API key is working
3. Check OpenWeather API status
4. Open an issue in the repository

---

**Note**: Make sure to replace `YOUR_ACTUAL_API_KEY_HERE` with your real OpenWeather API key before running the application!
