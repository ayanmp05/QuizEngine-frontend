import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ onRetakeQuiz }) {
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [quizToStart, setQuizToStart] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('quizToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      try {
        const [quizzesRes, attemptsRes] = await Promise.all([
          fetch('https://quizengine-backend-xl2z.onrender.com/api/quizzes', { headers }),
          fetch('https://quizengine-backend-xl2z.onrender.com/api/attempts', { headers })
        ]);

        if (quizzesRes.ok && attemptsRes.ok) {
          setQuizzes(await quizzesRes.json());
          setAttempts(await attemptsRes.json());
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleRetake = async (quizId) => {
    const token = localStorage.getItem('quizToken');
    try {
      const res = await fetch(`https://quizengine-backend-xl2z.onrender.com/api/quizzes/${quizId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const fullQuiz = await res.json();
        onRetakeQuiz(fullQuiz._id, fullQuiz.questions);
      }
    } catch (error) {
      console.error("Failed to load quiz questions", error);
    }
  };

  if (loading) return <div className="text-center mt-20 text-gray-500 dark:text-gray-400 font-medium">Loading your performance data...</div>;

  return (
    <div className="space-y-8 animate-fade-in relative">

      {/* SECTION 1: Performance History */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-500 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Past Performance Logs</h2>
        {attempts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic">No attempts yet. Complete a quiz to see your stats!</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 text-sm border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Test Name</th>
                  <th className="p-4 font-semibold">Accuracy</th>
                  <th className="p-4 font-semibold">Avg Speed</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {attempts.map(attempt => (
                  <tr key={attempt._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{new Date(attempt.completedAt).toLocaleDateString()}</td>
                    <td className="p-4 text-sm font-medium text-gray-800 dark:text-gray-200">{attempt.quizId?.title || 'Unknown Test'}</td>
                    <td className="p-4 text-sm">
                      <span className={`font-bold ${attempt.accuracyPercent >= 70 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {attempt.accuracyPercent}%
                      </span>
                    </td>
                    <td className="p-4 text-sm font-bold text-blue-600 dark:text-blue-400">{attempt.averageTimeSeconds}s / Q</td>
                    <td className="p-4 text-sm text-right">
                      <button
                        onClick={() => navigate(`/attempt/${attempt._id}`, { state: { attempt } })}
                        className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-lg transition-colors shadow-sm border border-blue-100 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 2: Test Library */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-500 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Your Test Library</h2>
        {quizzes.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic">Upload a PDF to build your library.</p>
        ) : (
          <div className="flex flex-wrap gap-6">
            {quizzes.map(quiz => (
              <div key={quiz._id} className="w-full sm:w-[340px] p-5 border rounded-xl flex flex-col justify-between border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group bg-white dark:bg-gray-800/50">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate" title={quiz.title}>{quiz.title}</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Added: {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setQuizToStart(quiz)}
                  className="mt-4 w-full bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white hover:border-blue-600 font-semibold py-2 rounded-lg transition-all text-sm shadow-sm"
                >
                  Start Retake
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 text-center text-sm text-gray-500 dark:text-gray-400 rounded-xl shadow-sm transition-colors duration-300">
        <p>&copy; 2026 QuizEngine AI Solutions. All rights reserved.</p>
      </footer>

      {/* START EXAM WARNING MODAL */}
      {quizToStart && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in border border-transparent dark:border-gray-700">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">Ready to Begin?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
              You are about to start <span className="font-semibold text-gray-700 dark:text-gray-300">{quizToStart.title}</span>. Once you begin, navigating away will result in lost progress.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setQuizToStart(null)}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleRetake(quizToStart._id);
                  setQuizToStart(null);
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors shadow-md"
              >
                Start Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}