import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [backendStatus, setBackendStatus] = useState({ loading: true, data: null })

  useEffect(() => {
    fetch('http://localhost:8000/api/status')
      .then(res => res.json())
      .then(data => {
        setBackendStatus({ loading: false, data })
      })
      .catch(err => {
        console.error('Backend connection error:', err)
        setBackendStatus({ loading: false, data: { status: 'offline', message: 'Backend unreachable' } })
      })
  }, [])

  return (
    <div className="container">
      <nav className="navbar">
        <div className="logo-group">
          <img src={viteLogo} className="logo vite" alt="Vite logo" />
          <img src={reactLogo} className="logo react" alt="React logo" />
        </div>
        <div className="status-indicator">
          {backendStatus.loading ? (
            <span className="badge-loading">Checking Backend...</span>
          ) : (
            <span className={`badge-status ${backendStatus.data?.status}`}>
              {backendStatus.data?.status === 'online' ? '● Backend Online' : '○ Backend Offline'}
            </span>
          )}
        </div>
        <div className="nav-links">
          <a href="https://vite.dev" target="_blank" rel="noreferrer">Vite Docs</a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">React Docs</a>
        </div>
      </nav>

      <main className="hero-section">
        <div className="badge">New Project Core</div>
        <h1>
          Experience the <br />
          <span>Next Generation</span>
        </h1>
        <p>
          Your React + Vite project is ready and connected to Laravel.
          Start building your masterpiece by editing <code>src/App.jsx</code>.
        </p>
        
        {backendStatus.data?.message && (
          <div className="backend-msg">
            <p>"{backendStatus.data.message}"</p>
          </div>
        )}

        <div className="cta-group">
          <button className="primary-btn" onClick={() => setCount((count) => count + 1)}>
            Interactive Count: {count}
          </button>
          <a href="https://github.com/vitejs/vite" target="_blank" rel="noreferrer" className="secondary-link">
            Explore Repository →
          </a>
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 Antigravity Scaffolding. Built with passion.</p>
      </footer>
    </div>
  )
}

export default App


