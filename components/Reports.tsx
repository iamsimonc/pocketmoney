import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { AppData } from '../types';

interface ReportsProps {
  data: AppData;
}

export const Reports: React.FC<ReportsProps> = ({ data }) => {
  // 1. Current Wallet Distribution
  const walletData = data.wallets.filter(w => w.balance > 0).map(w => ({
    name: w.name,
    value: w.balance,
    color: w.color.includes('blue') ? '#3b82f6' : 
           w.color.includes('emerald') ? '#10b981' :
           w.color.includes('violet') ? '#8b5cf6' : '#f43f5e'
  }));

  // 2. Expenses by Wallet
  const expenseData = data.transactions
    .filter(t => t.type === 'EXPENSE' && t.walletId)
    .reduce((acc, curr) => {
      const walletName = data.wallets.find(w => w.id === curr.walletId)?.name || 'Unknown';
      const existing = acc.find(item => item.name === walletName);
      if (existing) {
        existing.value += curr.amount;
      } else {
        const w = data.wallets.find(w => w.id === curr.walletId);
        const color = w ? (w.color.includes('blue') ? '#3b82f6' : w.color.includes('emerald') ? '#10b981' : w.color.includes('violet') ? '#8b5cf6' : '#f43f5e') : '#9ca3af';
        acc.push({ name: walletName, value: curr.amount, color });
      }
      return acc;
    }, [] as { name: string; value: number; color: string }[]);

  return (
    <div className="h-full overflow-y-auto p-6 pb-24 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Financial Reports</h2>

      <div className="bg-white p-4 rounded-3xl shadow-sm">
        <h3 className="text-lg font-bold text-gray-600 mb-4 text-center">Current Balance Split</h3>
        <div className="h-64">
           {walletData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={walletData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {walletData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `£${value.toFixed(2)}`} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
           ) : (
             <div className="h-full flex items-center justify-center text-gray-400">No money yet!</div>
           )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm">
        <h3 className="text-lg font-bold text-gray-600 mb-4 text-center">Where Your Money Goes</h3>
        <div className="h-64">
           {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                   {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `£${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
           ) : (
             <div className="h-full flex items-center justify-center text-gray-400">No expenses yet!</div>
           )}
        </div>
      </div>
    </div>
  );
};
