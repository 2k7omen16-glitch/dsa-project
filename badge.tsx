import { CheckCircle, XCircle } from 'lucide-react';
import type { ToastState } from '@/hooks/useToast';

interface ToastProps {
  toast: ToastState;
}

export default function Toast({ toast }: ToastProps) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-xl border border-sky-500/20 bg-slate-900/95 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
        toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      {toast.type === 'success' ? (
        <CheckCircle className="w-5 h-5 text-emerald-400" />
      ) : (
        <XCircle className="w-5 h-5 text-red-400" />
      )}
      <span className="text-sm font-medium text-slate-100">{toast.message}</span>
    </div>
  );
}
