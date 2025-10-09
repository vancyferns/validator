import EmailVerifier from './components/EmailVerifier'
import PhoneVerifier from './components/PhoneVerifier' // <-- Import the new component
import './App.css'

function App() {
  return (
    <div className="container">
      <h1>React + Flask Verifier</h1>
      
      {/* Email Section */}
      <div className="verifier-section">
        <h2>Email Reputation</h2>
        <p>Check if an email is valid and reputable.</p>
        <EmailVerifier />
      </div>

      {/* Phone Section */}
      <div className="verifier-section">
        <h2>Phone Number Validation</h2>
        <p>Check if a phone number is valid and get its details.</p>
        <PhoneVerifier />
      </div>
    </div>
  )
}

export default App