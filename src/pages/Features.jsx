import { Link } from 'react-router-dom';

export default function Features() {
  const features = [
    {
      title: "PDF to Magic in Seconds",
      description: "Upload your boring, static PDFs. Our highly-caffeinated AI instantly extracts questions, options, and answers. No manual typing required.",
      icon: (
        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
      ),
      color: "bg-blue-50 dark:bg-blue-900/30"
    },
    {
      title: "The 'Real Deal' Simulator",
      description: "Practice like it's game day. Mark for review, skip questions, and stare at a panic-inducing timer—exactly like the actual banking exams.",
      icon: (
        <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      ),
      color: "bg-indigo-50 dark:bg-indigo-900/30"
    },
    {
      title: "Ruthless Analytics",
      description: "Find out exactly which quantitative question robbed you of 45 seconds. Get granular insights to ruthlessly eliminate your weak spots.",
      icon: (
        <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
      ),
      color: "bg-emerald-50 dark:bg-emerald-900/30"
    },
    {
      title: "Your Digital Vault",
      description: "Keep all your past attempts and un-taken tests neatly organized in one dashboard. It's way better than that overflowing 'New Folder (3)' on your desktop.",
      icon: (
        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
      ),
      color: "bg-purple-50 dark:bg-purple-900/30"
    }
  ];

  return (
    <div className="animate-fade-in pb-12 transition-colors duration-300">
      {/* HERO SECTION */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-3xl p-12 text-center shadow-xl mt-6 mb-16 relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="absolute -top-24 -left-24 w-96 h-96 text-white animate-spin-slow" fill="currentColor" viewBox="0 0 100 100"><path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 80c-16.6 0-30-13.4-30-30s13.4-30 30-30 30 13.4 30 30-13.4 30-30 30z"/></svg>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Study Smarter, Not Harder.<br/><span className="text-blue-300">We Handle The Hard Part.</span>
          </h1>
          <p className="text-lg text-blue-100 mb-8 leading-relaxed">
            Stop grading your own mock tests with a pencil and a prayer. QuizEngine transforms your PDFs into a hyper-intelligent, analytics-driven exam platform designed to get you hired.
          </p>
          <Link 
            to="/upload" 
            className="inline-block bg-white text-blue-700 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-blue-50 hover:scale-105 transition-all duration-200"
          >
            Upload a PDF Now
          </Link>
        </div>
      </div>

      {/* FEATURES GRID */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300 mb-4">Why use QuizEngine?</h2>
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300 max-w-2xl mx-auto">Because crying over unsolved data interpretation PDFs is so 2023. Here is what our platform actually does for you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-500 transition-all duration-300 group"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-300 mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div className="max-w-4xl mx-auto mt-20 text-center bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Convinced yet?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">Stop reading this page and go take a mock test. Your competitors are already studying.</p>
        <Link 
          to="/dashboard" 
          className="bg-gray-900 dark:bg-gray-700 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors shadow-md"
        >
          Take Me to My Dashboard →
        </Link>
      </div>
    </div>
  );
}