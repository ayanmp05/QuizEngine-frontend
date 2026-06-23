import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <div className="animate-fade-in pb-12 transition-colors duration-300">
      {/* HERO SECTION */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-3xl p-12 text-center shadow-xl mt-6 mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Simple, Transparent Pricing.
        </h1>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
          We thought about charging you a ridiculous monthly subscription fee, but then we remembered you're busy studying for exams and probably need that money for coffee.
        </p>
      </div>

      {/* PRICING CARD */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border-2 border-blue-100 dark:border-gray-700 overflow-hidden relative transform hover:scale-[1.02] transition-all duration-300">
          
          {/* Badge */}
          <div className="absolute top-0 right-0 bg-blue-600 dark:bg-blue-500 text-white font-bold px-4 py-1 rounded-bl-xl text-sm shadow-sm">
            Best Value (Obviously)
          </div>

          <div className="p-10 md:p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-300">The "Pass Your Exams" Tier</h2>
            
            <div className="flex justify-center items-center gap-4 my-6">
              <span className="text-3xl text-gray-400 dark:text-gray-500 line-through font-medium transition-colors duration-300">$99/mo</span>
              <span className="text-6xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300">$0</span>
              <span className="text-xl text-gray-500 dark:text-gray-400 font-medium self-end mb-2 transition-colors duration-300">/ forever</span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto text-lg italic transition-colors duration-300">
              "Wait, it's actually free?" — Yes. Yes it is.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-8 text-left inline-block w-full max-w-md transition-colors duration-300">
              <ul className="space-y-4">
                {[
                  'Unlimited PDF Uploads',
                  'Ruthless AI Question Extraction',
                  'Panic-Inducing Exam Timers',
                  'Granular Performance Analytics',
                  'Zero hidden fees, zero paywalls'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Link 
              to="/dashboard" 
              className="block w-full max-w-md mx-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl shadow-md transition-colors text-lg"
            >
              Start Practicing Now
            </Link>
            <p className="mt-4 text-sm text-gray-400 dark:text-gray-500 transition-colors duration-300">Seriously, go study. Your competitors are already on question 14.</p>
          </div>
        </div>
      </div>
    </div>
  );
}