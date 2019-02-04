import React, {useEffect, useState} from 'react'
import axios from 'axios'

const App = () => {
    const [countries, setCountries] = useState([])
    const [newFilter, setNewFilter] = useState('')
    const hook = () => {
        const eventHandler = response => {
            setCountries(response.data)
        }
        axios.get('https://restcountries.eu/rest/v2/all').then(eventHandler)
    }
    useEffect(hook, [])
    const handleFilterChange = event => {
        setNewFilter(event.target.value)
    }
    const getFilteredCountries = () => {
        const filterByName = country => country.name.toLowerCase().includes(newFilter.toLowerCase())
        return countries.filter(filterByName)
    }

    return (
        <div>
            <FilterForm value={newFilter} handler={handleFilterChange}/>
            <Content countries={getFilteredCountries()}/>
        </div>
    )
}

const FilterForm = ({value, handler}) => (
    <form>
        <label>find countries </label>
        <input value={value} onChange={handler}/>
    </form>
)

const Content = ({countries}) => {
    const countryNames = () => countries.map(country => <CountryName key={country.name} country={country}/>)
    if (countries.length > 10) {
        return <div>Too many matches, specify another filter</div>
    } else if (countries.length > 1) {
        return <div>{countryNames()}</div>
    } else if (countries.length > 0) {
        return <Country country={countries[0]}/>
    } else {
        return <div></div>
    }
}

const CountryName = ({country}) => <div>{country.name}</div>

const Country = ({country}) => {
    const getLanguages = () =>
        country.languages.map(language => <Language key={language.code} language={language}/>)
    return (
        <div>
            <h1>{country.name}</h1>
            <div>capital {country.capital}</div>
            <div>population {country.population}</div>
            <h2>languages</h2>
            <ul>{getLanguages()}</ul>
            <img src={country.flag} alt='flag' height='80'/>
        </div>
    )
}

const Language = ({language}) => <li>{language.name}</li>

export default App
