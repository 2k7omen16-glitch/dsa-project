import { useScrollProgress } from '@/hooks/useScrollProgress';

export default function ScrollProgress() {
  const progress = useScrollProgress();
  return (
    <div
      className="fixed top-0 left-0 h-[3px] z-[100] transition-all duration-200"
      style={{
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #0ea5e9, #10b981, #f59e0b)',
      }}
    />
  );
}
