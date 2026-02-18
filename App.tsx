import React, { useState, useEffect } from 'react';
import { loadData, saveData, exportData, importData } from './services/dataService';
import { AppData, ViewState, TransactionType } from './types';
import { WalletCard } from './components/WalletCard';
import { AddTransaction } from './components/AddTransaction';
import { Reports } from './components/Reports';
import { LayoutDashboard, PlusCircle, History, PieChart, Settings, Download, Upload, Trash2 } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<AppData>({ wallets: [], transactions: [] });
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);

  useEffect(() => {
    setData(loadData());
  }, []);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const totalBalance = data.wallets.reduce((acc, w) => acc + w.balance, 0);

  const handleAddTransaction = (type: TransactionType, amount: number, description: string, walletId?: string) => {
    const newTxId = Date.now().toString();
    const date = new Date().toISOString();
    let newWallets = [...data.wallets];

    if (type === 'INCOME') {
      const distribution: Record<string, number> = {};
      newWallets = newWallets.map(w => {
        const splitAmount = (amount * w.percentage) / 100;
        distribution[w.id] = splitAmount;
        return { ...w, balance: w.balance + splitAmount };
      });
      const tx = { id: newTxId, type, amount, date, description, distribution };
      setData({ wallets: newWallets, transactions: [tx, ...data.transactions] });
    } else {
      if (!walletId) return;
      const walletIndex = newWallets.findIndex(w => w.id === walletId);
      if (walletIndex === -1) return;
      if (newWallets[walletIndex].balance < amount) {
        alert("錢包餘額不足！");
        return;
      }
      newWallets[walletIndex].balance -= amount;
      const tx = { id: newTxId, type, amount, date, description, walletId };
      setData({ wallets: newWallets, transactions: [tx, ...data.transactions] });
    }
    setView(ViewState.DASHBOARD);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const importedData = await importData(e.target.files[0]);
        setData(importedData);
        alert("資料匯入成功！");
      } catch (err) {
        alert("匯入失敗。");
      }
    }
  };

  const handleReset = () => {
    if (confirm("確定要刪除所有資料嗎？這無法還原。")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const renderContent = () => {
    switch(view) {
      case ViewState.ADD_INCOME:
        return <AddTransaction wallets={data.wallets} onAdd={handleAddTransaction} onCancel={() => setView(ViewState.DASHBOARD)} />;
      case ViewState.REPORTS:
        return <Reports data={data} />;
      case ViewState.SETTINGS:
        return (
           <div className="p-6 space-y-6">
             <h2 className="text-2xl font-bold text-gray-800">設定</h2>
             <div className="bg-white p-4 rounded-2xl shadow-sm">
               <h3 className="font-bold mb-2 text-gray-800">錢包分配比例</h3>
               <p className="text-sm text-gray-500 mb-4">總和必須為 100%</p>
               {data.wallets.map((w, idx) => (
                 <div key={w.id} className="flex items-center justify-between mb-2">
                   <span className="text-sm font-bold text-gray-800 w-24">{w.name}</span>
                   <div className="flex items-center gap-2">
                     <input 
                        type="number" 
                        value={w.percentage}
                        onChange={(e) => {
                           const val = parseInt(e.target.value) || 0;
                           const newWallets = [...data.wallets];
                           newWallets[idx].percentage = val;
                           setData({...data, wallets: newWallets});
                        }}
                        className="w-16 p-2 bg-gray-100 rounded-lg text-center text-gray-900 font-bold"
                     />
                     <span className="text-gray-500">%</span>
                   </div>
                 </div>
               ))}
             </div>
             <div className="bg-white p-4 rounded-2xl shadow-sm space-y-4">
                <button onClick={() => exportData(data)} className="w-full flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-600 rounded-xl font-bold">
                  <Download size={20}/> 匯出備份
                </button>
                <div className="relative w-full">
                  <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 w-full cursor-pointer" />
                  <div className="w-full flex items-center justify-center gap-2 p-3 bg-purple-50 text-purple-600 rounded-xl font-bold">
                    <Upload size={20}/> 匯入備份
                  </div>
                </div>
                <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl font-bold">
                  <Trash2 size={20}/> 重設所有資料
                </button>
             </div>
           </div>
        );
      case ViewState.HISTORY:
        return (
          <div className="p-6 pb-24 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">歷史紀錄</h2>
            {data.transactions.map(tx => (
              <div key={tx.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
                 <div className="flex flex-col">
                   <span className="font-bold text-gray-800">{tx.description}</span>
                   <span className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString()}</span>
                 </div>
                 <span className={`font-bold text-lg ${tx.type === 'INCOME' ? 'text-green-500' : 'text-red-500'}`}>
                   {tx.type === 'INCOME' ? '+' : '-'}£{tx.amount.toFixed(2)}
                 </span>
              </div>
            ))}
          </div>
        );
      case ViewState.DASHBOARD:
      default:
        return (
          <div className="p-6 pb-24 space-y-6">
            <div className="text-center py-6">
              <h2 className="text-gray-500 font-medium">總餘額</h2>
              <h1 className="text-5xl font-bold text-gray-800 mt-2">£{totalBalance.toFixed(2)}</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.wallets.map(wallet => (
                <WalletCard key={wallet.id} wallet={wallet} />
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-full bg-green-50/50 flex flex-col">
      <header className="bg-white/80 backdrop-blur-md p-4 flex justify-between items-center sticky top-0 z-20">
         <div className="flex items-center gap-2">
           <span className="text-2xl">🐷</span>
           <span className="font-bold text-xl text-gray-800">PocketPiggy</span>
         </div>
         <button onClick={() => setView(ViewState.SETTINGS)} className="p-2 text-gray-400 hover:text-gray-600">
           <Settings size={24} />
         </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        {renderContent()}
      </main>

      {view !== ViewState.ADD_INCOME && (
        <nav className="bg-white border-t p-2 pb-6 flex justify-around items-center">
          <NavBtn icon={<LayoutDashboard size={24} />} label="首頁" isActive={view === ViewState.DASHBOARD} onClick={() => setView(ViewState.DASHBOARD)} />
          <NavBtn icon={<PieChart size={24} />} label="分析" isActive={view === ViewState.REPORTS} onClick={() => setView(ViewState.REPORTS)} />
          <div className="relative -top-6">
            <button onClick={() => setView(ViewState.ADD_INCOME)} className="bg-gray-900 text-white p-4 rounded-full shadow-xl">
              <PlusCircle size={32} />
            </button>
          </div>
          <NavBtn icon={<History size={24} />} label="歷史" isActive={view === ViewState.HISTORY} onClick={() => setView(ViewState.HISTORY)} />
          <NavBtn icon={<Settings size={24} />} label="設定" isActive={view === ViewState.SETTINGS} onClick={() => setView(ViewState.SETTINGS)} />
        </nav>
      )}
    </div>
  );
}

const NavBtn = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 w-16 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
    {icon}
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);