import React, { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = 'https://countries-search-data-prod-812920491762.asia-south1.run.app/countries'

function getCountryName(c) {
  if (!c) return ''
  return (
    (c.name && (c.name.common || c.name)) ||
    c.common ||
    c.country ||
    c.name ||
    c.alpha2 ||
    ''
  )
}

function getFlagUrl(c) {
  if (!c) return ''
  if (c.flags) {
    if (typeof c.flags === 'string') return c.flags
    return c.flags.png || c.flags.svg || c.flags[0] || ''
  }
  return c.png || c.flag || c.flagUrl || ''
}

export default function App() {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error('Network response was not ok: ' + res.status)
        const data = await res.json()
        const list = Array.isArray(data) ? data : data.countries || []
        if (mounted) setCountries(list)
      } catch (err) {
        console.error('Failed to load countries:', err)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    if (!query || query.trim() === '') return countries
    const q = query.trim().toLowerCase()
    return countries.filter((c) => getCountryName(c).toLowerCase().includes(q))
  }, [countries, query])

  return (
    <main className="app">
      <h1 className="title">Countries Search</h1>

      <div className="searchWrapper">
        <input
          type="text"
          id="searchInput"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search countries..."
        />
      </div>

      <section id="countriesContainer" className="countriesContainer" aria-live="polite">
        {filtered.map((c, idx) => {
          const name = getCountryName(c) || ''
          const flag = getFlagUrl(c) || ''
          return (
            <div className="countryCard" key={idx}>
              <img src={flag} alt={name} />
              <div className="countryName">{name}</div>
            </div>
          )
        })}
      </section>
    </main>
  )
}
