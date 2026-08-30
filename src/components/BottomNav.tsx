import React from 'react';
import { useBolao } from '../context/BolaoContext';
import { Trophy, History, Bell, ShieldCheck, Flame } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { unreadNotifsCount, isAdmin, bets } = useBolao();

  const pendingReceiptsCount = bets.filter(b => b.status === 'receipt_submitted').length;

  const tabs = [
    {
      id: 'palpites',
      label: 'Palpites',
      icon: Flame,
      badge: null
    },
    {
      id: 'ranking',
      label: 'Ranking',
      icon: Trophy,
      badge: null
    },
    {
      id: 'historico',
      label: 'Minhas Apostas',
      icon: History,
      badge: null
    },
    {
      id: 'notificacoes',
      label: 'Alertas',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : null
    },
    {
      id: 'admin',
      label: 'Painel ADM',
      icon: ShieldCheck,
      badge: pendingReceiptsCount > 0 ? pendingReceiptsCount : null,
      adminOnly: true
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 max-w-lg md:max-w-none mx-auto">
      <div className="flex items-center justify-around px-2 py-1.5 sm:py-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isAdminTab = tab.id === 'admin';

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? isAdminTab
                    ? 'text-amber-400 font-bold'
                    : 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.badge !== null && (
                  <span className={`absolute -top-1.5 -right-2.5 px-1 min-w-[16px] h-4 text-[10px] font-extrabold rounded-full flex items-center justify-center text-white ${
                    isAdminTab ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight font-medium">
                {tab.label}
              </span>
              {isActive && (
                <span className={`w-1 h-1 rounded-full mt-0.5 ${isAdminTab ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
