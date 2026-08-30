import React, { useState } from 'react';
import { useBolao } from '../context/BolaoContext';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Trophy, 
  CheckCheck, 
  Sparkles,
  Calendar,
  DollarSign
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    currentUser,
    unreadNotifsCount 
  } = useBolao();

  const [filter, setFilter] = useState<'all' | 'results' | 'payments' | 'rounds'>('all');

  const userNotifs = notifications.filter(n => !n.userId || n.userId === currentUser?.id);

  const filteredNotifs = userNotifs.filter(n => {
    if (filter === 'results') return n.type === 'results_ready' || n.type === 'stats_update';
    if (filter === 'payments') return n.type === 'payment_confirmed' || n.type === 'payment_rejected';
    if (filter === 'rounds') return n.type === 'round_open';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment_confirmed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'payment_rejected':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'results_ready':
      case 'stats_update':
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'round_open':
        return <Calendar className="w-5 h-5 text-blue-400" />;
      default:
        return <Bell className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-4xl mx-auto px-3 sm:px-4">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl border border-blue-500/30">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Notificações & Alertas Push
                </h2>
                {unreadNotifsCount > 0 && (
                  <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                    {unreadNotifsCount} novas
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Alertas instantâneos de novos palpites, comprovantes aprovados e resultados oficiais.
              </p>
            </div>
          </div>

          {unreadNotifsCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl transition-colors shrink-0"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Marcar todas como lidas</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto py-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-slate-700 text-white shadow'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Todas ({userNotifs.length})
          </button>
          <button
            onClick={() => setFilter('results')}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filter === 'results'
                ? 'bg-amber-500 text-slate-950 shadow font-extrabold'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Resultados & Placares
          </button>
          <button
            onClick={() => setFilter('payments')}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filter === 'payments'
                ? 'bg-emerald-500 text-slate-950 shadow font-extrabold'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Pagamentos PIX
          </button>
          <button
            onClick={() => setFilter('rounds')}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filter === 'rounds'
                ? 'bg-blue-500 text-slate-950 shadow font-extrabold'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Novas Rodadas
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filteredNotifs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs bg-slate-900/40 border border-slate-800 rounded-3xl">
            Nenhuma notificação encontrada nesta categoria.
          </div>
        ) : (
          filteredNotifs.map((notif, idx) => (
            <div
              key={`${notif.id}-${idx}`}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                notif.read
                  ? 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/40'
                  : 'bg-slate-900 border-emerald-500/40 shadow-lg shadow-emerald-950/30'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white truncate">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(notif.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>

              {!notif.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 mt-2 shadow shadow-emerald-400/50" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
