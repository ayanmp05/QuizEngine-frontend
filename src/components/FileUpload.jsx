import { useState } from 'react';

export default function FileUpload({ onQuestionsReceived }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State to hold the questions temporarily before starting the quiz
  const [readyData, setReadyData] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Invalid format. Please select a valid PDF document.');
      return;
    }

    setError('');
    setLoading(true);
    setReadyData(null); // Reset the ready state if they upload a new file

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('https://quizengine-backend-xl2z.onrender.com/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('quizToken')}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server rejected the file. The AI might be under heavy load.');
      }

      const data = await response.json();

      if (data.questions && data.questions.length > 0) {
        // INSTEAD of starting the quiz immediately, we save the data to state
        setReadyData({
          questions: data.questions,
          quizId: data.quizId
        });
      } else {
        setError('AI could not locate structured questions inside this document.');
      }
    } catch (err) {
      setError(`${err.message || 'An unexpected communication failure occurred.'} Please wait a few seconds and try uploading again.`);
    } finally {
      setLoading(false);
    }
  };

  // This function is triggered ONLY when the user clicks the "Start Quiz Now" button
  const handleStartQuiz = () => {
    onQuestionsReceived(readyData.questions, readyData.quizId);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in transition-colors duration-300">

      {/* HEADER SECTION */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Upload Test Document</h2>
        <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Transform your static PDFs into interactive, AI-analyzed exams.</p>
      </div>

      {/* MAIN UPLOAD BOX */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">

        {/* conditionally render the Success/Start screen if data is ready */}
        {readyData ? (
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
              {/* Success Checkmark Icon */}
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors">Questions Ready!</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 transition-colors">
              Successfully extracted <span className="font-bold text-gray-800 dark:text-gray-200">{readyData.questions.length}</span> questions from your PDF. The document has been securely saved to your library.
            </p>

            <button
              onClick={handleStartQuiz}
              className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md transform hover:scale-[1.02]"
            >
              Start Quiz Now
            </button>

            <button
              onClick={() => setReadyData(null)}
              className="w-full mt-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold py-3 rounded-xl transition-colors"
            >
              Upload a Different PDF
            </button>
          </div>
        ) : (
          /* The standard upload view */
          <>
            <div className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-10 transition-colors cursor-pointer relative ${loading
                ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 cursor-not-allowed opacity-70'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-900/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
              }`}>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                disabled={loading}
              />
              <div className="text-center pointer-events-none">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <p className="text-lg font-bold text-gray-700 dark:text-gray-200 transition-colors">Click to upload or drag your PDF here</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">PDF file containing questions & answers</p>
              </div>
            </div>

            {loading && (
              <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl text-center animate-pulse transition-colors">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                <p className="text-blue-700 dark:text-blue-400 font-bold text-lg mb-1">Extracting & Analyzing PDF...</p>
                <p className="text-red-600 dark:text-red-400 font-semibold text-sm">
                  ⚠️ Please do not close or refresh this page. Doing so may crash the extraction process.
                </p>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl flex items-start gap-3 transition-colors">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-sm text-red-700 dark:text-red-300 font-medium leading-relaxed">{error}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* GUIDELINES & PRECAUTIONS PANEL */}
      {!readyData && (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 p-6 rounded-2xl transition-colors duration-300">
          <h3 className="text-lg font-bold text-amber-800 dark:text-amber-500 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            How it works & Precautions
          </h3>
          <ul className="space-y-3 text-sm text-amber-700 dark:text-amber-200/80">
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5 text-amber-500">•</span>
              <span><strong>How to Upload:</strong> Simply drag and drop your PDF into the dashed box above, or click the box to browse your computer files.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5 text-amber-500">•</span>
              <span><strong>Formatting Matters:</strong> Ensure your PDF contains actual selectable text. Scanned images or poorly formatted documents may result in inaccurate extractions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5 text-amber-500">•</span>
              <span><strong>Heavy Server Load:</strong> AI parsing is an intensive process. If your upload fails or times out, our servers might be experiencing high traffic. Please wait 30 seconds and try again.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5 text-amber-500">•</span>
              <span><strong>Data Safety:</strong> Leaving the page while the spinner is active will interrupt the save process and corrupt your quiz data. Stay on this screen until you see the "Questions Ready" checkmark!</span>
            </li>
          </ul>
        </div>
      )}

    </div>
  );
}