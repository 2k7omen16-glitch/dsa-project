import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ALGORITHM_STEPS } from '@/data/algorithmSteps';

export default function Algorithm() {
  const [activeStep, setActiveStep] = useState(0);

  const selectStep = (i: number) => setActiveStep(i);
  const nextStep = () => { if (activeStep < ALGORITHM_STEPS.length - 1) setActiveStep(activeStep + 1); };
  const prevStep = () => { if (activeStep > 0) setActiveStep(activeStep - 1); };

  const step = ALGORITHM_STEPS[activeStep];

  return (
    <div className="bg-slate-950 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="inline-block bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold px-4 py-1 rounded-full mb-3 tracking-wider">
            ALGORITHM WALKTHROUGH
          </span>
          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight">
            Step-by-Step <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">Execution</span>
          </h1>
          <p className="text-slate-400 mt-2 max-w-lg mx-auto">Click through all 10 steps of the algorithm. See exactly what happens at each stage.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Steps List */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-2.5">
            {ALGORITHM_STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => selectStep(i)}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  i === activeStep
                    ? 'border-sky-500 bg-sky-500/8 shadow-lg shadow-sky-500/10'
                    : i < activeStep
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-slate-800 bg-slate-900 hover:border-sky-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${
                    i === activeStep ? 'bg-sky-500/15 border border-sky-500/30' : i < activeStep ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-slate-800 border border-slate-700'
                  }`}>
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-200">Step {i + 1}: {s.title}</div>
                  </div>
                  <div className={`font-mono text-xs ${
                    i === activeStep ? 'text-sky-400' : i < activeStep ? 'text-emerald-400' : 'text-slate-600'
                  }`}>
                    {i === activeStep ? 'Active' : i < activeStep ? 'Done' : ''}
                  </div>
                </div>
              </button>
            ))}
          </motion.div>

          {/* Step Detail */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-slate-900 border border-sky-500/20 rounded-3xl p-7 min-h-[400px] flex flex-col gap-5"
              >
                <div className="text-5xl">{step.icon}</div>
                <div className="text-xs font-bold text-sky-400 uppercase tracking-widest">Step {activeStep + 1} of {ALGORITHM_STEPS.length}</div>
                <h3 className="text-2xl font-extrabold">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{step.explain}</p>
                <div className="mt-auto">
                  <div className="font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl p-4 leading-7 text-emerald-300 whitespace-pre-wrap overflow-x-auto">
                    {step.code}
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button onClick={prevStep} disabled={activeStep === 0} className="px-4 py-2.5 rounded-xl border border-sky-500/30 text-sky-400 hover:bg-sky-500/8 transition-all text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Prev
                  </button>
                  <button onClick={nextStep} disabled={activeStep === ALGORITHM_STEPS.length - 1} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:opacity-90 transition-all text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2">
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="ml-auto text-sm text-slate-500 font-mono">{activeStep + 1}/{ALGORITHM_STEPS.length}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
