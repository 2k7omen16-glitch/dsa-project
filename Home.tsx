import { motion } from 'framer-motion';
import { CheckCircle, XCircle, MinusCircle, Server } from 'lucide-react';

const bigOCards = [
  { val: 'O(1)', label: 'Hash Lookup', desc: 'Constant time retrieval', color: 'text-sky-400', delay: 0 },
  { val: 'O(n×m)', label: 'Processing', desc: 'Linear scan all transactions', color: 'text-emerald-400', delay: 0.1 },
  { val: 'O(k log k)', label: 'Sorting', desc: 'Rank by frequency', color: 'text-amber-400', delay: 0.2 },
  { val: 'O(k)', label: 'Space', desc: 'Active query memory', color: 'text-violet-400', delay: 0.3 },
];

const comparisonRows = [
  {
    approach: 'This DSA System',
    highlight: true,
    time: 'O(n×m)',
    timeColor: 'text-emerald-400',
    ml: 'No',
    mlColor: 'bg-red-500/15 text-red-400',
    memory: 'Low — O(k)',
    scale: 'High',
    scaleIcon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  },
  {
    approach: 'Naive Nested Loops',
    highlight: false,
    time: 'O(N×n²×m)',
    timeColor: 'text-red-400',
    ml: 'No',
    mlColor: 'bg-red-500/15 text-red-400',
    memory: 'Low',
    scale: 'Very Low',
    scaleIcon: <XCircle className="w-4 h-5 text-red-500" />,
  },
  {
    approach: 'Collaborative Filtering',
    highlight: false,
    time: 'O(N²)',
    timeColor: 'text-amber-400',
    ml: 'Yes',
    mlColor: 'bg-emerald-500/15 text-emerald-400',
    memory: 'High',
    scale: 'Medium',
    scaleIcon: <MinusCircle className="w-4 h-4 text-amber-500" />,
  },
  {
    approach: 'Deep Learning',
    highlight: false,
    time: 'Very High',
    timeColor: 'text-red-400',
    ml: 'Yes',
    mlColor: 'bg-emerald-500/15 text-emerald-400',
    memory: 'Very High (GPU)',
    scale: 'Needs Infra',
    scaleIcon: <Server className="w-4 h-4 text-slate-500" />,
  },
];

export default function Complexity() {
  return (
    <div className="bg-slate-950 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="inline-block bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold px-4 py-1 rounded-full mb-3 tracking-wider">
            COMPLEXITY
          </span>
          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight">
            Algorithm <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">Analysis</span>
          </h1>
          <p className="text-slate-400 mt-2 max-w-lg mx-auto">Time and space complexity breakdown with comparative analysis.</p>
        </motion.div>

        {/* Big-O Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {bigOCards.map((card) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: card.delay, duration: 0.6 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-7 text-center hover:border-sky-500/30 hover:-translate-y-1 transition-all"
            >
              <div className={`text-4xl lg:text-5xl font-black ${card.color} font-mono mb-2`}>{card.val}</div>
              <div className="font-bold mb-1">{card.label}</div>
              <div className="text-xs text-slate-500">{card.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="font-bold text-lg">Approach Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-sky-500/5 text-xs uppercase text-slate-500">
                  <th className="p-4 font-semibold">Approach</th>
                  <th className="p-4 font-semibold">Time Complexity</th>
                  <th className="p-4 font-semibold">Requires ML?</th>
                  <th className="p-4 font-semibold">Memory</th>
                  <th className="p-4 font-semibold">Scalability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {comparisonRows.map((row) => (
                  <tr
                    key={row.approach}
                    className={`${row.highlight ? 'bg-sky-500/5 border-l-[3px] border-l-sky-500' : 'hover:bg-sky-500/[0.02]'}`}
                  >
                    <td className="p-4">
                      <span className={row.highlight ? 'font-bold text-sky-400' : ''}>
                        {row.highlight && '✅ '}{row.approach}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold"><span className={row.timeColor}>{row.time}</span></td>
                    <td className="p-4"><span className={`px-2.5 py-1 rounded-md text-xs font-bold ${row.mlColor}`}>{row.ml}</span></td>
                    <td className="p-4 text-sm">{row.memory}</td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-2">
                        {row.scaleIcon}
                        {row.scale}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
