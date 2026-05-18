import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/message`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMessage(data.message);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to React + ECS Demo!</h1>

        <div className="card">
          <h2>Backend API Response:</h2>
          {loading && <p className="loading">Loading data from backend...</p>}
          {error && <p className="error">Error: {error}</p>}
          {!loading && !error && (
            <div className="success-message">
              <p>"{message}"</p>
            </div>
          )}
        </div>
        <p className="footer-text">
          Frontend is running via Nginx on port 80. Backend is Node+Express on port 5000.
        </p>
      </header>
    </div>
  );
}

export default App;
