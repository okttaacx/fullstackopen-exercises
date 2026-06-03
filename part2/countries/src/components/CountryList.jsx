const CountryList = ({ countries, onShowClick }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  if (countries.length === 0) {
    return <div>No matches found</div>
  }

  return (
    <ul>
      {countries.map(country => (
        <li key={country.cca3 || country.name.common}>
          {country.name.common} {' '}
          <button onClick={() => onShowClick(country)}>show</button>
        </li>
      ))}
    </ul>
  )
}

export default CountryList