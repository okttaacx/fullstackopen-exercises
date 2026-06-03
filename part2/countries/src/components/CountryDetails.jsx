import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    if (country.capital && apiKey) {
      const capital = country.capital[0]
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`)
        .then(response => {
          setWeather(response.data)
        })
        .catch(error => {
          console.log('Error fetching weather data', error)
        })
    }
  }, [country, apiKey])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital {country.capital ? country.capital[0] : 'N/A'}</div>
      <div>area {country.area}</div>

      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages || {}).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <div style={{ marginTop: '10px', marginBottom: '20px' }}>
        <img 
          src={country.flags.png} 
          alt={`Flag of ${country.name.common}`} 
          width="150"
          style={{ border: '1px solid #ccc' }} 
        />
      </div>

      {weather && (
        <div>
          <h3>Weather in {country.capital[0]}</h3>
          <div>temperature {weather.main.temp} Celsius</div>
          {weather.weather && weather.weather[0] && (
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
              alt={weather.weather[0].description} 
            />
          )}
          <div>wind {weather.wind.speed} m/s</div>
        </div>
      )}
    </div>
  )
}

export default CountryDetails