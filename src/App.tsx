/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BolaoProvider, useBolao } from './context/BolaoContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { PalpitesView } from './components/PalpitesView';
import { RankingView } from './components/RankingView';
import { HistoryView } from './components/HistoryView';
import { NotificationsView } from './components/NotificationsView';
import { AdminPanel } from './components/AdminPanel';
import { PushToast } from './components/PushToast';
import { RulesModal } from './components/RulesModal';
import { AuthModal } from './components/AuthModal';
import { Smartphone, Wifi, Battery, Signal } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('palpites');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const { isAdmin } = useBolao();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'palpites':
        return <PalpitesView />;
      case 'ranking':
        return <RankingView />;
      case 'historico':
        return <HistoryView />;
      case 'notificacoes':
        return <NotificationsView />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <PalpitesView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start selection:bg-emerald-500 selection:text-slate-950">
      {/* Push Notification Toast Banner */}
      <PushToast />

      {/* Rules Modal */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Android Phone Frame Simulator (Toggleable on Desktop) */}
      {isPhoneFrame ? (
        <div className="py-6 px-4 w-full flex flex-col items-center justify-center min-h-screen bg-slate-900/50">
          <div className="w-full max-w-[430px] h-[92vh] max-h-[890px] bg-slate-950 border-[6px] border-slate-800 rounded-[48px] shadow-2xl shadow-emerald-950/40 overflow-hidden flex flex-col relative ring-1 ring-slate-700/60">
            {/* Phone Top Notch / Speaker & Status Bar */}
            <div className="bg-slate-950 pt-2 pb-1 px-6 flex items-center justify-between text-[11px] font-bold text-slate-400 select-none z-50 border-b border-slate-900">
              <span>19:26</span>
              {/* Camera punch-hole */}
              <div className="w-4 h-4 bg-slate-900 rounded-full border border-slate-800" />
              <div className="flex items-center gap-1.5">
                <Signal className="w-3 h-3 text-slate-300" />
                <Wifi className="w-3 h-3 text-slate-300" />
                <Battery className="w-3.5 h-3.5 text-slate-300" />
              </div>
            </div>

            {/* Navbar inside phone */}
            <Navbar
              isPhoneFrame={isPhoneFrame}
              setIsPhoneFrame={setIsPhoneFrame}
              openRules={() => setIsRulesOpen(true)}
              openAuth={() => setIsAuthOpen(true)}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* Scrollable Phone Content */}
            <main className="flex-1 overflow-y-auto pt-3">
              {renderActiveView()}
            </main>

            {/* Phone Bottom Navigation Bar */}
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      ) : (
        /* Full Desktop / Responsive Layout */
        <div className="w-full min-h-screen flex flex-col">
          <Navbar
            isPhoneFrame={isPhoneFrame}
            setIsPhoneFrame={setIsPhoneFrame}
            openRules={() => setIsRulesOpen(true)}
            openAuth={() => setIsAuthOpen(true)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <main className="flex-1 pt-4 max-w-5xl w-full mx-auto">
            {renderActiveView()}
          </main>

          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <BolaoProvider>
      <MainAppContent />
    </BolaoProvider>
  );
}
