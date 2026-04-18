import { useEffect, useRef } from 'react';
import type { Customer } from '@/data/customers';
import { PRODUCTS } from '@/data/products';

interface NetworkGraphProps {
  customer: Customer | null;
}

function getPairs(history: { items: string[] }[]) {
  const pairs: Record<string, number> = {};
  history.forEach((t) => {
    for (let i = 0; i < t.items.length; i++) {
      for (let j = i + 1; j < t.items.length; j++) {
        const k = [t.items[i], t.items[j]].sort().join('+');
        pairs[k] = (pairs[k] || 0) + 1;
      }
    }
  });
  return pairs;
}

export default function NetworkGraph({ customer }: NetworkGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!customer || !customer.history.length) {
      ctx.fillStyle = 'rgba(148,163,184,.5)';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Select a customer in POS demo to view graph', canvas.width / 2, canvas.height / 2);
      return;
    }

    const pairs = getPairs(customer.history);
    const nodes = [...new Set(customer.history.flatMap((h) => h.items))];
    const edges = Object.entries(pairs).filter(([, v]) => v >= 1);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = Math.min(cx, cy) - 52;
    const pos: Record<string, { x: number; y: number }> = {};

    nodes.forEach((n, i) => {
      const a = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
      pos[n] = { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    });

    // edges
    edges.forEach(([k, w]) => {
      const [n1, n2] = k.split('+');
      if (!pos[n1] || !pos[n2]) return;
      ctx.beginPath();
      ctx.moveTo(pos[n1].x, pos[n1].y);
      ctx.lineTo(pos[n2].x, pos[n2].y);
      ctx.strokeStyle = `rgba(14,165,233,${0.15 + w * 0.12})`;
      ctx.lineWidth = w * 1.8;
      ctx.stroke();
      // weight label
      const mx = (pos[n1].x + pos[n2].x) / 2;
      const my = (pos[n1].y + pos[n2].y) / 2;
      ctx.font = 'bold 11px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(14,165,233,.8)';
      ctx.textAlign = 'center';
      ctx.fillText(w + 'x', mx, my);
    });

    // nodes
    nodes.forEach((n) => {
      const p2 = PRODUCTS.find((x) => x.id === n);
      const { x, y } = pos[n];
      ctx.beginPath();
      ctx.arc(x, y, 26, 0, 2 * Math.PI);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.font = '22px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(p2?.emoji || '?', x, y);
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = 'rgba(148,163,184,.9)';
      ctx.textBaseline = 'top';
      ctx.fillText(p2?.name || n, x, y + 32);
    });
  }, [customer]);

  const pairs = customer ? getPairs(customer.history) : {};
  const nodes = customer ? [...new Set(customer.history.flatMap((h) => h.items))] : [];
  const edges = Object.entries(pairs).filter(([, v]) => v >= 1);
  const density = nodes.length > 1 ? ((2 * edges.length) / (nodes.length * (nodes.length - 1)) * 100).toFixed(0) : 0;

  return (
    <div>
      <div ref={containerRef} className="h-[280px] bg-slate-950 rounded-xl relative overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-center">
          <div className="text-2xl font-extrabold text-sky-500">{nodes.length}</div>
          <div className="text-xs text-slate-500 mt-1">Products</div>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-center">
          <div className="text-2xl font-extrabold text-emerald-500">{edges.length}</div>
          <div className="text-xs text-slate-500 mt-1">Associations</div>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-center">
          <div className="text-2xl font-extrabold text-amber-500">{density}%</div>
          <div className="text-xs text-slate-500 mt-1">Network Density</div>
        </div>
      </div>
    </div>
  );
}
