import React, { useState, useRef } from 'react';
import { useBolao } from '../context/BolaoContext';
import { Match } from '../types';
import { calculateMatchScore, isRoundBettingClosed, formatDeadlineShort } from '../utils/scoring';
import { formatCurrency } from '../utils/pix';
import { 
  Lock, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Flame, 
  ChevronLeft, 
  ChevronRight, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight, 
  Zap,
  Sparkles,
  HelpCircle,
  Trophy,
  PlusCircle,
  Trash2,
  Ticket
} from 'lucide-react';
import { PixPaymentModal } from './PixPaymentModal';

export const PalpitesView: React.FC = () => {
  const {
    rounds,
    selectedRoundId,
    setSelectedRoundId,
    selectedBetId,
    setSelectedBetId,
    activeRound,
    activeBet,
    userRoundBets,
    currentUser,
    createNewBetForRound,
    deleteDraftBet,
    getUserPredictionsForRound,
    updatePrediction,
    lockAndProceedToPayment
  } = useBolao();

  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [missingAlert, setMissingAlert] = useState<string | null>(null);
  const [highlightedMatchId, setHighlightedMatchId] = useState<string | null>(null);

  const predictions = getUserPredictionsForRound(selectedRoundId, activeBet?.id);

  // Check if round deadline expired or round is closed
  const roundClosedCheck = activeRound ? isRoundBettingClosed(activeRound) : { isClosed: false, reason: '' };
  const isBettingClosed = roundClosedCheck.isClosed;

  const isLocked = isBettingClosed || activeBet?.isLocked || (activeBet && activeBet.status !== 'draft');
  const betStatus = activeBet?.status || 'draft';

  // Count how many matches have been predicted
  const matchesCount = activeRound?.matches.length || 10;
  const filledCount = activeRound
    ? activeRound.matches.filter(m => {
        const p = predictions[m.id];
        return p && p.home !== null && p.home !== undefined && p.away !== null && p.away !== undefined;
      }).length
    : 0;

  const progressPercent = Math.round((filledCount / (matchesCount || 10)) * 100);

  const handleScoreChange = (matchId: string, team: 'home' | 'away', delta: number) => {
    if (isLocked) return;

    const current = predictions[matchId] || { home: 0, away: 0 };
    const currentVal = team === 'home' ? current.home ?? 0 : current.away ?? 0;
    const newVal = Math.max(0, Math.min(15, currentVal + delta));

    if (team === 'home') {
      updatePrediction(selectedRoundId, matchId, newVal, current.away ?? 0, activeBet?.id);
    } else {
      updatePrediction(selectedRoundId, matchId, current.home ?? 0, newVal, activeBet?.id);
    }
    setHighlightedMatchId(null);
    setMissingAlert(null);
  };

  const handleDirectInput = (matchId: string, team: 'home' | 'away', valStr: string) => {
    if (isLocked) return;

    const num = valStr === '' ? 0 : parseInt(valStr, 10);
    if (isNaN(num) || num < 0 || num > 20) return;

    const current = predictions[matchId] || { home: 0, away: 0 };
    if (team === 'home') {
      updatePrediction(selectedRoundId, matchId, num, current.away ?? 0, activeBet?.id);
    } else {
      updatePrediction(selectedRoundId, matchId, current.home ?? 0, num, activeBet?.id);
    }
    setHighlightedMatchId(null);
    setMissingAlert(null);
  };

  /**
   * Handle locking and proceeding to payment for current ticket.
   * If any match is missing, scrolls and jumps directly to that match.
   */
  const handleLockAndPay = () => {
    const result = lockAndProceedToPayment(selectedRoundId, activeBet?.id);

    if (!result.success) {
      setMissingAlert(result.message || 'Complete todos os 10 palpites antes de continuar!');
      if (result.missingMatchId) {
        setHighlightedMatchId(result.missingMatchId);
        const element = document.getElementById(`match-${result.missingMatchId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    } else {
      setMissingAlert(null);
      setHighlightedMatchId(null);
      setIsPixModalOpen(true);
    }
  };

  const handleCreateAnotherBet = () => {
    if (isBettingClosed) return;
    const newBet = createNewBetForRound(selectedRoundId);
    if (newBet) {
      setMissingAlert(null);
      setHighlightedMatchId(null);
    }
  };

  if (!activeRound) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Nenhuma rodada disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20 max-w-4xl mx-auto px-3 sm:px-4">
      {/* Round Selector Bar */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
          {rounds.map(r => (
            <button
              key={r.id}
              onClick={() => {
                setSelectedRoundId(r.id);
                setSelectedBetId(null);
                setMissingAlert(null);
                setHighlightedMatchId(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedRoundId === r.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/50'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span>Rodada {r.number}</span>
              {r.status === 'open' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
              {r.status === 'finished' && (
                <span className="text-[10px] opacity-80">Finalizada</span>
              )}
            </button>
          ))}
        </div>

        {/* Round Meta info */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Limite: {formatDeadlineShort(activeRound.deadline)}</span>
          </div>
          <div className="bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>{formatCurrency(activeRound.price || 10.00)} / Palpite</span>
          </div>
        </div>
      </div>

      {/* Multi-Bet Ticket Selector Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 shrink-0 mr-1">
            <Ticket className="w-4 h-4 text-emerald-400" />
            <span>Seus Bilhetes:</span>
          </div>

          {userRoundBets.length === 0 ? (
            <span className="text-xs text-slate-400 italic">
              Nenhum palpite iniciado nesta rodada.
            </span>
          ) : (
            userRoundBets.map((b, idx) => {
              const isSelected = (!selectedBetId && idx === 0) || selectedBetId === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBetId(b.id);
                    setMissingAlert(null);
                    setHighlightedMatchId(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{b.betLabel || `Palpite #${idx + 1}`}</span>
                  <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-black ${
                    b.status === 'confirmed'
                      ? isSelected ? 'bg-slate-950 text-emerald-300' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : b.status === 'receipt_submitted'
                      ? isSelected ? 'bg-slate-950 text-amber-300' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : b.status === 'locked_pending_payment'
                      ? isSelected ? 'bg-slate-950 text-blue-300' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : isSelected ? 'bg-slate-950/40 text-slate-900' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {b.status === 'confirmed' ? 'Confirmado' : b.status === 'receipt_submitted' ? 'Em Análise' : b.status === 'locked_pending_payment' ? 'Aguardando PIX' : 'Rascunho'}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Action: Create another bet button */}
        {!isBettingClosed && (
          <button
            onClick={handleCreateAnotherBet}
            className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all shrink-0 active:scale-95"
            title="Você pode fazer quantos palpites quiser! Cada bilhete concorre individualmente pelo prêmio da rodada."
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Fazer Outro Palpite (R$ 10,00)</span>
          </button>
        )}
      </div>

      {/* Warning Banner if Betting is Closed (Deadline Passed) */}
      {isBettingClosed && (
        <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 border border-red-500/50 rounded-2xl p-4 flex items-center gap-3.5 shadow-xl">
          <div className="p-2.5 bg-red-500/20 text-red-400 rounded-xl shrink-0 border border-red-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-white">
                🔒 Palpites Encerrados para esta Rodada!
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/30 text-red-300 border border-red-500/40">
                Horário Limite Atingido
              </span>
            </div>
            <p className="text-slate-300 mt-1 leading-relaxed">
              {roundClosedCheck.reason} Os palpites desta rodada foram encerrados de acordo com o horário limite configurado pelo administrador.
            </p>
          </div>
        </div>
      )}

      {/* Round Status Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/30 border border-emerald-500/20 rounded-3xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Brasileirão 2026
              </span>
              <span className="text-xs text-slate-400">• {activeRound.matches.length} Jogos Oficiais</span>
              {activeBet && (
                <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  Editando: {activeBet.betLabel || 'Palpite #1'}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1">
              {activeRound.title}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Placar Exato = <strong className="text-emerald-400">3 Pontos</strong> • Acerto de Vencedor/Empate = <strong className="text-emerald-400">1 Ponto</strong>. Preencha todos os 10 jogos para travar e pagar a taxa de R$ 10,00 via PIX.
            </p>
          </div>

          {/* Pot and Status Card */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-3 rounded-2xl shrink-0">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Prêmio da Rodada
              </span>
              <p className="text-base sm:text-lg font-black text-amber-400">
                {formatCurrency(activeRound.totalPot || 60.00)}
              </p>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Taxa de Entrada
              </span>
              <p className="text-sm font-extrabold text-white">
                R$ 10,00 (PIX)
              </p>
            </div>
          </div>
        </div>

        {/* Progress & Missing Alert Area */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-emerald-400" />
              Progresso do {activeBet?.betLabel || 'Bilhete'}:
            </span>
            <span className={`font-black ${filledCount === 10 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {filledCount} de 10 jogos preenchidos ({progressPercent}%)
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                filledCount === 10
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-md shadow-emerald-500/50'
                  : 'bg-gradient-to-r from-amber-500 to-emerald-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Missing Alert Warning */}
          {missingAlert && (
            <div className="mt-3 p-3 bg-amber-950/60 border border-amber-500/50 rounded-xl flex items-center justify-between gap-2 text-xs text-amber-200 animate-bounce">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold">{missingAlert}</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded font-bold uppercase">
                Atenção
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bet Status Card if Locked or Paid */}
      {isLocked && (
        <div className={`p-4 rounded-2xl border transition-all ${
          betStatus === 'confirmed'
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
            : betStatus === 'receipt_submitted'
            ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
            : betStatus === 'rejected'
            ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
            : 'bg-blue-950/40 border-blue-500/50 text-blue-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 shrink-0 mt-0.5">
                {betStatus === 'confirmed' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : betStatus === 'receipt_submitted' ? (
                  <Clock className="w-5 h-5 text-amber-400" />
                ) : betStatus === 'rejected' ? (
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                ) : (
                  <Lock className="w-5 h-5 text-blue-400" />
                )}
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-white">
                    {betStatus === 'confirmed' && `✅ ${activeBet?.betLabel || 'Palpite'} Confirmado e Válido!`}
                    {betStatus === 'receipt_submitted' && `⏳ ${activeBet?.betLabel || 'Palpite'} - Comprovante em Análise`}
                    {betStatus === 'rejected' && `❌ ${activeBet?.betLabel || 'Palpite'} - Comprovante Rejeitado`}
                    {betStatus === 'locked_pending_payment' && `🔒 ${activeBet?.betLabel || 'Palpite'} Travado (Pendente PIX)`}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                    {betStatus}
                  </span>
                </div>
                <p className="text-slate-300 mt-1">
                  {betStatus === 'confirmed' && 'Seus 10 palpites foram validados pelo Administrador e já estão computando no ranking. Você pode criar novos palpites adicionais quando quiser!'}
                  {betStatus === 'receipt_submitted' && 'O Administrador está analisando seu comprovante PIX no painel para confirmar sua participação.'}
                  {betStatus === 'rejected' && (activeBet?.adminNotes || 'Envie um comprovante legível para validar seus palpites.')}
                  {betStatus === 'locked_pending_payment' && 'Você travou seus 10 palpites! Pague R$ 10,00 via PIX e envie o comprovante para validar sua vaga.'}
                </p>
              </div>
            </div>

            {/* Actions for pending payment, rejected or making another bet */}
            <div className="flex items-center gap-2">
              {(betStatus === 'locked_pending_payment' || betStatus === 'rejected') && (
                <button
                  onClick={() => setIsPixModalOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl shrink-0 shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pagar PIX / Enviar Comprovante</span>
                </button>
              )}

              {betStatus === 'receipt_submitted' && (
                <button
                  onClick={() => setIsPixModalOpen(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3 py-1.5 rounded-xl shrink-0 border border-slate-700 transition-all"
                >
                  Ver Comprovante
                </button>
              )}

              {!isBettingClosed && (betStatus === 'confirmed' || betStatus === 'receipt_submitted') && (
                <button
                  onClick={handleCreateAnotherBet}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Novo Palpite</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 10 Match Cards Grid */}
      <div className="space-y-3">
        {activeRound.matches.map((match, index) => {
          const pred = predictions[match.id] || { home: null, away: null };
          const isFilled = pred.home !== null && pred.home !== undefined && pred.away !== null && pred.away !== undefined;
          const isHighlighted = highlightedMatchId === match.id;
          const isMatchFinished = match.status === 'finished';

          // Score comparison if finished
          const scoreEval = isMatchFinished && isFilled
            ? calculateMatchScore(pred.home!, pred.away!, match.homeScore, match.awayScore)
            : null;

          return (
            <div
              key={match.id}
              id={`match-${match.id}`}
              className={`bg-slate-900/90 border rounded-2xl p-3.5 sm:p-4 transition-all duration-300 relative ${
                isHighlighted
                  ? 'border-amber-400 ring-2 ring-amber-400/50 bg-amber-950/20 shadow-xl shadow-amber-950/40 scale-[1.01]'
                  : isFilled
                  ? 'border-slate-800 hover:border-slate-700'
                  : 'border-slate-800/80 bg-slate-900/40'
              }`}
            >
              {/* Match Top Bar: Index, Date, Stadium */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2.5 mb-2.5 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 font-extrabold flex items-center justify-center text-[10px] border border-slate-700">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-slate-300">{match.date}</span>
                  <span className="text-slate-500 hidden sm:inline">• {match.stadium}</span>
                </div>

                <div className="flex items-center gap-2">
                  {isMatchFinished ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Encerrado
                    </span>
                  ) : match.status === 'live' ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      Ao Vivo {match.minute || '65\''}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">
                      {isFilled ? '✅ Palpitado' : '⚠️ Pendente'}
                    </span>
                  )}

                  {/* Points Badge if finished */}
                  {scoreEval && (
                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                      scoreEval.type === 'exact'
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/40'
                        : scoreEval.type === 'outcome'
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {scoreEval.type === 'exact' && '🎯 +3 PTS (Placar Exato!)'}
                      {scoreEval.type === 'outcome' && '⚡ +1 PT (Acertou Vencedor)'}
                      {scoreEval.type === 'wrong' && '0 pts (Errou)'}
                    </span>
                  )}
                </div>
              </div>

              {/* Match Teams & Prediction Controls: Fixed 3-column layout so team names and inputs NEVER overlap */}
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 w-full">
                {/* Home Team (Mandante) */}
                <div className="min-w-0 flex flex-col items-end justify-center text-right pr-1 sm:pr-2">
                  <p className="text-xs sm:text-sm font-black text-white truncate max-w-full" title={match.homeTeam}>
                    {match.homeTeam}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-1.5 py-0.5 rounded font-mono shrink-0">
                      {match.homeTeamCode}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold hidden xs:inline">
                      Mandante
                    </span>
                  </div>
                </div>

                {/* Score / Inputs Center (Independent width) */}
                <div className="shrink-0 flex flex-col items-center justify-center bg-slate-950/90 px-2 sm:px-3.5 py-1.5 rounded-2xl border border-slate-800 shadow-inner">
                  {/* Actual Score Display if Finished/Live */}
                  {isMatchFinished || match.status === 'live' ? (
                    <div className="mb-1 flex items-center gap-1.5 bg-slate-900 px-2.5 py-0.5 rounded-xl border border-slate-700/80">
                      <span className="text-[10px] text-slate-400 font-semibold">Oficial:</span>
                      <span className="text-xs sm:text-sm font-black text-emerald-400 font-mono">
                        {match.homeScore} x {match.awayScore}
                      </span>
                    </div>
                  ) : null}

                  {/* User Prediction Inputs */}
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {/* Home Score Stepper */}
                    <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-0.5">
                      {!isLocked && (
                        <button
                          onClick={() => handleScoreChange(match.id, 'home', -1)}
                          className="w-6 h-7 sm:w-7 sm:h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-bold transition-colors"
                        >
                          -
                        </button>
                      )}
                      <input
                        type="number"
                        disabled={isLocked}
                        value={pred.home !== null && pred.home !== undefined ? pred.home : ''}
                        placeholder="-"
                        onChange={e => handleDirectInput(match.id, 'home', e.target.value)}
                        className="w-6 sm:w-8 text-center text-sm sm:text-base font-black text-emerald-300 bg-transparent focus:outline-none font-mono"
                      />
                      {!isLocked && (
                        <button
                          onClick={() => handleScoreChange(match.id, 'home', 1)}
                          className="w-6 h-7 sm:w-7 sm:h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-bold transition-colors"
                        >
                          +
                        </button>
                      )}
                    </div>

                    <span className="text-slate-500 font-black text-xs px-0.5">x</span>

                    {/* Away Score Stepper */}
                    <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-0.5">
                      {!isLocked && (
                        <button
                          onClick={() => handleScoreChange(match.id, 'away', -1)}
                          className="w-6 h-7 sm:w-7 sm:h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-bold transition-colors"
                        >
                          -
                        </button>
                      )}
                      <input
                        type="number"
                        disabled={isLocked}
                        value={pred.away !== null && pred.away !== undefined ? pred.away : ''}
                        placeholder="-"
                        onChange={e => handleDirectInput(match.id, 'away', e.target.value)}
                        className="w-6 sm:w-8 text-center text-sm sm:text-base font-black text-emerald-300 bg-transparent focus:outline-none font-mono"
                      />
                      {!isLocked && (
                        <button
                          onClick={() => handleScoreChange(match.id, 'away', 1)}
                          className="w-6 h-7 sm:w-7 sm:h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs font-bold transition-colors"
                        >
                          +
                        </button>
                      )}
                    </div>
                  </div>

                  <span className="text-[9px] sm:text-[10px] text-slate-400 mt-1 font-semibold">
                    {isLocked ? 'Palpite Travado' : 'Seu Palpite'}
                  </span>
                </div>

                {/* Away Team (Visitante) */}
                <div className="min-w-0 flex flex-col items-start justify-center text-left pl-1 sm:pl-2">
                  <p className="text-xs sm:text-sm font-black text-white truncate max-w-full" title={match.awayTeam}>
                    {match.awayTeam}
                  </p>
                  <div className="flex items-center justify-start gap-1 mt-0.5">
                    <span className="text-[10px] font-extrabold text-teal-400 bg-teal-950/70 border border-teal-800/60 px-1.5 py-0.5 rounded font-mono shrink-0">
                      {match.awayTeamCode}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold hidden xs:inline">
                      Visitante
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Action Bar */}
      <div className="sticky bottom-16 sm:bottom-4 z-30 bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-center sm:text-left">
          <p className="font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            {isBettingClosed 
              ? 'Status da Rodada:'
              : isLocked 
              ? 'Status do Palpite da Rodada:' 
              : 'Finalize seus palpites da rodada:'}
          </p>
          <p className="text-slate-400 text-[11px] mt-0.5">
            {isBettingClosed
              ? 'Os palpites desta rodada foram encerrados pelo horário limite.'
              : isLocked
              ? 'Palpites travados. Pagamento via PIX e aprovação do ADM obrigatórios.'
              : 'Obrigatório palpitar nos 10 jogos. Após travar, realize o PIX de R$ 10,00.'}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isBettingClosed ? (
            <button
              disabled
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 text-slate-400 font-bold text-xs sm:text-sm py-3 px-6 rounded-xl cursor-not-allowed border border-slate-700 opacity-80"
            >
              <Lock className="w-4 h-4 text-red-400" />
              <span>Horário Limite Atingido (Palpites Fechados)</span>
            </button>
          ) : !isLocked ? (
            <button
              onClick={handleLockAndPay}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm py-3 px-6 rounded-xl shadow-xl shadow-emerald-950/80 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>Travar 10 Palpites & Pagar PIX (R$ 10,00)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsPixModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-lg transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Gerenciar Pagamento PIX / Comprovante</span>
            </button>
          )}
        </div>
      </div>

      {/* Pix Payment Modal */}
      <PixPaymentModal
        isOpen={isPixModalOpen}
        onClose={() => setIsPixModalOpen(false)}
        betId={activeBet?.id}
      />
    </div>
  );
};
