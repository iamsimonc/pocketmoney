export interface Wallet { id: string; name: string; percentage: number; balance: number; color: string; icon: string; }
export type TransactionType = 'INCOME' | 'EXPENSE';
export interface Transaction { id: string; type: TransactionType; amount: number; date: string; description: string; walletId?: string; }
export interface AppData { wallets: Wallet[]; transactions: Transaction[]; }
export enum ViewState { DASHBOARD = 'DASHBOARD', ADD_INCOME = 'ADD_INCOME', HISTORY = 'HISTORY', REPORTS = 'REPORTS', SETTINGS = 'SETTINGS' }