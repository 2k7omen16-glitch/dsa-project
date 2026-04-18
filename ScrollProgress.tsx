export interface Customer {
  name: string;
  initials: string;
  visits: number;
  segment: 'Regular' | 'Premium' | 'New';
  avatarBg: string;
  history: { date: string; items: string[] }[];
}

export const CUSTOMERS: Record<string, Customer> = {
  C101: {
    name: 'Mohit Pathak',
    initials: 'MP',
    visits: 12,
    segment: 'Regular',
    avatarBg: 'linear-gradient(135deg,#0ea5e9,#8b5cf6)',
    history: [
      { date: 'Mar 08', items: ['milk', 'bread', 'butter'] },
      { date: 'Mar 01', items: ['milk', 'eggs', 'bread'] },
      { date: 'Feb 22', items: ['bread', 'butter', 'cheese'] },
      { date: 'Feb 15', items: ['milk', 'bread', 'rice'] },
      { date: 'Feb 08', items: ['milk', 'eggs'] },
    ],
  },
  C102: {
    name: 'Lakshita Mandela',
    initials: 'LM',
    visits: 8,
    segment: 'Premium',
    avatarBg: 'linear-gradient(135deg,#ec4899,#f97316)',
    history: [
      { date: 'Mar 10', items: ['apple', 'yogurt', 'cheese'] },
      { date: 'Mar 03', items: ['apple', 'banana', 'yogurt'] },
      { date: 'Feb 24', items: ['cheese', 'apple', 'butter'] },
      { date: 'Feb 17', items: ['yogurt', 'apple', 'milk'] },
    ],
  },
  C103: {
    name: 'Chirag Poswal',
    initials: 'CP',
    visits: 5,
    segment: 'Regular',
    avatarBg: 'linear-gradient(135deg,#10b981,#0ea5e9)',
    history: [
      { date: 'Mar 12', items: ['rice', 'oil', 'tomato'] },
      { date: 'Mar 05', items: ['rice', 'sugar', 'oil'] },
      { date: 'Feb 26', items: ['oil', 'tomato'] },
    ],
  },
  C104: {
    name: 'New Customer',
    initials: 'NC',
    visits: 0,
    segment: 'New',
    avatarBg: 'linear-gradient(135deg,#f59e0b,#10b981)',
    history: [],
  },
};

export const SEGMENT_STYLES: Record<string, string> = {
  Regular: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  Premium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  New: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

export interface Offer {
  type: string;
  id: string;
  label: string;
  desc: string;
  discount: number;
  target?: string;
  combo?: string[];
  flat?: boolean;
  min?: number;
  applied: boolean;
}
