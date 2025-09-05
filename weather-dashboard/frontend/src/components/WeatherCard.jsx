const WeatherCard = ({ weather }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6 w-80 text-center">
      <h2 className="text-2xl font-semibold">{weather.name}</h2>
      <p className="text-lg mt-2">🌡 Temp: {weather.main.temp} °C</p>
      <p>💧 Humidity: {weather.main.humidity}%</p>
      <p>🌬 Wind: {weather.wind.speed} m/s</p>
      <p className="italic">{weather.weather[0].description}</p>
    </div>
  );
};

export default WeatherCard;
