import React, { useState } from 'react';
import './EmailVerifier.css'; // We can reuse the same CSS

function PhoneVerifier() {
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const FLASK_API_URL = 'http://127.0.0.1:5000/api/verify-phone';

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${FLASK_API_URL}?phone=${encodeURIComponent(phone)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Request failed.');
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
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number with country code..."
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
              {/* ✅ FIX: Updated to match the Phone Intelligence API response structure */}
              <p><strong>Is Valid:</strong> {String(result.phone_validation?.is_valid)}</p>
              <p><strong>Number:</strong> {result.phone_format?.international}</p>
              <p><strong>Country:</strong> {result.phone_location?.country_name}</p>
              <p><strong>Carrier:</strong> {result.phone_carrier?.name}</p>
              <p><strong>Risk Level:</strong> {result.phone_risk?.risk_level}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PhoneVerifier;