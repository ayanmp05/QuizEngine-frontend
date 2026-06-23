import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AnalyticsDashboard({ results, onReset }) {
  const correctCount = results.filter(r => r.isCorrect).length;
  const accuracyPercent = ((correctCount / results.length) * 100).toFixed(0);

  const totalTime = results.reduce((sum, r) => sum + r.timeTaken, 0);
  const avgTime = (totalTime / results.length).toFixed(1);

  // Parse chart schema coordinates smoothly
  const chartData = results.map((res, index) => ({
    name: `Q${index + 1}`,
    seconds: res.timeTaken,
    isCorrect: res.isCorrect,
  }));

  return (
    <div className="space-y-8">
      {/* Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Overall Score</h3>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">{correctCount} / {results.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Accuracy Rate</h3>
          <p className={`text-4xl font-extrabold mt-2 ${Number(accuracyPercent) >= 70 ? 'text-green-600' : 'text-amber-600'}`}>
            {accuracyPercent}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Average Speed</h3>
          <p className="text-4xl font-extrabold text-blue-600 mt-2">{avgTime}s</p>
        </div>
      </div>

      {/* Visual Chart Graphic Representation Layer */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-base font-bold text-gray-800 mb-6">Time Expenditure per Question (Seconds)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" h="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: '#f3f4f6' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl text-xs">
                        <p className="font-bold mb-1">{data.name}</p>
                        <p>Time Spent: <span className="font-semibold text-yellow-400">{data.seconds}s</span></p>
                        <p>Outcome: <span className={`font-semibold ${data.isCorrect ? 'text-green-400' : 'text-red-400'}`}>{data.isCorrect ? 'Correct' : 'Incorrect'}</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="seconds" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isCorrect ? '#22c55e' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span>Correct Response Time</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span>Incorrect Response Time</span>
          </div>
        </div>
      </div>

      {/* Granular Audit Logs Layout */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800">Question Audit Trail</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {results.map((item, idx) => (
            <div key={idx} className="p-6 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h4 className="font-semibold text-gray-800 text-sm">Q{idx + 1}: {item.questionText}</h4>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${item.isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                  {item.timeTaken}s
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your Answer: <span className={`font-semibold ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>{item.chosen}</span>
                {!item.isCorrect && <> | Correct Answer: <span className="font-semibold text-green-600">{item.correct}</span></>}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-md"
        >
          Upload New Test PDF
        </button>
      </div>
    </div>
  );
}