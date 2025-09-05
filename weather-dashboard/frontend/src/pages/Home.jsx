import { useState } from "react";
import API from "../api/axios";
import WeatherCard from "../components/WeatherCard";

const Home = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const getWeather = async () => {
    try {
      const res = await API.get(`/weather/${city}`);
      setWeather(res.data);
    } catch (err) {
      alert("City not found");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-3xl font-bold mb-6">Check Weather 🌍</h1>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter city"
          className="border rounded px-3 py-2"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          onClick={getWeather}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {weather && <WeatherCard weather={weather} />}
    </div>
  );
};

export default Home;
