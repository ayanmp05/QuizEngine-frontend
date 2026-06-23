import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function AttemptDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const selectedAttempt = location.state?.attempt;

  useEffect(() => {
    if (!selectedAttempt) {
      navigate('/dashboard');
    }
  }, [selectedAttempt, navigate]);

  const scrollToQuestion = (idx) => {
    const el = document.getElementById(`audit-q-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (!selectedAttempt) return null;

  return (
    <div className="bg-white mt-10 dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in transition-colors duration-300">
      
      {/* Header Navigation */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center sticky top-0 z-20 shadow-sm transition-colors duration-300">
        <div>
          <h2 className="font-bold text-xl text-gray-800 dark:text-gray-100">Exam Audit Report</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedAttempt.quizId?.title || 'Unknown Test'} • {new Date(selectedAttempt.completedAt).toLocaleDateString()}</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Aggregate Stats Bar */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-700 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 relative z-10 transition-colors duration-300">
        <div className="p-4 text-center">
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Total Score</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{selectedAttempt.score} <span className="text-sm text-gray-400 dark:text-gray-500">/ {selectedAttempt.details?.length || 0}</span></p>
        </div>
        <div className="p-4 text-center">
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Accuracy</p>
          <p className={`text-2xl font-bold ${selectedAttempt.accuracyPercent >= 70 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>{selectedAttempt.accuracyPercent}%</p>
        </div>
        <div className="p-4 text-center">
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Avg Speed</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedAttempt.averageTimeSeconds}s</p>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT: Questions & Palette */}
      {/* Container uses flex-col on mobile, flex-row on lg screens */}
      <div className="flex flex-col lg:flex-row bg-gray-50/50 dark:bg-gray-900/20 transition-colors duration-300">
        
        {/* RIGHT: Performance Palette (Applied order-1 for mobile, lg:order-2 for desktop) */}
        <div className="order-1 lg:order-2 w-full lg:w-80 bg-white dark:bg-gray-800 p-6 shrink-0 border-b lg:border-b-0 lg:border-l border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="sticky top-6">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-6 text-center pb-2 border-b border-gray-100 dark:border-gray-700">Questions Palette</h3>

            <div className="grid grid-cols-5 gap-2 mb-8">
              {selectedAttempt.details && selectedAttempt.details.map((item, idx) => {
                let btnClass = "h-10 w-full flex items-center justify-center font-bold text-sm rounded-md transition-all hover:scale-105 shadow-sm border ";
                if (item.chosen === 'Skipped') {
                  btnClass += "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600";
                } else if (item.isCorrect) {
                  btnClass += "bg-green-500 dark:bg-green-600 text-white border-green-600 dark:border-green-500";
                } else {
                  btnClass += "bg-red-500 dark:bg-red-600 text-white border-red-600 dark:border-red-500";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => scrollToQuestion(idx)}
                    className={btnClass}
                    title={`Go to Question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-4 text-xs font-medium text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 dark:bg-green-600 rounded-md border border-green-600 dark:border-green-500 shadow-sm flex shrink-0"></div>
                <span>Answered Correctly</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-500 dark:bg-red-600 rounded-md border border-red-600 dark:border-red-500 shadow-sm flex shrink-0"></div>
                <span>Answered Incorrectly</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm flex shrink-0"></div>
                <span>Skipped</span>
              </div>
            </div>
          </div>
        </div>

        {/* LEFT: Detailed Question List (Applied order-2 for mobile, lg:order-1 for desktop) */}
        <div className="order-2 lg:order-1 flex-1 border-r border-gray-200 dark:border-gray-700">
          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[700px] overflow-y-auto custom-scrollbar">
            {!selectedAttempt.details || selectedAttempt.details.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400 italic">No granular details available for this legacy attempt.</div>
            ) : (
              selectedAttempt.details.map((item, idx) => (
                <div key={idx} id={`audit-q-${idx}`} className="p-6 hover:bg-white dark:hover:bg-gray-800/80 transition-colors">
                  
                  {/* Top Row: Question & Time */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                      <span className="text-blue-600 dark:text-blue-400 font-bold mr-2 text-base">Q{idx + 1}.</span>
                      {item.questionText}
                    </h4>
                    
                    {/* Highlighted Time Badge */}
                    <div className="shrink-0 flex flex-col items-end">
                      <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md border shadow-sm transition-colors ${
                        item.chosen === 'Skipped' ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600' :
                        item.isCorrect ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                      }`}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {item.timeTaken}s
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">Time Taken</span>
                    </div>
                  </div>
                  
                  {/* Bottom Row: Highlighted Answer Cards */}
                  <div className="flex flex-wrap items-start gap-4 mt-3">
                    
                    {/* User's Answer Card */}
                    <div className={`min-w-[240px] max-w-md p-3 rounded-lg border shadow-sm flex flex-col justify-center relative overflow-hidden transition-colors ${
                      item.chosen === 'Skipped' ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600' :
                      item.isCorrect ? 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-800/50' : 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-800/50'
                    }`}>
                      <span className="text-[11px] font-bold uppercase tracking-wider mb-1 text-gray-500 dark:text-gray-400">Your Answer</span>
                      <span className={`text-sm font-semibold relative z-10 ${
                        item.chosen === 'Skipped' ? 'text-gray-700 dark:text-gray-400 italic' :
                        item.isCorrect ? 'text-green-800 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                      }`}>
                        {item.chosen === 'Skipped' ? 'Skipped (Did not answer)' : item.chosen}
                      </span>
                    </div>

                    {/* Correct Answer Card (Only renders if user was wrong or skipped) */}
                    {!item.isCorrect && (
                      <div className="min-w-[240px] max-w-md pr-14 p-3 rounded-lg border shadow-sm bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-800/50 flex flex-col justify-center relative overflow-hidden transition-colors">
                        <div className="absolute right-0 top-0 bottom-0 w-10 bg-green-200 dark:bg-green-800/50 flex items-center justify-center opacity-50">
                            <svg className="w-5 h-5 text-green-700 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider mb-1 text-green-700/80 dark:text-green-400/80">Correct Answer</span>
                        <span className="text-sm font-semibold text-green-900 dark:text-green-300 relative z-10">{item.correct}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}