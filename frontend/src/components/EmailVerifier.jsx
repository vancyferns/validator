import React, { useState } from 'react';
import './EmailVerifier.css';

function EmailVerifier() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // This URL points to your local Flask server's API endpoint
  const FLASK_API_URL = 'https://validator-jnok.onrender.com/api/verify-email';

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // The fetch call securely contacts your backend, which then uses the secret key
      const response = await fetch(`${FLASK_API_URL}?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed.');
      }
      
      setResult(data);

    } catch (error) {
      console.error('Verification failed:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verifier-container">
      <form onSubmit={handleVerify} className="verifier-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter an email to verify..."
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Verify'}
        </button>
      </form>

      {result && (
        <div className="result-card">
          <h4>Result</h4>
          {result.error ? (
             <p className="error-message">{result.error}</p>
          ) : (
            <>
              <p><strong>Reputation:</strong> {result.reputation_details?.reputation_level || 'N/A'}</p>
              <p><strong>Is Disposable:</strong> {String(result.email_quality?.is_disposable)}</p>
              <p><strong>Total Breaches:</strong> {result.email_breaches?.total_breaches}</p>
              <details>
                <summary>Show Full API Response</summary>
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </details>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default EmailVerifier;
