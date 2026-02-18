import React from 'react';
import { Wallet } from '../types';
import * as LucideIcons from 'lucide-react';

interface WalletCardProps {
  wallet: Wallet;
}

export const WalletCard: React.FC<WalletCardProps> = ({ wallet }) => {
  // Dynamically render icon
  const IconComponent = (LucideIcons as any)[wallet.icon.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')] || LucideIcons.Wallet;

  return (
    <div className={`relative overflow-hidden rounded-3xl p-5 text-white shadow-lg transform transition-transform active:scale-95 ${wallet.color}`}>
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white opacity-20 blur-xl"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="p-2 bg-white/20 rounded-full">
          <IconComponent size={24} className="text-white" />
        </div>
        <span className="text-xs font-bold bg-black/20 px-2 py-1 rounded-full">
          {wallet.percentage}% Split
        </span>
      </div>

      <div className="relative z-10">
        <h3 className="text-lg font-medium opacity-90">{wallet.name}</h3>
        <p className="text-3xl font-bold mt-1">£{wallet.balance.toFixed(2)}</p>
      </div>
    </div>
  );
};
