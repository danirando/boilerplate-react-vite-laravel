import { useState, useMemo } from 'react'
import './App.css'

function App() {
  const [category, setCategory] = useState('beer')
  const [abv, setAbv] = useState(5.0)
  const [volume, setVolume] = useState(330)
  const [history, setHistory] = useState([])
  
  // User Profile for BAC
  const [weight, setWeight] = useState(75)
  const [gender, setGender] = useState('male')
  const [showSettings, setShowSettings] = useState(false)

  // Presets configuration
  const presets = {
    beer: [
      { label: 'Piccola', ml: 200 },
      { label: 'Media', ml: 400 },
      { label: 'Pinta', ml: 568 },
    ],
    wine: [
      { label: 'Calice', ml: 125 },
      { label: 'Degustazione', ml: 75 },
      { label: 'Bottiglia', ml: 750 },
    ],
    spirit: [
      { label: 'Shot', ml: 40 },
      { label: 'Cocktail', ml: 50 },
      { label: 'Doppio', ml: 80 },
    ],
  }

  const abvRange = {
    beer: { min: 2, max: 15, step: 0.1 },
    wine: { min: 8, max: 20, step: 0.1 },
    spirit: { min: 15, max: 80, step: 1 },
  }

  // Current Calculation
  const currentEthics = useMemo(() => {
    const ethanolGrams = volume * (abv / 100) * 0.789
    const ethanolKcal = ethanolGrams * 7

    let offsetKcal = 0
    if (category === 'beer') {
      offsetKcal = (volume / 100) * 1.5 * 10 
    } else if (category === 'wine') {
      offsetKcal = (volume / 100) * 2 * 5
    }

    return { kcal: Math.round(ethanolKcal + offsetKcal), grams: ethanolGrams }
  }, [category, abv, volume])

  const addDrinkToLog = () => {
    const newEntry = {
      id: Date.now(),
      category,
      abv,
      volume,
      kcal: currentEthics.kcal,
      grams: currentEthics.grams,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setHistory([newEntry, ...history])
  }

  const removeDrink = (id) => {
    setHistory(history.filter(item => item.id !== id))
  }

  const totals = useMemo(() => {
    const kcal = history.reduce((sum, item) => sum + item.kcal, 0)
    const grams = history.reduce((sum, item) => sum + item.grams, 0)
    
    // Widmark Formula: BAC = [Alcohol (g) / (Body Weight (kg) * r)]
    // r = 0.68 for men, 0.55 for women
    const r = gender === 'male' ? 0.68 : 0.55
    const bac = grams / (weight * r)
    
    return { kcal, bac: parseFloat(bac.toFixed(2)) }
  }, [history, weight, gender])

  const getBacStatus = (val) => {
    if (val <= 0) return { label: 'Sobrio', color: '#10b981' }
    if (val < 0.5) return { label: 'Sotto Limite', color: '#f59e0b' }
    return { label: 'Sopra Limite', color: '#ef4444' }
  }

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    if (cat === 'beer') setAbv(5.0)
    if (cat === 'wine') setAbv(12.5)
    if (cat === 'spirit') setAbv(40.0)
  }

  return (
    <div className="app-container">
      <div className="main-layout">
        {/* Left Side: Calculator */}
        <div className="card calculator">
          <header className="title-section">
            <div className="header-top">
              <h1>Alcohol Counter</h1>
              <button className="settings-toggle" onClick={() => setShowSettings(!showSettings)}>
                {showSettings ? '✕' : '⚙️ Profilo'}
              </button>
            </div>
            <p>Monitora calorie e tasso alcolemico stimato</p>
          </header>

          {showSettings ? (
            <div className="settings-panel">
              <h3>Impostazioni Profilo</h3>
              <div className="setting-item">
                <label>Sesso</label>
                <div className="gender-selector">
                  <button className={gender === 'male' ? 'active' : ''} onClick={() => setGender('male')}>Uomo</button>
                  <button className={gender === 'female' ? 'active' : ''} onClick={() => setGender('female')}>Donna</button>
                </div>
              </div>
              <div className="setting-item">
                <div className="label-row">
                  <label>Peso Corporeo</label>
                  <span>{weight} kg</span>
                </div>
                <input type="range" min="40" max="150" value={weight} onChange={(e) => setWeight(parseInt(e.target.value))} />
              </div>
              <button className="save-btn" onClick={() => setShowSettings(false)}>Usa questi dati</button>
            </div>
          ) : (
            <>
              <div className="category-selector">
                <button className={`cat-btn ${category === 'beer' ? 'active beer' : ''}`} onClick={() => handleCategoryChange('beer')}>
                  <span>🍺</span><span>Birra</span>
                </button>
                <button className={`cat-btn ${category === 'wine' ? 'active wine' : ''}`} onClick={() => handleCategoryChange('wine')}>
                  <span>🍷</span><span>Vino</span>
                </button>
                <button className={`cat-btn ${category === 'spirit' ? 'active spirit' : ''}`} onClick={() => handleCategoryChange('spirit')}>
                  <span>🥃</span><span>Spirit</span>
                </button>
              </div>

              <div className="inputs-section">
                <div className="input-group">
                  <div className="label-row">
                    <label>Gradazione Alcolica (ABV %)</label>
                    <span className="value-badge">{abv.toFixed(1)}%</span>
                  </div>
                  <input type="range" min={abvRange[category].min} max={abvRange[category].max} step={abvRange[category].step} value={abv} onChange={(e) => setAbv(parseFloat(e.target.value))} />
                </div>

                <div className="input-group">
                  <div className="label-row">
                    <label>Quantità (ml)</label>
                    <span className="value-badge">{volume} ml</span>
                  </div>
                  <input type="range" min="10" max="1000" step="5" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))} />
                  <div className="presets">
                    {presets[category].map((preset) => (
                      <button key={preset.label} className="preset-btn" onClick={() => setVolume(preset.ml)}>{preset.label}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="result-section">
                <div>
                  <span className="kcal-value">{currentEthics.kcal}</span>
                  <span className="kcal-label">Kcal Calcolate</span>
                </div>
                <button className="add-log-btn" onClick={addDrinkToLog}>Aggiungi ＋</button>
              </div>
            </>
          )}
        </div>

        {/* Right Side: Log / History */}
        <div className="card history-panel">
          <header className="history-header">
            <div className="summary-main">
              <h2>Riepilogo Giornaliero</h2>
              <div className="summary-badges">
                <div className="total-badge">
                  <span className="total-label">Totale Calorie</span>
                  <span className="total-value">{totals.kcal} kcal</span>
                </div>
                <div className="bac-badge">
                  <span className="total-label">BAC Stimato</span>
                  <span className="total-value" style={{ color: getBacStatus(totals.bac).color }}>
                    {totals.bac} <small>g/L</small>
                  </span>
                  <span className="bac-status" style={{ background: getBacStatus(totals.bac).color }}>
                    {getBacStatus(totals.bac).label}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <div className="history-list">
            {history.length === 0 ? (
              <div className="empty-state">
                <p>Nessun drink registrato oggi.</p>
                <span style={{ fontSize: '2rem', opacity: 0.3 }}>🍹</span>
              </div>
            ) : (
              history.map(item => (
                <div key={item.id} className={`history-item ${item.category}`}>
                  <div className="item-icon">{item.category === 'beer' ? '🍺' : item.category === 'wine' ? '🍷' : '🥃'}</div>
                  <div className="item-details">
                    <span className="item-name">{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
                    <span className="item-sub">{item.volume}ml • {item.abv}%</span>
                  </div>
                  <div className="item-kcal">
                    <span>{item.kcal} kcal</span>
                    <button className="delete-btn" onClick={() => removeDrink(item.id)}>✕</button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <footer className="safety-disclaimer">
            ⚠ La stima BAC è puramente indicativa (Widmark Formula). Non guidare dopo aver consumato alcolici.
          </footer>
        </div>
      </div>
    </div>
  )
}

export default App
