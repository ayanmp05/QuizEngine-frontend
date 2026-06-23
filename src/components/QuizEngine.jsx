import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuizEngine({ questions, onFinished }) {
  const navigate = useNavigate();
  const [showExitWarning, setShowExitWarning] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; // Required for Chrome to show the default warning popup
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Track selected options: { 0: "A", 1: "C", ... }
  const [answers, setAnswers] = useState({});

  // Track status of each question: 'unvisited', 'not_answered', 'answered', 'marked'
  const [statuses, setStatuses] = useState(Array(questions.length).fill('unvisited'));

  // Track time spent cumulatively per question
  const [timeSpent, setTimeSpent] = useState(Array(questions.length).fill(0));
  const [startTime, setStartTime] = useState(Date.now());
  
  // Live timer state for the UI
  const [liveQuestionTime, setLiveQuestionTime] = useState(0);

  // Initialize the first question as 'not_answered' (visited) on load
  useEffect(() => {
    const initStatuses = [...statuses];
    initStatuses[0] = 'not_answered';
    setStatuses(initStatuses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update the live timer every second based on the current startTime
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveQuestionTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime]);

  const saveTimeForCurrentQuestion = () => {
    const elapsed = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));
    const updatedTime = [...timeSpent];
    updatedTime[currentIndex] += elapsed;
    setTimeSpent(updatedTime);
    setStartTime(Date.now()); // Reset clock for the next question
  };

  const handleNavigation = (targetIndex, forcedStatus = null) => {
    saveTimeForCurrentQuestion();

    const newStatuses = [...statuses];

    // Assign status to the question we are leaving
    if (forcedStatus) {
      newStatuses[currentIndex] = forcedStatus;
    } else if (newStatuses[currentIndex] !== 'marked') {
      // If no explicit button was clicked, auto-determine based on if an answer exists
      newStatuses[currentIndex] = answers[currentIndex] ? 'answered' : 'not_answered';
    }

    // Mark the question we are jumping to as visited if it was previously untouched
    if (newStatuses[targetIndex] === 'unvisited') {
      newStatuses[targetIndex] = 'not_answered';
    }

    setStatuses(newStatuses);
    setCurrentIndex(targetIndex);
  };

  const handleOptionSelect = (option) => {
    setAnswers({ ...answers, [currentIndex]: option });
  };

  const handleClearResponse = () => {
    const newAnswers = { ...answers };
    delete newAnswers[currentIndex];
    setAnswers(newAnswers);
  };

  const handleSaveAndNext = () => {
    const nextIdx = currentIndex < questions.length - 1 ? currentIndex + 1 : currentIndex;
    handleNavigation(nextIdx, 'answered');
  };

  const handleSkip = () => {
    const nextIdx = currentIndex < questions.length - 1 ? currentIndex + 1 : currentIndex;
    handleNavigation(nextIdx, 'not_answered');
  };

  const handleMarkForReview = () => {
    const nextIdx = currentIndex < questions.length - 1 ? currentIndex + 1 : currentIndex;
    handleNavigation(nextIdx, 'marked');
  };

  const handleSubmitQuiz = () => {
    saveTimeForCurrentQuestion();

    const finalResults = questions.map((q, idx) => ({
      id: q.id,
      questionText: q.question,
      chosen: answers[idx] || 'Skipped',
      correct: q.answer,
      isCorrect: answers[idx] === q.answer,
      timeTaken: parseFloat((timeSpent[idx] || 0).toFixed(2))
    }));

    onFinished(finalResults);
  };

  const currentQ = questions[currentIndex];

  const getPaletteStyle = (status, index) => {
    let style = "h-10 w-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ";
    if (currentIndex === index) {
      style += "ring-4 ring-blue-400 dark:ring-blue-500 ring-offset-2 dark:ring-offset-gray-800 scale-110 z-10 ";
    } else {
      style += "hover:scale-105 ";
    }

    switch (status) {
      case 'answered':
        return style + "bg-green-500 text-white rounded-t-2xl rounded-b-sm"; 
      case 'not_answered':
        return style + "bg-red-500 text-white rounded-b-2xl rounded-t-sm"; 
      case 'marked':
        return style + "bg-purple-500 text-white rounded-full"; 
      default: 
        return style + "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md border border-gray-300 dark:border-gray-600"; 
    }
  };

  // Helper function to format seconds into MM:SS
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-[95%] mx-auto py-6 animate-fade-in">
      
      {/* Top Warning/Exit Bar */}
      <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <span className="font-bold text-gray-800 dark:text-gray-200">
          Question <span className="text-blue-600 dark:text-blue-400">{currentIndex + 1}</span> of {questions.length}
        </span>
        <button 
          onClick={() => setShowExitWarning(true)}
          className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-600 dark:hover:bg-red-600 hover:text-white dark:hover:text-white border border-red-100 dark:border-red-800/50 rounded-lg font-semibold transition-colors"
        >
          Exit Exam
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT SIDE: Active Question Area */}
        <div className="flex-1 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wider uppercase">Active Session</span>
            
            {/* Live Timer Display */}
            <span className={`text-sm font-medium flex items-center gap-1.5 px-3 py-1 rounded-md ${liveQuestionTime > 60 ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Time: <span className="font-mono font-bold text-gray-800 dark:text-gray-200 ml-1">{formatTime(liveQuestionTime)}</span>
            </span>
          </div>

          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 whitespace-pre-line leading-relaxed">
            {currentQ.question}
          </h2>

          <div className="space-y-3 mb-8 flex-1">
            {currentQ.options && currentQ.options.length > 0 ? (
              currentQ.options.map((option, idx) => {
                const isSelected = answers[currentIndex] === option;
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full text-left p-4 rounded-xl border text-base font-medium transition-all duration-150 ${isSelected
                        ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                      }`}
                  >
                    <span className="inline-block w-6 font-bold text-gray-400 dark:text-gray-500 mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {option}
                  </button>
                );
              })
            ) : (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 font-medium">
                ⚠️ The AI failed to extract the options for this question. Please skip.
              </div>
            )}
          </div>

          {/* Exam Action Bar */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleMarkForReview}
              className="px-5 py-2.5 rounded-lg font-semibold border border-purple-200 dark:border-purple-800/50 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
            >
              Mark for Review
            </button>

            <button
              onClick={handleClearResponse}
              disabled={!answers[currentIndex]}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-colors ${answers[currentIndex] ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600' : 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                }`}
            >
              Clear Response
            </button>

            <div className="flex-1"></div>

            <button
              onClick={handleSkip}
              className="px-5 py-2.5 rounded-lg font-semibold bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              Skip Question
            </button>

            <button
              onClick={handleSaveAndNext}
              disabled={!answers[currentIndex]}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm ${answers[currentIndex]
                  ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
            >
              Save & Next
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: The Questions Palette */}
        <div className="w-full lg:w-80 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 h-fit flex flex-col transition-colors duration-300">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 text-center border-b border-gray-100 dark:border-gray-700 pb-2">Questions Palette</h3>

          <div className="grid grid-cols-5 gap-3 mb-8">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleNavigation(idx)}
                className={getPaletteStyle(statuses[idx], idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="space-y-3 text-xs font-medium text-gray-600 dark:text-gray-400 mb-8 border-t border-gray-100 dark:border-gray-700 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-t-xl rounded-b-sm shadow-sm"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-b-xl rounded-t-sm shadow-sm"></div>
              <span>Not Answered</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full shadow-sm"></div>
              <span>Marked for Review</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600"></div>
              <span>Not Visited</span>
            </div>
          </div>

          <button
            onClick={handleSubmitQuiz}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors shadow-md mt-auto"
          >
            Submit Final Exam
          </button>
        </div>
      </div>

      {/* EXIT WARNING MODAL */}
      {showExitWarning && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in border border-transparent dark:border-gray-700">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">Leave Exam?</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
              If you leave now, your progress will be lost and this attempt will not be saved to your performance logs.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowExitWarning(false)} 
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition-colors"
              >
                Resume Test
              </button>
              <button 
                onClick={() => navigate('/dashboard')} 
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 text-white font-semibold rounded-xl transition-colors"
              >
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}