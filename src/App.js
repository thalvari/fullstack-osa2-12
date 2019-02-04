import React, {useEffect, useState} from 'react'
import axios from 'axios'

const App = () => {
    const [countries, setCountries] = useState([])
    const [newFilter, setNewFilter] = useState('')
    const [selected, setSelected] = useState('')
    const hook = () => {
        const eventHandler = response => {
            setCountries(response.data)
        }
        axios.get('https://restcountries.eu/rest/v2/all').then(eventHandler)
    }
    useEffect(hook, [])
    const handleFilterChange = event => {
        setSelected('')
        setNewFilter(event.target.value)
    }
    const handleSelected = country => event => {
        event.preventDefault()
        setSelected(country.name)
    }
    const getFilteredCountries = () => {
        let filter
        if (selected.length !== 0) {
            filter = country => country.name === selected
        } else {
            filter = country => country.name.toLowerCase().includes(newFilter.toLowerCase())
        }
        return countries.filter(filter)
    }

    return (
        <div>
            <FilterForm value={newFilter} handler={handleFilterChange}/>
            <Content countries={getFilteredCountries()} handleSelected={handleSelected}/>
        </div>
    )
}

const FilterForm = ({value, handler}) => (
    <form>
        <label>find countries </label>
        <input value={value} onChange={handler}/>
    </form>
)

const Content = ({countries, handleSelected}) => {
    const countryNames = () =>
        countries.map(country => <CountryName key={country.name} country={country} handleSelected={handleSelected}/>)
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

const CountryName = ({country, handleSelected}) => (
    <form onSubmit={handleSelected(country)}>
        <label>{country.name} </label>
        <button type="submit">show</button>
    </form>
)

const Country = ({country}) => {
    const getLanguages = () =>
        country.languages.map(language => <Language key={language.name} language={language}/>)
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
