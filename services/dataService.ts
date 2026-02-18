import { AppData, Wallet, Transaction } from '../types';

const STORAGE_KEY = 'pocketpiggy_data_v1';

const DEFAULT_WALLETS: Wallet[] = [
  { id: 'spend', name: 'Spending', percentage: 40, balance: 0, color: 'bg-blue-500', icon: 'shopping-bag' },
  { id: 'save', name: 'Saving', percentage: 30, balance: 0, color: 'bg-emerald-500', icon: 'piggy-bank' },
  { id: 'invest', name: 'Invest', percentage: 20, balance: 0, color: 'bg-violet-500', icon: 'trending-up' },
  { id: 'give', name: 'Donation', percentage: 10, balance: 0, color: 'bg-rose-500', icon: 'heart' },
];

export const loadData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse data", e);
    }
  }
  return {
    wallets: DEFAULT_WALLETS,
    transactions: []
  };
};

export const saveData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const exportData = (data: AppData) => {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(data)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = `pocketpiggy_backup_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};

export const importData = (file: File): Promise<AppData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const parsed = JSON.parse(result);
        // Basic validation
        if (parsed.wallets && parsed.transactions) {
          resolve(parsed);
        } else {
          reject(new Error("Invalid file format"));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
};
