import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, ShoppingBasket, Menu, X } from 'lucide-react';
import ScrollProgress from './ScrollProgress';
import Toast from './Toast';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useToast } from '@/hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/pos', label: 'POS Demo' },
  { to: '/algorithm', label: 'Algorithm' },
  { to: '/hashmap', label: 'Hash Map' },
  { to: '/visualizer', label: 'Visualizer' },
  { to: '/complexity', label: 'Complexity' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { dark, toggle } = useDarkMode();
  const { toast } = useToast();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <ScrollProgress />

      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-sky-500/10 backdrop-blur-xl bg-slate-950/85 dark:bg-slate-950/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
                <ShoppingBasket className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-lg">
                FreshMart<span className="text-sky-500">POS</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.to
                      ? 'text-sky-400 bg-sky-500/10'
                      : 'text-slate-400 hover:text-sky-400 hover:bg-sky-500/8'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggle}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                title="Toggle dark mode"
              >
                {dark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg border border-sky-500/20 hover:bg-slate-800 transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 bg-slate-950/97 backdrop-blur-xl flex flex-col pt-20 px-8 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`text-xl font-bold py-4 border-b border-slate-800 transition-colors ${
                  location.pathname === link.to ? 'text-sky-400' : 'text-slate-400 hover:text-sky-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-16">{children}</main>

      {/* Toast */}
      <Toast toast={toast} />
    </div>
  );
}

export { useToast };
