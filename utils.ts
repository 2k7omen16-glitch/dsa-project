import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trash2, Pause, Undo2, Printer, Minus, Plus, X,
  CreditCard, Banknote, Smartphone,
} from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { CUSTOMERS, SEGMENT_STYLES } from '@/data/customers';
import type { Offer } from '@/data/customers';
import { useToast } from '@/hooks/useToast';

interface BillItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  qty: number;
}

function getFrequency(history: { items: string[] }[]) {
  const f: Record<string, number> = {};
  history.forEach((t) => t.items.forEach((i) => { f[i] = (f[i] || 0) + 1; }));
  return f;
}

function getPairs(history: { items: string[] }[]) {
  const p: Record<string, number> = {};
  history.forEach((t) => {
    for (let i = 0; i < t.items.length; i++) {
      for (let j = i + 1; j < t.items.length; j++) {
        const k = [t.items[i], t.items[j]].sort().join('+');
        p[k] = (p[k] || 0) + 1;
      }
    }
  });
  return p;
}

export default function POSDemo() {
  const { show } = useToast();
  const [customerId, setCustomerId] = useState('');
  const [bill, setBill] = useState<BillItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [payment, setPayment] = useState('Cash');
  const [showReceipt, setShowReceipt] = useState(false);
  const [opHash, setOpHash] = useState(0);
  const [opMap, setOpMap] = useState(0);
  const [opSort, setOpSort] = useState(0);

  const customer = customerId ? CUSTOMERS[customerId] : null;

  const handleCustomerChange = (id: string) => {
    setCustomerId(id);
    if (!id) {
      setOffers([]);
      setOpHash(0); setOpMap(0); setOpSort(0);
      return;
    }
    const c = CUSTOMERS[id];
    generateOffers(c);
    show(`Customer ${c.name} loaded`, 'success');
  };

  const generateOffers = (c: typeof CUSTOMERS[keyof typeof CUSTOMERS]) => {
    const newOffers: Offer[] = [];
    const freq = getFrequency(c.history);
    const pairs = getPairs(c.history);

    setOpHash(1);
    setOpMap(Object.values(freq).reduce((a, b) => a + b, 0));

    const frequent = Object.entries(freq).filter(([, v]) => v >= 2).sort((a, b) => b[1] - a[1]);
    const topPairs = Object.entries(pairs).filter(([, v]) => v >= 2).sort((a, b) => b[1] - a[1]);

    setOpSort(Math.ceil(frequent.length * Math.log2(Math.max(frequent.length, 1))));

    if (frequent.length) {
      const [pid, count] = frequent[0];
      const p = PRODUCTS.find((x) => x.id === pid);
      if (p) {
        newOffers.push({ type: 'freq', id: `freq_${pid}`, label: `${p.emoji} ${p.name} Deal`, desc: `10% off — bought ${count}x by you`, discount: 10, target: pid, applied: true });
      }
    }
    if (topPairs.length) {
      const [pairKey, cnt] = topPairs[0];
      const [id1, id2] = pairKey.split('+');
      const p1 = PRODUCTS.find((x) => x.id === id1);
      const p2 = PRODUCTS.find((x) => x.id === id2);
      if (p1 && p2) {
        newOffers.push({ type: 'combo', id: `combo_${pairKey}`, label: `Combo: ${p1.emoji}+${p2.emoji}`, desc: `15% off — bought together ${cnt}x by you`, discount: 15, combo: [id1, id2], applied: true });
      }
    }
    if (c.segment === 'Premium') {
      newOffers.push({ type: 'loyalty', id: 'loyalty', label: 'Premium Bonus', desc: '20 off on bill >= 300', discount: 20, flat: true, min: 300, applied: false });
    }
    if (c.segment === 'New') {
      newOffers.push({ type: 'welcome', id: 'welcome', label: 'Welcome Offer', desc: '5% off your first purchase', discount: 5, applied: true });
    }
    setOffers(newOffers);
  };

  const addToBill = (productId: string) => {
    const p = PRODUCTS.find((x) => x.id === productId);
    if (!p) return;
    setBill((prev) => {
      const ex = prev.find((x) => x.id === productId);
      if (ex) {
        return prev.map((x) => x.id === productId ? { ...x, qty: x.qty + 1 } : x);
      }
      return [...prev, { id: p.id, name: p.name, emoji: p.emoji, price: p.price, qty: 1 }];
    });
  };

  const updateQty = (idx: number, delta: number) => {
    setBill((prev) => {
      const copy = [...prev];
      copy[idx].qty += delta;
      if (copy[idx].qty <= 0) copy.splice(idx, 1);
      return copy;
    });
  };

  const removeItem = (idx: number) => {
    setBill((prev) => prev.filter((_, i) => i !== idx));
  };

  const clearBill = () => { setBill([]); show('Bill cleared', 'success'); };
  const cancelLast = () => { setBill((prev) => prev.slice(0, -1)); };
  const holdBill = () => show('Bill held for later', 'success');

  const subtotal = bill.reduce((s, i) => s + i.price * i.qty, 0);
  let discount = 0;
  offers.filter((o) => o.applied).forEach((o) => {
    if (o.type === 'freq' && o.target) {
      const it = bill.find((x) => x.id === o.target);
      if (it) discount += it.price * it.qty * (o.discount / 100);
    } else if (o.type === 'combo' && o.combo) {
      const hasBoth = o.combo.every((id) => bill.some((x) => x.id === id));
      if (hasBoth) {
        const ct = o.combo.reduce((s, id) => {
          const it = bill.find((x) => x.id === id);
          return s + (it ? it.price * it.qty : 0);
        }, 0);
        discount += ct * (o.discount / 100);
      }
    } else if (o.type === 'loyalty' && o.flat && subtotal >= (o.min || 0)) {
      discount += o.discount;
    } else if (o.type === 'welcome') {
      discount += subtotal * (o.discount / 100);
    }
  });
  const taxable = Math.max(0, subtotal - discount);
  const gst = taxable * 0.05;
  const total = taxable + gst;

  const toggleOffer = (id: string) => {
    setOffers((prev) => prev.map((o) => o.id === id ? { ...o, applied: !o.applied } : o));
  };

  const frequentItems = customer
    ? Object.entries(getFrequency(customer.history)).sort((a, b) => b[1] - a[1]).slice(0, 6)
    : [];

  return (
    <div className="bg-slate-900 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-block bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold px-4 py-1 rounded-full mb-3 tracking-wider">
            LIVE DEMO
          </span>
          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight">Smart POS System</h1>
          <p className="text-slate-400 mt-2 max-w-lg mx-auto">Select a customer, add products, watch personalized offers generate in real-time</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900 border border-sky-500/20 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[700px]">
            {/* LEFT PANEL */}
            <div className="lg:col-span-2 p-6 bg-slate-950 flex flex-col gap-5">
              {/* POS Header */}
              <div className="flex items-center justify-between bg-gradient-to-r from-sky-500 to-sky-600 p-4 rounded-2xl text-white shadow-lg">
                <div>
                  <h3 className="font-extrabold text-lg">FreshMart POS</h3>
                  <p className="text-xs opacity-80">Smart Personalized Billing</p>
                </div>
                <div className="bg-white/20 px-4 py-1 rounded-lg font-mono text-sm font-bold">Bill #1042</div>
              </div>

              {/* Customer Select */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Select Customer</label>
                <select
                  value={customerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-sky-500 outline-none"
                >
                  <option value="">-- Choose Customer --</option>
                  <option value="C101">C101 — Mohit Pathak (Regular)</option>
                  <option value="C102">C102 — Lakshita Mandela (Premium)</option>
                  <option value="C103">C103 — Chirag Poswal (Regular)</option>
                  <option value="C104">C104 — New Customer</option>
                </select>

                {customer && (
                  <div className="mt-3 bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0"
                      style={{ background: customer.avatarBg }}
                    >
                      {customer.initials}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{customer.name}</h4>
                      <p className="text-sm text-slate-500">{customer.segment} · {customer.visits} visits</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${SEGMENT_STYLES[customer.segment]}`}>
                      {customer.segment}
                    </span>
                  </div>
                )}
              </div>

              {/* Products Grid */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">Products</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                  {PRODUCTS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => addToBill(p.id)}
                      className="group bg-slate-900 border border-slate-700 p-3 rounded-xl text-center hover:border-sky-500 hover:shadow-lg hover:shadow-sky-500/10 transition-all active:scale-95"
                    >
                      <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{p.emoji}</div>
                      <div className="text-xs font-semibold text-slate-200">{p.name}</div>
                      <div className="text-xs text-sky-400 font-bold">₹{p.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bill Table */}
              <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden min-h-[140px]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-sky-500/5 border-b border-slate-700">
                      <th className="p-3 text-left text-xs text-slate-500 uppercase font-semibold">Item</th>
                      <th className="p-3 text-center text-xs text-slate-500 uppercase font-semibold">Qty</th>
                      <th className="p-3 text-right text-xs text-slate-500 uppercase font-semibold">Price</th>
                      <th className="p-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {bill.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500 italic">No items added yet. Tap a product above.</td>
                      </tr>
                    ) : (
                      bill.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{item.emoji}</span>
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <div className="inline-flex items-center gap-1.5">
                              <button onClick={() => updateQty(idx, -1)} className="w-7 h-7 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center hover:bg-sky-500/20 transition-colors">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-mono font-bold">{item.qty}</span>
                              <button onClick={() => updateQty(idx, 1)} className="w-7 h-7 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center hover:bg-sky-500/20 transition-colors">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-sky-400">₹{(item.price * item.qty).toFixed(2)}</td>
                          <td className="p-3">
                            <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-300 transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-4 gap-3">
                <button onClick={clearBill} className="p-3 rounded-xl border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/15 transition-all text-sm font-semibold flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" /> Clear
                </button>
                <button onClick={holdBill} className="p-3 rounded-xl border border-slate-600 text-slate-400 bg-slate-800 hover:border-sky-500 transition-all text-sm font-semibold flex items-center justify-center gap-2">
                  <Pause className="w-4 h-4" /> Hold
                </button>
                <button onClick={cancelLast} className="p-3 rounded-xl border border-slate-600 text-slate-400 bg-slate-800 hover:border-sky-500 transition-all text-sm font-semibold flex items-center justify-center gap-2">
                  <Undo2 className="w-4 h-4" /> Undo
                </button>
                <button onClick={() => { if (!bill.length) { show('Add items first!', 'error'); return; } setShowReceipt(true); }} className="p-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold shadow-lg hover:opacity-90 transition-all text-sm flex items-center justify-center gap-2">
                  <Printer className="w-4 h-4" /> Pay & Print
                </button>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-6 flex flex-col gap-5">
              {/* Bill Summary */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Bill Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Subtotal</span><span className="font-mono font-bold">₹{subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">GST (5%)</span><span className="font-mono">₹{gst.toFixed(2)}</span></div>
                  <div className="flex justify-between text-emerald-400"><span>Discount</span><span className="font-mono">-₹{discount.toFixed(2)}</span></div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between text-lg font-bold">
                    <span>Total</span><span className="font-mono text-sky-400 text-xl">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Operations Counter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Algorithm Ops Counter</h4>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2 leading-7">
                  <div className="flex justify-between"><span className="text-slate-500">Hash lookups</span><span className="text-sky-400 font-bold">{opHash}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">HashMap updates</span><span className="text-sky-400 font-bold">{opMap}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Comparisons (sort)</span><span className="text-sky-400 font-bold">{opSort}</span></div>
                  <div className="border-t border-slate-800 pt-1 flex justify-between">
                    <span className="text-slate-200 font-bold">Total ops</span><span className="text-amber-400 font-bold">{opHash + opMap + opSort}</span>
                  </div>
                </div>
              </div>

              {/* Offers */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Personalized Offers</h4>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold">{offers.length} offers</span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {offers.length === 0 ? (
                    <div className="text-sm text-slate-500 text-center py-4">Select a customer to unlock offers</div>
                  ) : (
                    offers.map((o) => (
                      <button key={o.id} onClick={() => toggleOffer(o.id)} className={`w-full text-left p-3.5 rounded-xl border transition-all ${o.applied ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-700 bg-slate-950/50 opacity-60'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-sm font-bold ${o.applied ? 'text-emerald-400' : 'text-slate-500'}`}>🎁 {o.label}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${o.applied ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>{o.applied ? '✓ On' : 'Apply'}</span>
                        </div>
                        <div className="text-xs text-slate-400">{o.desc}</div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* History */}
              {customer && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Purchase History</h4>
                    <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold">{customer.visits} visits</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 max-h-32 overflow-y-auto text-xs space-y-1.5">
                    {customer.history.length === 0 ? (
                      <div className="text-slate-500 text-center">No history</div>
                    ) : (
                      customer.history.map((h, i) => (
                        <div key={i} className="flex justify-between items-center p-2 bg-slate-900/50 rounded-lg">
                          <span className="text-slate-500">{h.date}</span>
                          <span>{h.items.map((it) => PRODUCTS.find((p) => p.id === it)?.emoji).join(' ')}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Frequent Items */}
              {customer && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Frequent Items</h4>
                  <div className="flex flex-wrap gap-2">
                    {frequentItems.length === 0 ? (
                      <span className="text-sm text-slate-500">—</span>
                    ) : (
                      frequentItems.map(([id, count]) => {
                        const p = PRODUCTS.find((x) => x.id === id);
                        return (
                          <span key={id} className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold">
                            {p?.emoji} {p?.name} x{count}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Payment */}
              <div className="mt-auto">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Payment Method</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { method: 'Cash', icon: Banknote },
                    { method: 'Card', icon: CreditCard },
                    { method: 'UPI', icon: Smartphone },
                  ].map(({ method, icon: Icon }) => (
                    <button
                      key={method}
                      onClick={() => setPayment(method)}
                      className={`p-2.5 rounded-xl border text-center transition-all text-xs ${
                        payment === method
                          ? 'border-sky-500 bg-sky-500/10 text-sky-400'
                          : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-sky-500/50'
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1 block" />
                      <span>{method}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RECEIPT MODAL */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowReceipt(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center pb-4 border-b-2 border-dashed border-slate-700 mb-4">
              <div className="text-2xl font-extrabold">FreshMart</div>
              <div className="text-xs text-slate-500">{new Date().toLocaleString('en-IN')}</div>
            </div>
            <div className="space-y-2 text-sm mb-4">
              {bill.map((i, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{i.emoji} {i.name} x{i.qty}</span>
                  <span className="font-mono">₹{(i.price * i.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-dashed border-slate-700 pt-4">
              <div className="flex justify-between text-lg font-extrabold">
                <span>Total</span><span className="text-sky-400 font-mono">₹{total.toFixed(2)}</span>
              </div>
            </div>
            {offers.filter((o) => o.applied).length > 0 && (
              <div className="mt-3 text-xs text-emerald-400">
                Applied offers: {offers.filter((o) => o.applied).map((o) => o.label).join(', ')}
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowReceipt(false)} className="flex-1 py-2.5 border border-slate-600 rounded-xl hover:bg-slate-800 transition-colors text-sm font-semibold">
                Close
              </button>
              <button onClick={() => window.print()} className="flex-1 py-2.5 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl hover:opacity-90 transition-all text-sm font-semibold flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
