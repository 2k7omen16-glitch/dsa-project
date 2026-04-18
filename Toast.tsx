export interface Product {
  id: string;
  name: string;
  emoji: string;
  price: number;
  cat: string;
}

export const PRODUCTS: Product[] = [
  { id: 'milk', name: 'Milk', emoji: '🥛', price: 52, cat: 'dairy' },
  { id: 'bread', name: 'Bread', emoji: '🍞', price: 38, cat: 'bakery' },
  { id: 'butter', name: 'Butter', emoji: '🧈', price: 65, cat: 'dairy' },
  { id: 'eggs', name: 'Eggs', emoji: '🥚', price: 72, cat: 'protein' },
  { id: 'rice', name: 'Rice', emoji: '🍚', price: 55, cat: 'grains' },
  { id: 'sugar', name: 'Sugar', emoji: '🍬', price: 44, cat: 'pantry' },
  { id: 'oil', name: 'Oil', emoji: '🫙', price: 95, cat: 'pantry' },
  { id: 'cheese', name: 'Cheese', emoji: '🧀', price: 120, cat: 'dairy' },
  { id: 'yogurt', name: 'Yogurt', emoji: '🍶', price: 35, cat: 'dairy' },
  { id: 'apple', name: 'Apple', emoji: '🍎', price: 80, cat: 'fruit' },
  { id: 'banana', name: 'Banana', emoji: '🍌', price: 40, cat: 'fruit' },
  { id: 'tomato', name: 'Tomato', emoji: '🍅', price: 30, cat: 'veg' },
];
