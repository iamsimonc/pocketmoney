import React, { useState } from 'react';
import { Wallet, TransactionType } from '../types';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface AddTransactionProps {
  wallets: Wallet[];
  onAdd: (type: TransactionType, amount: number, description: string, walletId?: string) => void;
  onCancel: () => void;
}

export const AddTransaction: React.FC<AddTransactionProps> = ({ wallets, onAdd, onCancel }) => {
  const [activeTab, setActiveTab] = useState<TransactionType>('INCOME');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedWalletId, setSelectedWalletId] = useState<string>(wallets[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount))) return;
    
    onAdd(
      activeTab, 
      parseFloat(amount), 
      description || (activeTab === 'INCOME' ? 'Allowance' : 'Purchase'), 
      activeTab === 'EXPENSE' ? selectedWalletId : undefined
    );
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-t-3xl shadow-2xl p-6 animate-slide-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">New Transaction</h2>
        <button onClick={onCancel} className="text-gray-500 font-medium">Cancel</button>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
        <button
          onClick={() => setActiveTab('INCOME')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'INCOME' 
              ? 'bg-green-500 text-white shadow-md' 
              : 'text-gray-500'
          }`}
        >
          <ArrowDownCircle size={18} />
          Pocket Money In
        </button>
        <button
          onClick={() => setActiveTab('EXPENSE')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'EXPENSE' 
              ? 'bg-red-500 text-white shadow-md' 
              : 'text-gray-500'
          }`}
        >
          <ArrowUpCircle size={18} />
          Spending Out
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">Amount (£)</label>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full text-4xl font-bold text-gray-800 border-b-2 border-gray-200 focus:border-blue-500 outline-none py-2 bg-transparent placeholder-gray-300"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">For What?</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={activeTab === 'INCOME' ? "Weekly Allowance" : "Toys, Candy, etc."}
            className="w-full p-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        {activeTab === 'INCOME' ? (
           <div className="bg-blue-50 p-4 rounded-xl text-blue-700 text-sm">
             <p className="font-bold flex items-center gap-2">ℹ️ Auto-Split</p>
             <p className="mt-1">Money will be divided into your wallets automatically based on your percentages!</p>
           </div>
        ) : (
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Pay From Which Wallet?</label>
            <div className="grid grid-cols-2 gap-2">
              {wallets.map(w => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWalletId(w.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    selectedWalletId === w.id 
                      ? `border-${w.color.replace('bg-', '')} bg-gray-50 text-gray-900 ring-1 ring-${w.color.replace('bg-', '')}` 
                      : 'border-gray-100 text-gray-500'
                  }`}
                >
                  <div className="font-bold text-sm">{w.name}</div>
                  <div className="text-xs">Bal: £{w.balance.toFixed(2)}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-6">
          <button
            type="submit"
            className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg transform active:scale-95 transition-all ${
              activeTab === 'INCOME' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {activeTab === 'INCOME' ? 'Add Money' : 'Pay Now'}
          </button>
        </div>
      </form>
    </div>
  );
};