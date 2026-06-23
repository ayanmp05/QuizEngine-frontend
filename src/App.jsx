import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Import Core Components
import FileUpload from './components/FileUpload';
import QuizEngine from './components/QuizEngine';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AuthPortal from './components/AuthPortal';
import Dashboard from './components/Dashboard';

// Import Pages
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import AttemptDetails from './pages/AttemptDetails';

function AppContent() {
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('userEmail'));
  const navigate = useNavigate();
  const location = useLocation();

  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [activeQuizId, setActiveQuizId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [quizResults, setQuizResults] = useState([]);

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem('quizToken');
    localStorage.removeItem('userEmail');
    setUserEmail(null);
    navigate('/login');
  };

  const handleQuizLoaded = (quizId, extractedQuestions) => {
    setActiveQuizId(quizId);
    setQuestions(extractedQuestions);
    navigate('/quiz');
  };

  const handleQuizFinished = async (finalResults) => {
    setQuizResults(finalResults);
    navigate('/analytics');

    const correctCount = finalResults.filter(r => r.isCorrect).length;
    const accuracyPercent = ((correctCount / finalResults.length) * 100).toFixed(0);
    const totalTime = finalResults.reduce((sum, r) => sum + r.timeTaken, 0);
    const avgTime = (totalTime / finalResults.length).toFixed(1);

    try {
      await fetch('https://quizengine-backend-xl2z.onrender.com/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('quizToken')}` },
        body: JSON.stringify({
          quizId: activeQuizId,
          score: correctCount,
          accuracyPercent: Number(accuracyPercent),
          averageTimeSeconds: Number(avgTime),
          details: finalResults
        })
      });
    } catch (error) {
      console.error("Failed to save attempt data", error);
    }
  };

  const isTakingQuiz = location.pathname === '/quiz';
  const isViewingAttempt = location.pathname.startsWith('/attempt');
  const isLoginPage = location.pathname === '/login';
  const isLoggedIn = Boolean(userEmail);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col font-sans">

      {/* GLOBAL HEADER */}
      {!isTakingQuiz && !isLoginPage && (
        <header className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-8 flex justify-between items-center shadow-sm transition-colors duration-300">
          <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="bg-blue-600 text-white font-bold px-3 py-1 rounded-lg">AI</div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">QuizEngine</span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            <Link to="/features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link>
            <Link to="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link>
            <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link>
          </nav>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </header>
      )}

      {/* MOBILE COLLAPSIBLE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 space-y-4 text-center shadow-md animate-fade-in transition-all">
          <Link to="/dashboard" className="block text-blue-600 dark:text-blue-400 font-bold">Dashboard</Link>
          <Link to="/features" className="block text-gray-600 dark:text-gray-300 font-medium py-2">Features</Link>
          <Link to="/pricing" className="block text-gray-600 dark:text-gray-300 font-medium py-2">Pricing</Link>
          <Link to="/contact" className="block text-gray-600 dark:text-gray-300 font-medium py-2">Contact</Link>
          <button onClick={handleLogout} className="block w-full text-red-600 dark:text-red-400 font-bold">Logout</button>
        </div>
      )}

      {/* DASHBOARD CONTROLS */}
      {!isTakingQuiz && !isViewingAttempt && !isLoginPage && isLoggedIn && (
        <header className="max-w-[95%] mx-auto my-8 bg-white dark:bg-gray-800 p-4 w-full rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors duration-300">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Welcome User ✨</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Logged in as: {userEmail}</p>
          </div>
          <div className="flex gap-3 items-center">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-lg text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 transition-all shadow-sm">
              {isDarkMode ? "☀️" : "🌙"}
            </button>
            <button onClick={() => navigate('/dashboard')} className={`hidden md:block px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${location.pathname === '/dashboard' ? 'bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}>Dashboard</button>
            <button onClick={() => navigate('/upload')} className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">+ New Test</button>
            <button onClick={handleLogout} className="hidden md:block px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-2">Logout</button>
          </div>
        </header>
      )}

      {/* DYNAMIC CONTENT AREA */}
      <main className={isTakingQuiz || isLoginPage ? "w-full flex-grow flex flex-col" : "max-w-[95%] mx-auto w-full pb-10"}>
        <Routes>
          <Route path="/login" element={!isLoggedIn ? <AuthPortal onLogin={setUserEmail} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard onRetakeQuiz={handleQuizLoaded} onLogout={handleLogout} userEmail={userEmail} /> : <Navigate to="/login" />} />
          <Route path="/upload" element={isLoggedIn ? <FileUpload onQuestionsReceived={(data, quizId) => handleQuizLoaded(quizId, data)} /> : <Navigate to="/login" />} />

          <Route path="/quiz" element={
            isLoggedIn && questions.length > 0 ?
              <QuizEngine questions={questions} onFinished={handleQuizFinished} /> :
              <Navigate to="/dashboard" />
          } />

          <Route path="/analytics" element={isLoggedIn ? <AnalyticsDashboard results={quizResults} questions={questions} onReset={() => navigate('/dashboard')} /> : <Navigate to="/login" />} />
          <Route path="/attempt/:id" element={isLoggedIn ? <AttemptDetails /> : <Navigate to="/login" />} />

          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
      <Analytics />
      <SpeedInsights />
    </Router>
  );
}
