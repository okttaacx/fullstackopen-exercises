import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryList from './components/CountryList'
import CountryDetails from './components/CountryDetails'

const App = () => {
  const [search, setSearch] = useState('')
  const [allCountries, setAllCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setAllCountries(response.data)
      })
      .catch(error => {
        console.log('Error fetching country data', error)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const handleShowClick = (country) => {
    setSelectedCountry(country)
  }

  const countriesToShow = search
    ? allCountries.filter(country => 
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )
    : []

  return (
    <div style={{ padding: '20px' }}>
      <div>
        find countries <input value={search} onChange={handleSearchChange} />
      </div>

      <div style={{ marginTop: '20px' }}>
        {selectedCountry ? (
          <CountryDetails country={selectedCountry} />
        ) : countriesToShow.length === 1 ? (
          <CountryDetails country={countriesToShow[0]} />
        ) : search ? (
          <CountryList countries={countriesToShow} onShowClick={handleShowClick} />
        ) : null}
      </div>
    </div>
  )
}

export default App