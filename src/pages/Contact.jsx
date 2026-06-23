import { Link } from 'react-router-dom';

export default function Contact() {
  return (
    <div className="animate-fade-in pb-12 transition-colors duration-300">
      {/* HERO SECTION */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-3xl p-12 text-center shadow-xl mt-6 mb-16 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Let's Get in Touch
          </h1>
          <p className="text-lg text-blue-100 mb-4 leading-relaxed">
            Found a bug? The AI extracted a question weirdly? Or just want to tell us how much you love the platform? We're all ears.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* DIRECT EMAIL CARD */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 flex flex-col justify-center text-center group">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Email Directly</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 px-4 transition-colors duration-300">
            Skip the fancy forms. Just drop an email and I'll get back to you as soon as I finish fixing the latest bug.
          </p>
          <a 
            href="mailto:ayanmahapatra4@gmail.com" 
            className="inline-block bg-gray-50 dark:bg-gray-700 text-blue-700 dark:text-blue-400 font-bold border border-gray-200 dark:border-gray-600 px-6 py-3 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white transition-all duration-300"
          >
            ayanmahapatra4@gmail.com
          </a>
        </div>

        {/* SUPPORT CARD */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col justify-center text-center">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Need Exam Help?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 px-4 transition-colors duration-300">
            Unfortunately, we can't take your exams for you. For everything else related to QuizEngine, we've got your back.
          </p>
          <Link 
            to="/dashboard" 
            className="inline-block bg-gray-900 dark:bg-gray-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-all duration-300"
          >
            Back to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}