import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

const THRESHOLD_DATA = [
  { name: 'Bread', emoji: '🍞', count: 4 },
  { name: 'Milk', emoji: '🥛', count: 3 },
  { name: 'Butter', emoji: '🧈', count: 2 },
  { name: 'Eggs', emoji: '🥚', count: 1 },
  { name: 'Cheese', emoji: '🧀', count: 1 },
];

export default function HashMapBuilder() {
  const { show } = useToast();
  const [input, setInput] = useState('');
  const [transactions, setTransactions] = useState<string[][]>([]);
  const [freq, setFreq] = useState<Record<string, number>>({});
  const [totalNM, setTotalNM] = useState(0);
  const [threshold, setThreshold] = useState(2);

  const addTransaction = () => {
    const val = input.trim();
    if (!val) return;
    const items = val.split(',').map((x) => x.trim()).filter(Boolean);
    if (!items.length) return;

    setTransactions((prev) => [...prev, items]);
    setTotalNM((t) => t + items.length);
    setFreq((prev) => {
      const next = { ...prev };
      items.forEach((item) => {
        const key = item.toLowerCase().replace(/\s+/g, ' ');
        next[key] = (next[key] || 0) + 1;
      });
      return next;
    });
    setInput('');
  };

  const quickAdd = (txt: string) => {
    setInput(txt);
    setTimeout(() => {
      const items = txt.split(',').map((x) => x.trim()).filter(Boolean);
      if (!items.length) return;
      setTransactions((prev) => [...prev, items]);
      setTotalNM((t) => t + items.length);
      setFreq((prev) => {
        const next = { ...prev };
        items.forEach((item) => {
          const key = item.toLowerCase().replace(/\s+/g, ' ');
          next[key] = (next[key] || 0) + 1;
        });
        return next;
      });
      setInput('');
    }, 10);
  };

  const clearAll = () => {
    setTransactions([]);
    setFreq({});
    setTotalNM(0);
    show('HashMap cleared', 'success');
  };

  const sortedFreq = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const maxVal = sortedFreq.length ? Math.max(...sortedFreq.map(([, v]) => v)) : 1;
  const totalOps = Object.values(freq).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-slate-950 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hash Map Builder */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="inline-block bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold px-4 py-1 rounded-full mb-3 tracking-wider">
            INTERACTIVE DEMO
          </span>
          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight">
            Live <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">Hash Map</span> Builder
          </h1>
          <p className="text-slate-400 mt-2 max-w-lg mx-auto">Type a transaction (comma-separated products) and press Enter. Watch the frequency map build in real-time.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {/* Input Panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900 border border-sky-500/20 rounded-3xl p-7">
            <div className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-4">Enter Transactions</div>
            <div className="flex gap-2.5 mb-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTransaction()}
                placeholder="e.g. Milk, Bread, Butter"
                className="flex-1 bg-slate-950 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl text-sm outline-none focus:border-sky-500 transition-colors"
              />
              <button onClick={addTransaction} className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="text-xs text-slate-500 mb-5">
              Quick add:{' '}
              {['Milk, Bread, Butter', 'Milk, Eggs, Bread', 'Bread, Butter, Cheese', 'Milk, Bread'].map((t) => (
                <button key={t} onClick={() => quickAdd(t)} className="ml-1.5 bg-sky-500/10 border border-slate-700 text-sky-400 px-2.5 py-1 rounded-md text-xs hover:border-sky-500/40 transition-colors">
                  {t.split(',')[0]}...
                </button>
              ))}
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Transactions Added</div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[120px] max-h-[200px] overflow-y-auto font-mono text-xs">
              {transactions.length === 0 ? (
                <div className="text-slate-500 italic">No transactions yet...</div>
              ) : (
                transactions.map((items, i) => (
                  <div key={i} className="py-1 border-b border-slate-800/50 last:border-0">
                    <span className="text-sky-400">TXN{i + 1}</span>
                    <span className="text-slate-600 mx-2">→</span>
                    <span className="text-slate-300">{items.join(', ')}</span>
                  </div>
                ))
              )}
            </div>
            <button onClick={clearAll} className="mt-4 bg-red-500/8 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-red-500/15 transition-colors flex items-center gap-2">
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          </motion.div>

          {/* Frequency Map Panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900 border border-sky-500/20 rounded-3xl p-7">
            <div className="flex items-center justify-between mb-5">
              <div className="text-xs font-bold text-sky-400 uppercase tracking-widest">productFrequency HashMap</div>
              <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold">{totalOps} ops</span>
            </div>
            <div className="min-h-[180px]">
              {sortedFreq.length === 0 ? (
                <div className="text-slate-500 text-center py-10">HashMap is empty. Add transactions above!</div>
              ) : (
                <div className="space-y-2">
                  {sortedFreq.map(([k, v]) => (
                    <motion.div
                      key={k}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 flex items-center gap-3"
                    >
                      <div className="font-mono text-amber-400 text-sm min-w-[80px]">&quot;{k}&quot;</div>
                      <div className="text-xs text-slate-500 mx-1">→</div>
                      <div className="flex-1">
                        <div
                          className="h-9 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 flex items-center px-3 text-white text-xs font-bold transition-all duration-500 min-w-[40px]"
                          style={{ width: `${Math.max((v / maxVal) * 100, 8)}%` }}
                        >
                          {v}x
                        </div>
                      </div>
                      <div className="font-mono text-sm text-sky-400 font-bold min-w-[30px] text-right">{v}</div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Complexity Proof</div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
                <div className="flex justify-between"><span className="text-slate-500">Total items scanned (n x m)</span><span className="text-sky-400 font-bold">{totalNM}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Unique products (k)</span><span className="text-sky-400 font-bold">{Object.keys(freq).length}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Each update: O(?)</span><span className="text-emerald-400 font-bold">O(1)</span></div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Threshold Slider */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="text-center mb-10">
            <span className="inline-block bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold px-4 py-1 rounded-full mb-3 tracking-wider">
              INTERACTIVE
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
              Frequency <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">Threshold</span> Filter
            </h2>
            <p className="text-slate-400 mt-2 max-w-lg mx-auto">Drag the slider to change the minimum frequency threshold. Items qualifying as &quot;frequent&quot; update instantly.</p>
          </div>

          <div className="max-w-3xl mx-auto bg-slate-900 border border-sky-500/20 rounded-3xl p-7">
            <div className="mb-7">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-200">Minimum Frequency Threshold</span>
                <span className="text-2xl font-black text-sky-400 font-mono">{threshold}</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-sky-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>1 (All items)</span><span>2 (Default)</span><span>3</span><span>4</span><span>5 (Very frequent)</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {THRESHOLD_DATA.map((item) => {
                const qualifies = item.count >= threshold;
                return (
                  <motion.div
                    key={item.name}
                    animate={{
                      borderColor: qualifies ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.3)',
                      backgroundColor: qualifies ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.04)',
                      opacity: qualifies ? 1 : 0.6,
                    }}
                    transition={{ duration: 0.35 }}
                    className="rounded-xl px-5 py-3.5 border flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <div className="font-semibold text-sm">{item.name}</div>
                        <div className="text-xs text-slate-500">
                          Bought <strong className="text-slate-200">{item.count}x</strong> — {qualifies ? `qualifies (${item.count} >= ${threshold})` : `excluded (${item.count} < ${threshold})`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`font-mono text-lg font-black ${qualifies ? 'text-emerald-400' : 'text-red-400/70'}`}>{item.count}</div>
                      <span className="text-lg">{qualifies ? '✅' : '❌'}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-5 flex gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-500">Frequent Item (offer candidate)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <span className="text-slate-500">Below threshold (excluded)</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
