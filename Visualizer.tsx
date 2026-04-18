import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Code, ChevronDown, Database, Cpu, BarChart3, Gift, ShoppingBasket } from 'lucide-react';
import ParticleCanvas from '@/components/ParticleCanvas';



const archLayers = [
  {
    icon: <Database className="w-6 h-6" />,
    color: 'sky',
    title: 'Layer 1 — Data Layer',
    desc: 'Customer records stored in Hash Table (keyed on CustomerID) + Product Catalog in Hash Map for O(1) price/name lookup',
    badge: 'O(1) lookup',
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    color: 'emerald',
    title: 'Layer 2 — Processing Layer',
    desc: "Retrieve customer's transaction list from Hash Table → Traverse each transaction's Array → Populate productFrequency HashMap",
    badge: 'O(n×m)',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'amber',
    title: 'Layer 3 — Analysis Layer',
    desc: 'Apply threshold filter → Sort frequent items by count (O(k log k)) → Run Market Basket pair detection',
    badge: 'O(k log k)',
  },
  {
    icon: <Gift className="w-6 h-6" />,
    color: 'violet',
    title: 'Layer 4 — Output Layer',
    desc: 'Generate personalized discount / combo offer from top frequent item or best pair → Format + Log → Deliver to customer',
    badge: 'O(1)',
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; badgeBg: string; badgeText: string }> = {
  sky: { border: 'border-sky-500/40', bg: 'bg-sky-500/15', text: 'text-sky-500', badgeBg: 'bg-sky-500/8', badgeText: 'text-sky-500' },
  emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/15', text: 'text-emerald-500', badgeBg: 'bg-emerald-500/8', badgeText: 'text-emerald-500' },
  amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/15', text: 'text-amber-500', badgeBg: 'bg-amber-500/8', badgeText: 'text-amber-500' },
  violet: { border: 'border-violet-500/30', bg: 'bg-violet-500/15', text: 'text-violet-400', badgeBg: 'bg-violet-500/8', badgeText: 'text-violet-400' },
};

const sdgCards = [
  {
    num: 'SDG 8',
    title: 'Decent Work & Economic Growth',
    emoji: '💼',
    color: 'amber',
    text: 'Enables small and medium retail businesses to adopt data-driven personalization without expensive ML infrastructure, levelling the playing field between local stores and large e-commerce corporations.',
    tag: '📈 Increases customer retention → supports grassroots economic growth',
  },
  {
    num: 'SDG 9',
    title: 'Industry, Innovation & Infrastructure',
    emoji: '🏗️',
    color: 'sky',
    text: 'Demonstrates how algorithmic innovation at the student level can generate real economic and social impact. Efficient DSA-based systems require no GPU hardware or large training datasets — accessible at any scale.',
    tag: '🔬 Innovation through code — no infrastructure required',
  },
  {
    num: 'SDG 12',
    title: 'Responsible Consumption & Production',
    emoji: '♻️',
    color: 'emerald',
    text: 'Encourages responsible consumption by matching offers to actual buying behavior rather than promoting random or impulse purchases. Reduces marketing waste by sending targeted promotions only to receptive customers.',
    tag: '🛒 Right offer → right person → less waste',
  },
];

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950">
        <ParticleCanvas />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-[900px] mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, duration: 0.7, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 bg-sky-500/8 border border-sky-500/30 px-4 py-1.5 rounded-full mb-7"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold text-sky-400">
              DSA-I PBL · NIET · 2025 · Ashutosh Singh
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6"
          >
            Personalized Offer
            <br />
            <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
              Generation System
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
            className="text-lg text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed"
          >
            Advanced retail intelligence using{' '}
            <strong className="text-slate-100">Hash Tables, Hash Maps & Sorting</strong>.
            Zero ML. Pure DSA. Maximum efficiency.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
            className="flex gap-4 justify-center flex-wrap mb-16"
          >
            <Link
              to="/pos"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:opacity-90 transition-all hover:-translate-y-0.5 shadow-lg shadow-sky-500/25"
            >
              <Play className="w-4 h-4" /> Launch POS Demo
            </Link>
            <Link
              to="/algorithm"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border border-sky-500/40 text-sky-400 hover:bg-sky-500/8 transition-all"
            >
              <Code className="w-4 h-4" /> Algorithm Walkthrough
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
            className="grid grid-cols-3 gap-4 max-w-xl mx-auto"
          >
            {[
              { val: 'O(1)', label: 'Hash Table Lookup', color: 'text-sky-400' },
              { val: 'O(n×m)', label: 'Linear Processing', color: 'text-emerald-400' },
              { val: '0', label: 'ML Dependencies', color: 'text-amber-400' },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-slate-900/80 border border-sky-500/20 rounded-2xl p-5 text-center backdrop-blur-xl"
              >
                <div className={`text-2xl lg:text-3xl font-black ${s.color} font-mono`}>{s.val}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ARCHITECTURE FLOW */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span className="inline-block bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold px-4 py-1 rounded-full mb-3 tracking-wider">
              SYSTEM DESIGN
            </span>
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight">
              System <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">Architecture</span>
            </h2>
            <p className="text-slate-400 mt-3 max-w-lg mx-auto">
              4-layer pipeline: from raw customer ID to personalized offer output.
            </p>
          </motion.div>

          <div className="flex flex-col gap-1">
            {archLayers.map((layer, i) => {
              const c = colorMap[layer.color];
              return (
                <div key={i}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className={`bg-slate-900 border ${c.border} rounded-2xl p-5 transition-all hover:shadow-lg hover:shadow-sky-500/10`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 ${c.bg} border ${c.border} rounded-xl flex items-center justify-center flex-shrink-0 ${c.text}`}>
                        {layer.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-extrabold text-base ${c.text}`}>{layer.title}</div>
                        <div className="text-sm text-slate-400 mt-1" dangerouslySetInnerHTML={{ __html: layer.desc.replace(/Hash Table/g, '<strong class="text-slate-100">Hash Table</strong>').replace(/Array/g, '<strong class="text-slate-100">Array</strong>').replace(/productFrequency HashMap/g, '<strong class="text-slate-100">productFrequency HashMap</strong>').replace(/Sort/g, '<strong class="text-slate-100">Sort</strong>').replace(/Market Basket pair detection/g, '<strong class="text-slate-100">Market Basket pair detection</strong>').replace(/discount \/ combo offer/g, '<strong class="text-slate-100">discount / combo offer</strong>') }} />
                      </div>
                      <div className={`hidden sm:block font-mono text-xs ${c.badgeText} ${c.badgeBg} border ${c.border} px-2.5 py-1 rounded-md whitespace-nowrap`}>
                        {layer.badge}
                      </div>
                    </div>
                  </motion.div>
                  {i < archLayers.length - 1 && (
                    <div className="flex justify-center my-2 text-sky-500 text-xl animate-bounce">
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SDG SECTION */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span className="inline-block bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold px-4 py-1 rounded-full mb-3 tracking-wider">
              UN SDG ALIGNMENT
            </span>
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight">
              Sustainable <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">Development</span> Goals
            </h2>
            <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
              This project aligns with three United Nations Sustainable Development Goals, enabling small retailers to compete without expensive infrastructure.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {sdgCards.map((sdg, i) => {
              const c = colorMap[sdg.color];
              return (
                <motion.div
                  key={sdg.num}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7 }}
                  className={`bg-slate-900 border ${c.border} rounded-2xl p-7 transition-all hover:-translate-y-1`}
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-14 h-14 ${c.bg} border-2 ${c.border} rounded-xl flex items-center justify-center text-3xl`}>
                      {sdg.emoji}
                    </div>
                    <div>
                      <div className={`text-4xl font-black ${c.text}`}>{sdg.num}</div>
                      <div className="text-xs text-slate-500">{sdg.title}</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{sdg.text}</p>
                  <div className={`mt-4 ${c.badgeBg} border ${c.border} rounded-xl px-4 py-2.5 text-xs ${c.text}`}>
                    {sdg.tag}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-5 text-center">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
              <ShoppingBasket className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg">
              FreshMart<span className="text-sky-500">POS</span>
            </span>
          </div>
          <div className="text-sm text-slate-400 leading-7">
            <strong className="text-slate-100">Ashutosh Singh</strong> · Roll No: 0251CSML242 · AIML B · Semester II
            <br />
            Noida Institute of Engineering & Technology (NIET), Greater Noida
            <br />
            <span className="text-sky-400">Personalized Offer Generation from Purchase Patterns</span>
          </div>
          <div className="mt-6 text-xs text-slate-600">
            Built with React · Tailwind CSS · Framer Motion · No ML Required
          </div>
        </div>
      </footer>
    </div>
  );
}
