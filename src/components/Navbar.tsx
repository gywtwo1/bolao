import React, { useState } from 'react';
import { useBolao } from '../context/BolaoContext';
import { 
  Trophy, 
  Bell, 
  ShieldCheck, 
  UserCircle2, 
  HelpCircle, 
  Smartphone, 
  Monitor, 
  ChevronDown, 
  LogOut, 
  DollarSign
} from 'lucide-react';
import { formatCurrency } from '../utils/pix';

interface NavbarProps {
  isPhoneFrame: boolean;
  setIsPhoneFrame: (val: boolean) => void;
  openRules: () => void;
  openAuth: () => void;
  openInstallApp?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isPhoneFrame,
  setIsPhoneFrame,
  openRules,
  openAuth,
  activeTab,
  setActiveTab
}) => {
  const { currentUser, unreadNotifsCount, activeRound, isAdmin, logout, onlineUsersCount } = useBolao();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('palpites')} 
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-800 flex items-center justify-center shadow-lg shadow-emerald-950/60 border border-emerald-400/30 group-hover:scale-105 transition-transform">
            <span className="text-xl">⚽</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1">
                BOLÃO <span className="text-emerald-400">2026</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Série A
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden xs:block">
              Brasileirão • Placar Exato 3 pts • Resultado 1 pt
            </p>
          </div>
        </div>

        {/* Prize Pot Badge (Desktop / Tablet) */}
        {activeRound && (
          <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 px-3 py-1.5 rounded-full">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <div className="text-xs">
              <span className="text-slate-400">Prêmio Acumulado:</span>{' '}
              <span className="font-extrabold text-amber-400">{formatCurrency(activeRound.totalPot || 0)}</span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Live Online Users Badge (Updated every second) */}
          <div 
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold select-none"
            title="Usuários online verificados a cada segundo"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline font-semibold text-slate-300">Online:</span>
            <span className="text-emerald-400 font-black">{onlineUsersCount}</span>
          </div>

          {/* Android Frame Switcher (Only on larger screens) */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            title={isPhoneFrame ? "Ver em tela cheia (Desktop)" : "Simular App Android (Mobile)"}
            className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
          >
            {isPhoneFrame ? <Monitor className="w-3.5 h-3.5 text-emerald-400" /> : <Smartphone className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isPhoneFrame ? 'Desktop' : 'Modo Android'}</span>
          </button>

          {/* User Profile Icon - Placed in the position of Regras */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              title={currentUser ? `Perfil: ${currentUser.name}` : 'Perfil do Usuário'}
              className={`flex items-center gap-1.5 p-1 sm:p-1.5 pl-1.5 sm:pl-2 pr-2 sm:pr-2.5 rounded-xl border transition-all ${
                isAdmin 
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-300 hover:bg-amber-950/60' 
                  : 'bg-slate-900 border-slate-800 text-white hover:border-slate-700'
              }`}
            >
              <div className="relative">
                <img
                  src={currentUser?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                  alt="Perfil"
                  className="w-7 h-7 rounded-lg object-cover border border-slate-700 bg-slate-800"
                />
                <span 
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse" 
                  title="Online Agora"
                />
              </div>
              <div className="text-left hidden md:block max-w-[95px] truncate">
                <p className="text-xs font-bold truncate leading-tight">
                  {currentUser?.name.split(' ')[0] || 'Perfil'}
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">
                  {isAdmin ? '🛡️ ADM' : `${currentUser?.totalPoints || 0} pts`}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-2.5 border-b border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Conta Atual
                    </span>
                    {isAdmin ? (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/40">
                        Admin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-white mt-1 truncate">{currentUser?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{currentUser?.email}</p>
                  {currentUser?.favoriteTeam && (
                    <p className="text-[11px] text-emerald-400 font-medium mt-1">
                      Time: {currentUser.favoriteTeam}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      openRules();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white rounded-xl transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-emerald-400" />
                    <span>Regras & Pontuação do Bolão</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      openAuth();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white rounded-xl transition-colors"
                  >
                    <UserCircle2 className="w-4 h-4 text-slate-400" />
                    <span>Cadastrar / Novo Login</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setActiveTab('admin');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-amber-400 hover:bg-amber-950/30 rounded-xl transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>{isAdmin ? 'Acessar Painel ADM' : 'Painel de Administração (ADM)'}</span>
                  </button>

                  <button
                    onClick={() => {
                      const wasAdmin = isAdmin;
                      logout();
                      setShowUserMenu(false);
                      if (wasAdmin || activeTab === 'admin') {
                        setActiveTab('palpites');
                        openAuth();
                      }
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>{isAdmin ? 'Sair do Modo ADM' : 'Sair da Conta'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notification Button */}
          <button
            onClick={() => setActiveTab('notificacoes')}
            title="Notificações Push"
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Bell className="w-4 h-4 text-slate-400" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* User Score Pill */}
          {currentUser && currentUser.role !== 'admin' && (
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-600/40 px-2.5 py-1 rounded-xl">
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-black text-emerald-300">{currentUser.totalPoints} pts</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
