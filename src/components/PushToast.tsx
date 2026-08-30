import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCircle2, AlertTriangle, Trophy, X, ShieldAlert } from 'lucide-react';
import { useBolao } from '../context/BolaoContext';

export const PushToast: React.FC = () => {
  const { pushToast, clearPushToast } = useBolao();

  if (!pushToast) return null;

  const getIcon = () => {
    switch (pushToast.type) {
      case 'payment_confirmed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'payment_rejected':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'results_ready':
      case 'stats_update':
        return <Trophy className="w-5 h-5 text-yellow-400 shrink-0" />;
      case 'round_open':
        return <Bell className="w-5 h-5 text-blue-400 shrink-0" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed top-4 left-4 right-4 max-w-md mx-auto z-50 pointer-events-auto"
      >
        <div className="bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 shadow-2xl shadow-emerald-950/50 rounded-2xl p-3.5 flex items-start gap-3">
          <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/60 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Notificação Push
              </span>
              <span className="text-[10px] text-slate-400">Agora</span>
            </div>
            <h4 className="text-sm font-bold text-white truncate mt-0.5">{pushToast.title}</h4>
            <p className="text-xs text-slate-300 line-clamp-2 mt-0.5 leading-relaxed">
              {pushToast.message}
            </p>
          </div>
          <button
            onClick={clearPushToast}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
