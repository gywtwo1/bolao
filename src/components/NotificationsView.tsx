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
  DollarSign,
  Trash2,
  BellOff,
  Check,
  X
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    deleteNotification,
    clearAllNotifications,
    currentUser,
    unreadNotifsCount 
  } = useBolao();

  const [filter, setFilter] = useState<'all' | 'results' | 'payments' | 'rounds'>('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [clearedFeedback, setClearedFeedback] = useState(false);

  const userNotifs = notifications.filter(n => !n.userId || n.userId === currentUser?.id);

  const filteredNotifs = userNotifs.filter(n => {
    if (filter === 'results') return n.type === 'results_ready' || n.type === 'stats_update';
    if (filter === 'payments') return n.type === 'payment_confirmed' || n.type === 'payment_rejected';
    if (filter === 'rounds') return n.type === 'round_open';
    return true;
  });

  const handleClearAll = () => {
    clearAllNotifications();
    setShowConfirmClear(false);
    setClearedFeedback(true);
    setTimeout(() => setClearedFeedback(false), 3000);
  };

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
                  Notificações & Avisos
                </h2>
                {unreadNotifsCount > 0 && (
                  <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                    {unreadNotifsCount} novas
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Histórico de avisos, confirmações de PIX e alertas oficiais da rodada.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {unreadNotifsCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl transition-colors shrink-0"
                title="Marcar todas como lidas"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden xs:inline">Marcar lidas</span>
              </button>
            )}

            {userNotifs.length > 0 && (
              <>
                {!showConfirmClear ? (
                  <button
                    onClick={() => setShowConfirmClear(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-500/30 px-3 py-1.5 rounded-xl transition-colors shrink-0"
                    title="Limpar todos os avisos"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Limpar Avisos</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 bg-slate-950 border border-rose-500/50 p-1 rounded-xl animate-fade-in">
                    <span className="text-[11px] text-rose-300 font-bold px-1.5">
                      Apagar todos?
                    </span>
                    <button
                      onClick={handleClearAll}
                      className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-lg transition-colors"
                    >
                      Sim, Limpar
                    </button>
                    <button
                      onClick={() => setShowConfirmClear(false)}
                      className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Cleared Success Feedback */}
        {clearedFeedback && (
          <div className="mt-3 p-2.5 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Todos os avisos foram limpos com sucesso!</span>
          </div>
        )}

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
          <div className="p-10 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
              <BellOff className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-300">
              Nenhum aviso ou notificação no momento
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Você receberá avisos automáticos quando seus palpites forem computados, comprovantes forem aprovados ou novos jogos começarem.
            </p>
          </div>
        ) : (
          filteredNotifs.map((notif, idx) => (
            <div
              key={`${notif.id}-${idx}`}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 group relative ${
                notif.read
                  ? 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/40'
                  : 'bg-slate-900 border-emerald-500/40 shadow-lg shadow-emerald-950/30'
              }`}
            >
              <div 
                onClick={() => markNotificationAsRead(notif.id)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5 cursor-pointer"
              >
                {getIcon(notif.type)}
              </div>

              <div 
                onClick={() => markNotificationAsRead(notif.id)}
                className="flex-1 min-w-0 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2 pr-6">
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

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {!notif.read && (
                  <span 
                    title="Não lida"
                    className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow shadow-emerald-400/50" 
                  />
                )}
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notif.id);
                  }}
                  title="Apagar este aviso"
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors opacity-70 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
