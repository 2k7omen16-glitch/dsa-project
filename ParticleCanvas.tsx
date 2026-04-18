export interface AlgorithmStep {
  icon: string;
  title: string;
  explain: string;
  code: string;
}

export const ALGORITHM_STEPS: AlgorithmStep[] = [
  {
    icon: '🔑',
    title: 'Receive Customer ID',
    explain:
      'The system receives a Customer ID as input — the entry point of the entire pipeline. This single identifier will unlock the customer\'s complete behavioral profile.',
    code: 'function generateOffer(customerId) {\n  // customerId = "C101" (Mohit Pathak)\n  return pipeline.execute(customerId);\n}',
  },
  {
    icon: '🗃️',
    title: 'Hash Table Lookup — O(1)',
    explain:
      'The Hash Table is queried using the Customer ID. A hash function converts the ID into an array index, giving constant-time O(1) retrieval of the complete transaction list — regardless of how many customers exist.',
    code:
      '// Hash function: h(key) = sum(char codes) % TABLE_SIZE\nconst hash = customerId.charCodeAt(0) % 10; // → [3]\nconst transactions = hashTable[hash];  // O(1) lookup',
  },
  {
    icon: '📋',
    title: 'Initialise productFrequency HashMap',
    explain:
      'An empty Hash Map is initialised to store frequency counts. Each product name will become a key, with its purchase count as the value. Starting fresh for this customer query.',
    code: 'const productFrequency = {};\n// HashMap starts empty: {}\n// Will grow as we scan transactions',
  },
  {
    icon: '🔄',
    title: 'Traverse All Transactions — O(n)',
    explain:
      'Each of the customer\'s n transactions is visited exactly once in a forward pass. No skipping, no backtracking. One pass = O(n) for the outer loop.',
    code: 'for (let txn of transactions) {   // O(n) loop\n  // Process each transaction...\n}',
  },
  {
    icon: '🛒',
    title: 'Traverse Products Per Transaction — O(m)',
    explain:
      'Within each transaction, every product (m products on average) is visited. Combined with the outer loop, this gives us O(n × m) total — the absolute minimum for this operation.',
    code: 'for (let txn of transactions) {\n  for (let product of txn.items) {   // O(m) inner loop\n    // O(n×m) combined — minimum possible\n  }\n}',
  },
  {
    icon: '⬆️',
    title: 'Update HashMap — O(1) Each',
    explain:
      'For each product encountered, its count in productFrequency is incremented in O(1) time. Hash Map key access is constant-time — no searching required. This is the core engine of the algorithm.',
    code: 'for (let product of txn.items) {\n  // O(1) key access and update:\n  productFrequency[product] =\n    (productFrequency[product] || 0) + 1;\n}',
  },
  {
    icon: '🔍',
    title: 'Threshold Filter — O(k)',
    explain:
      'After building the frequency map, all entries are scanned. Only products with count ≥ threshold (default: 2) are added to the frequentItems list. k = number of unique products, always ≤ n×m.',
    code: 'const THRESHOLD = 2;\nconst frequentItems = Object.entries(productFrequency)\n  .filter(([product, count]) => count >= THRESHOLD);\n// O(k) scan — k unique products',
  },
  {
    icon: '📊',
    title: 'Sort by Frequency — O(k log k)',
    explain:
      'The frequentItems list is sorted in descending order by purchase count. Only k items are sorted (not all n×m entries), keeping this step fast. Ensures the most-bought item is always first.',
    code: 'frequentItems.sort((a, b) => b[1] - a[1]);\n// O(k log k) — sorting only k unique items\n// Result: [["bread",4],["milk",3],["butter",2]]',
  },
  {
    icon: '🕸️',
    title: 'Market Basket Pair Detection — O(n×m²)',
    explain:
      'A second Hash Map scans for products frequently bought together in the same transaction. Every pair of co-occurring products is counted. The most frequent pair becomes a combo offer candidate.',
    code:
      'const pairFreq = {};\nfor (let txn of transactions)\n  for (let i = 0; i < txn.items.length; i++)\n    for (let j = i+1; j < txn.items.length; j++) {\n      const key = [txn.items[i],txn.items[j]].sort().join("+");\n      pairFreq[key] = (pairFreq[key] || 0) + 1;\n    }',
  },
  {
    icon: '🎁',
    title: 'Generate & Return Offer — O(1)',
    explain:
      'The top frequent item (or best co-purchase pair) is selected and formatted into a personalized offer. The result is returned to the customer. The entire pipeline runs in O(n×m) total time.',
    code: 'const topItem = frequentItems[0]; // O(1) access\nreturn {\n  type: "discount",\n  product: topItem[0],      // "bread"\n  discount: "10%",\n  message: "Buy Bread — 10% off for you!"\n};\n// ✅ Total: O(1)+O(n×m)+O(k log k) ≈ O(n×m)',
  },
];
