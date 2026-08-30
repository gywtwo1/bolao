import React, { useState } from 'react';
import { useBolao } from '../context/BolaoContext';
import { calculateMatchScore } from '../utils/scoring';
import { 
  History, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Trophy, 
  Target, 
  ShieldCheck, 
  FileText,
  DollarSign
} from 'lucide-react';
import { formatCurrency } from '../utils/pix';

export const HistoryView: React.FC = () => {
  const { bets, rounds, currentUser } = useBolao();
  const [expandedBetId, setExpandedBetId] = useState<string | null>(null);

  const userBets = bets.filter(b => b.userId === currentUser?.id);

  const toggleExpand = (betId: string) => {
    setExpandedBetId(prev => (prev === betId ? null : betId));
  };

  return (
    <div className="space-y-4 pb-20 max-w-4xl mx-auto px-3 sm:px-4">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              Histórico de Apostas e Palpites
            </h2>
            <p className="text-xs text-slate-400">
              Consulte seus palpites anteriores, pontuações detalhadas jogo a jogo e status dos pagamentos PIX.
            </p>
          </div>
        </div>
      </div>

      {userBets.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Nenhum palpite registrado ainda</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Você ainda não enviou palpites nas rodadas disponíveis. Vá para a aba <strong>Palpites</strong> para palpitar nos 10 jogos da rodada atual!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {userBets.map(bet => {
            const round = rounds.find(r => r.id === bet.roundId);
            const isExpanded = expandedBetId === bet.id;

            return (
              <div
                key={bet.id}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl transition-all"
              >
                {/* Bet Summary Header */}
                <div
                  onClick={() => toggleExpand(bet.id)}
                  className="p-4 sm:p-5 cursor-pointer hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                      {bet.status === 'confirmed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : bet.status === 'receipt_submitted' ? (
                        <Clock className="w-5 h-5 text-amber-400" />
                      ) : bet.status === 'rejected' ? (
                        <AlertTriangle className="w-5 h-5 text-rose-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-black text-white">
                          {round?.title || `Rodada ${bet.roundId}`}
                        </h3>
                        <span
                          className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${
                            bet.status === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : bet.status === 'receipt_submitted'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : bet.status === 'rejected'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          }`}
                        >
                          {bet.status === 'confirmed' && 'Confirmado (Válido)'}
                          {bet.status === 'receipt_submitted' && 'Comprovante em Análise'}
                          {bet.status === 'rejected' && 'Comprovante Rejeitado'}
                          {bet.status === 'locked_pending_payment' && 'Aguardando Pagamento PIX'}
                          {bet.status === 'draft' && 'Rascunho'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Palpitado em {new Date(bet.createdAt).toLocaleDateString('pt-BR')} • 10 Jogos
                      </p>
                    </div>
                  </div>

                  {/* Right Score & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                    {bet.status === 'confirmed' && round?.status === 'finished' && (
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            🎯 {bet.exactHitsCount || 0} exatos • ⚡ {bet.outcomeHitsCount || 0} vencedores
                          </span>
                          <span className="text-xs font-semibold text-emerald-400">
                            Pontuação Final
                          </span>
                        </div>
                        <div className="bg-emerald-950/80 border border-emerald-500/40 px-3.5 py-1.5 rounded-2xl text-center">
                          <span className="text-lg font-black text-emerald-300">
                            {bet.calculatedPoints || 0}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-bold ml-1">pts</span>
                        </div>
                      </div>
                    )}

                    <button className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Detailed 10 Matches Breakdown */}
                {isExpanded && round && (
                  <div className="p-4 sm:p-5 bg-slate-950/60 border-t border-slate-800 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                      <span>Detalhamento dos 10 Jogos:</span>
                      <span className="text-slate-400 font-normal">
                        Verifique seus acertos e pontuações
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {round.matches.map((match, idx) => {
                        const pred = bet.predictions[match.id] || { home: 0, away: 0 };
                        const isFinished = match.status === 'finished';
                        const scoreRes = isFinished
                          ? calculateMatchScore(pred.home, pred.away, match.homeScore, match.awayScore)
                          : null;

                        return (
                          <div
                            key={match.id}
                            className="bg-slate-900 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate">
                                  {match.homeTeamCode} x {match.awayTeamCode}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  Seu palpite: <strong className="text-emerald-400 font-mono">{pred.home} x {pred.away}</strong>
                                </p>
                              </div>
                            </div>

                            {/* Score & Points */}
                            <div className="text-right shrink-0">
                              {isFinished ? (
                                <div className="space-y-0.5">
                                  <div className="text-[11px] font-black text-slate-300 font-mono">
                                    Oficial: {match.homeScore} x {match.awayScore}
                                  </div>
                                  <span
                                    className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                                      scoreRes?.type === 'exact'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                        : scoreRes?.type === 'outcome'
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                        : 'bg-slate-800 text-slate-400'
                                    }`}
                                  >
                                    {scoreRes?.type === 'exact' && '+3 PTS (Placar Exato)'}
                                    {scoreRes?.type === 'outcome' && '+1 PT (Resultado)'}
                                    {scoreRes?.type === 'wrong' && '0 pts (Errou)'}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-500 font-medium">
                                  Aguardando Jogo
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Receipt Attachment details */}
                    {bet.receiptUrl && (
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-slate-400">
                          <FileText className="w-4 h-4 text-emerald-400" />
                          <span>Comprovante PIX anexado em {new Date(bet.receiptUploadedAt || bet.createdAt).toLocaleString('pt-BR')}</span>
                        </div>
                        <a
                          href={bet.receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 font-bold underline inline-flex items-center gap-1"
                        >
                          Visualizar Comprovante
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
