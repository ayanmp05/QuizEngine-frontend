import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AuthPortal({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Validation Logic
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const passwordCriteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Pre-flight checks before hitting the API
    if (!isEmailValid) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isLogin && !isPasswordValid) {
      setError('Please satisfy all password requirements before registering.');
      return;
    }

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(`https://quizengine-backend-xl2z.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      if (isLogin) {
        localStorage.setItem('quizToken', data.token);
        localStorage.setItem('userEmail', data.email);
        onLogin(data.email);
      } else {
        setIsLogin(true);
        // Reset fields on successful registration
        setPassword('');
        alert('Registration successful! Please log in with your new credentials.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Helper for rendering the dynamic password rules
  const RuleItem = ({ met, text }) => (
    <li className={`flex items-center gap-1.5 text-xs transition-colors duration-300 ${met ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {met ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        ) : (
          <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
        )}
      </svg>
      {text}
    </li>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 to-indigo-900 dark:from-gray-900 dark:to-gray-800 flex flex-col font-sans overflow-x-hidden transition-colors duration-300">
      {/* Header */}
      <header className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-8 flex justify-between items-center shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white font-bold px-3 py-1 rounded-lg">AI</div>
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">QuizEngine</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link to="/features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link>
          <Link to="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link>
          <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 transition-colors duration-300 border border-transparent dark:border-gray-700">

          {/* Left Side: Pitch */}
          <div className="bg-gray-900 dark:bg-gray-900/50 p-12 text-white flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold mb-6">ACE Your Exams</h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Transform static PDFs into interactive, timed, and AI-analyzed practice sessions.
              Built specifically to simulate the real exam interface.
            </p>
            <ul className="space-y-4">
              {['AI-Powered Text Parsing', 'Timed Exam Simulation', 'Granular Performance Analytics', 'Secure Test History'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="text-blue-400 font-bold">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side: Auth Form */}
          <div className="p-12 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">{isLogin ? 'Welcome Back' : 'Create Your Account'}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 transition-colors">{isLogin ? 'Enter your credentials to continue.' : 'Start your prep journey today.'}</p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 transition-colors">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className={`w-full p-4 bg-gray-50 dark:bg-gray-900/50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white ${email.length > 0 && !isEmailValid
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 dark:border-gray-700'
                    }`}
                  placeholder="name@example.com"
                />
                {email.length > 0 && !isEmailValid && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">Please enter a valid email address.</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 transition-colors">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />

                {/* Dynamic Password Rules (Only shows on Registration) */}
                {!isLogin && (
                  <div className="mt-3 bg-gray-50 dark:bg-gray-900/30 p-3 rounded-lg border border-gray-100 dark:border-gray-700 transition-colors">
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Password Requirements:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <RuleItem met={passwordCriteria.length} text="8+ Characters" />
                      <RuleItem met={passwordCriteria.uppercase} text="Uppercase Letter" />
                      <RuleItem met={passwordCriteria.lowercase} text="Lowercase Letter" />
                      <RuleItem met={passwordCriteria.number} text="At least 1 Number" />
                      <RuleItem met={passwordCriteria.special} text="Special Character (!@#$)" />
                    </ul>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium flex items-start gap-2">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={(!isLogin && !isPasswordValid) || (email.length > 0 && !isEmailValid)}
              >
                {isLogin ? 'Sign In' : 'Register Now'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setPassword('');
                }}
                className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
        <p>&copy; 2026 QuizEngine AI Solutions. All rights reserved.</p>
        <p className="mt-1">Built to help you succeed in your competitive exams.</p>
      </footer>
    </div>
  );
}