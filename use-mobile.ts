import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, FastForward, Hash, SortDesc, Network } from 'lucide-react';
import { CUSTOMERS } from '@/data/customers';
import { PRODUCTS } from '@/data/products';
import NetworkGraph from '@/components/NetworkGraph';

export default function Visualizer() {
  const [customerId, setCustomerId] = useState('C101');
  const [sortData, setSortData] = useState<[string, number][]>([]);
  const [sortAnimating, setSortAnimating] = useState(false);
  const sortTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const customer = customerId ? CUSTOMERS[customerId] : null;

  // Generate sort data from customer
  useEffect(() => {
    if (customer) {
      const f: Record<string, number> = {};
      customer.history.forEach((t) => t.items.forEach((i) => { f[i] = (f[i] || 0) + 1; }));
      const frequent = Object.entries(f).filter(([, v]) => v >= 2).sort((a, b) => b[1] - a[1]);
      setSortData(frequent);
    }
  }, [customerId]);

  // Hash table viz
  const hashValue = customerId.split('').reduce((a, b) => a + b.charCodeAt(0), 0) % 10;

  // Sorting animation
  const animateSorting = useCallback((speed: 'fast' | 'slow') => {
    if (!sortData.length) return;
    setSortAnimating(true);
    if (sortTimerRef.current) clearTimeout(sortTimerRef.current);
    sortTimerRef.current = setTimeout(() => setSortAnimating(false), speed === 'slow' ? 2000 : 500);
  }, [sortData]);

  useEffect(() => {
    return () => { if (sortTimerRef.current) clearTimeout(sortTimerRef.current); };
  }, []);

  const maxCount = sortData.length ? sortData[0][1] : 1;

  return (
    <div className="bg-slate-950 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-block bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold px-4 py-1 rounded-full mb-3 tracking-wider">
            VISUALIZER
          </span>
          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight">
            Algorithm <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">Visualizer</span>
          </h1>
          <p className="text-slate-400 mt-2 max-w-lg mx-auto">Real-time visualization of Hash Table lookup, sorting, and Market Basket network.</p>
        </motion.div>

        {/* Customer Selector */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="max-w-xs mx-auto mb-8">
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-sky-500 outline-none"
          >
            <option value="C101">C101 — Mohit Pathak</option>
            <option value="C102">C102 — Lakshita Mandela</option>
            <option value="C103">C103 — Chirag Poswal</option>
          </select>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Hash Table Viz */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900 border border-sky-500/20 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 font-bold text-base">
                <Hash className="w-5 h-5 text-sky-400" />
                Hash Table Lookup
              </div>
              <span className="text-xs bg-sky-500/10 text-sky-400 border border-sky-500/20 px-3 py-1 rounded-full font-bold">O(1) Average</span>
            </div>
            <div className="bg-slate-950 rounded-xl p-4 min-h-[260px] font-mono text-xs space-y-1">
              {Array.from({ length: 10 }, (_, i) => {
                const isTarget = i === hashValue;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      isTarget ? 'bg-sky-500/10 border border-sky-500/40' : 'bg-white/[0.02] border border-transparent'
                    }`}
                  >
                    <span className="text-slate-500 w-7 text-right">[{i}]</span>
                    <span className={isTarget ? 'text-sky-400 font-bold' : 'text-slate-600'}>
                      {isTarget ? `→ ${customerId} | hash: ${hashValue} ✓` : 'null'}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Sorting Viz */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900 border border-sky-500/20 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 font-bold text-base">
                <SortDesc className="w-5 h-5 text-emerald-400" />
                Frequency Sort
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">O(k log k)</span>
            </div>
            <div className="h-[180px] flex items-end justify-center gap-4 bg-slate-950 rounded-xl p-4 mb-4">
              {sortData.length === 0 ? (
                <div className="text-slate-500 text-sm self-center">Select a customer to view sorting...</div>
              ) : (
                sortData.map(([id, count], i) => {
                  const p = PRODUCTS.find((x) => x.id === id);
                  const h = Math.max((count / maxCount) * 130, 20);
                  return (
                    <motion.div
                      key={id}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: sortAnimating ? h : h,
                        opacity: 1,
                        scale: sortAnimating ? [1, 1.05, 1] : 1,
                      }}
                      transition={{
                        height: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
                        opacity: { delay: i * 0.08, duration: 0.3 },
                        scale: { delay: i * 0.08, duration: 0.5 },
                      }}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div className="text-xl">{p?.emoji}</div>
                      <motion.div
                        className="w-9 bg-gradient-to-t from-sky-500 to-emerald-400 rounded-t-md shadow-lg transition-all"
                        style={{ height: h }}
                      />
                      <div className="font-mono text-xs text-slate-500 font-bold">{count}</div>
                    </motion.div>
                  );
                })
              )}
            </div>
            <div className="flex gap-2.5 justify-center">
              <button onClick={() => animateSorting('fast')} className="px-4 py-2 rounded-xl border border-sky-500/30 text-sky-400 hover:bg-sky-500/8 transition-all text-sm font-semibold flex items-center gap-2">
                <Play className="w-4 h-4" /> Replay
              </button>
              <button onClick={() => animateSorting('slow')} className="px-4 py-2 rounded-xl border border-sky-500/30 text-sky-400 hover:bg-sky-500/8 transition-all text-sm font-semibold flex items-center gap-2">
                <FastForward className="w-4 h-4" /> Slow-Mo
              </button>
            </div>
          </motion.div>
        </div>

        {/* Market Basket Network */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-900 border border-sky-500/20 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 font-bold text-base">
              <Network className="w-5 h-5 text-amber-400" />
              Market Basket Association Network
            </div>
            <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-bold">O(n×m²) Pairs</span>
          </div>
          <NetworkGraph customer={customer} />
        </motion.div>
      </div>
    </div>
  );
}
