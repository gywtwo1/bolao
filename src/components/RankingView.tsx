import React, { useState } from 'react';
import { useBolao } from '../context/BolaoContext';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Target, 
  CheckCircle2, 
  Flame, 
  ChevronRight, 
  Users,
  Award,
  Sparkles,
  Ticket
} from 'lucide-react';
import { formatCurrency } from '../utils/pix';

export const RankingView: React.FC = () => {
  const { getGlobalRanking, getRoundRanking, rounds, selectedRoundId, currentUser } = useBolao();
  const [rankingType, setRankingType] = useState<'round' | 'global'>('round'); // Default to Round mode per user requirement
  const [targetRoundId, setTargetRoundId] = useState<number>(selectedRoundId || 1);

  const globalRanking = getGlobalRanking();
  const roundRanking = getRoundRanking(targetRoundId);

  const activeList = rankingType === 'global' ? globalRanking : roundRanking;
  const currentRoundObj = rounds.find(r => r.id === targetRoundId) || rounds[0];

  const top1 = activeList[0];
  const top2 = activeList[1];
  const top3 = activeList[2];

  const isRoundFinished = currentRoundObj?.status === 'finished';

  return (
    <div className="space-y-5 pb-20 max-w-4xl mx-auto px-3 sm:px-4">
      {/* Header & Mode Switcher */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                Ranking & Ganhador do Bolão
              </h2>
              <p className="text-xs text-slate-400">
                Critérios: <strong className="text-emerald-400">Placar Exato (3 pts)</strong> • <strong className="text-amber-400">Acerto Resultado (1 pt)</strong>
              </p>
            </div>
          </div>

          {/* Toggle Type */}
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setRankingType('round')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                rankingType === 'round'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🏆 Ganhador da Rodada
            </button>
            <button
              onClick={() => setRankingType('global')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                rankingType === 'global'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Geral Acumulado
            </button>
          </div>
        </div>

        {/* Round Filter if in 'round' mode */}
        {rankingType === 'round' && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-xs font-bold text-slate-400 shrink-0">Filtrar Rodada:</span>
            {rounds.map(r => (
              <button
                key={r.id}
                onClick={() => setTargetRoundId(r.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  targetRoundId === r.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/50'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{r.title.split('-')[0]}</span>
                {r.status === 'finished' && (
                  <span className="text-[9px] bg-slate-950/40 px-1 py-0.2 rounded">Encerrada</span>
                )}
                {r.status === 'open' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dedicated Spotlight Card: Ganhador da Rodada */}
      {rankingType === 'round' && top1 && (
        <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-emerald-950/60 border-2 border-amber-400/70 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
              {/* Champion Avatar & Crown */}
              <div className="relative shrink-0">
                <Crown className="w-8 h-8 text-amber-400 absolute -top-5 left-1/2 -translate-x-1/2 animate-bounce drop-shadow" />
                <img
                  src={top1.avatar}
                  alt={top1.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-amber-400 shadow-2xl bg-slate-800 ring-4 ring-amber-500/30"
                />
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
                  1º Lugar
                </div>
              </div>

              {/* Champion Details */}
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {isRoundFinished ? 'Ganhador Oficial da Rodada' : 'Líder Atual da Rodada'}
                  </span>
                  {top1.bestBetLabel && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                      <Ticket className="w-3 h-3 text-emerald-400" />
                      {top1.bestBetLabel}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5">
                  {top1.name}
                </h3>
                <p className="text-xs text-slate-300 flex items-center justify-center md:justify-start gap-2 mt-0.5">
                  <span>Torce para <strong className="text-amber-300">{top1.favoriteTeam}</strong></span>
                  <span>•</span>
                  <span>{currentRoundObj?.title}</span>
                </p>

                <p className="text-[11px] text-slate-400 mt-2 max-w-md leading-relaxed">
                  {isRoundFinished 
                    ? 'Rodada finalizada! O usuário que somou mais pontos conquistou o troféu e o prêmio da rodada.' 
                    : 'O usuário que tiver mais pontos até o final da rodada ficará como ganhador oficial da rodada e levará o prêmio acumulado!'}
                </p>
              </div>
            </div>

            {/* Score & Pot Highlights */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-slate-950/90 border border-amber-400/40 px-4 py-3 rounded-2xl text-center shadow-lg">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                  Pontuação
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {top1.totalPoints}
                </span>
                <span className="text-[10px] text-slate-400 font-bold ml-1">pts</span>
                <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                  🎯 {top1.exactHits} placares exatos
                </div>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 px-4 py-3 rounded-2xl text-center shadow-lg">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  {isRoundFinished ? 'Prêmio Conquistado' : 'Prêmio Estimado'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-amber-300">
                  {formatCurrency(currentRoundObj?.totalPot || 60.00)}
                </span>
                <span className="text-[10px] text-emerald-400 block font-bold mt-0.5">
                  {isRoundFinished ? '🏆 Pago via PIX' : '💰 Bolão da Rodada'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium */}
      {activeList.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4 pb-2">
          {/* 2nd Place */}
          {top2 && (
            <div className="bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-800/40 border border-slate-700/60 rounded-3xl p-3 sm:p-4 text-center flex flex-col items-center relative shadow-lg">
              <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center absolute -top-3 shadow">
                2º
              </div>
              <img
                src={top2.avatar}
                alt={top2.name}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-slate-400 shadow-md mb-2 mt-2 bg-slate-800"
              />
              <h4 className="text-xs sm:text-sm font-extrabold text-white truncate max-w-full">
                {top2.name.split(' ')[0]}
              </h4>
              <span className="text-[10px] text-slate-400 truncate">{top2.favoriteTeam}</span>
              {top2.bestBetLabel && (
                <span className="text-[9px] text-emerald-400 font-mono mt-0.5 truncate">{top2.bestBetLabel}</span>
              )}
              <div className="mt-2 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 w-full">
                <span className="text-sm sm:text-base font-black text-slate-200">{top2.totalPoints}</span>
                <span className="text-[10px] text-slate-400 ml-1">pts</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                🎯 {top2.exactHits} exatos
              </div>
            </div>
          )}

          {/* 1st Place (Champion - Spotlights highest score) */}
          {top1 && (
            <div className="bg-gradient-to-t from-emerald-950/80 via-slate-900 to-amber-950/30 border-2 border-amber-400/60 rounded-3xl p-3 sm:p-4 text-center flex flex-col items-center relative shadow-2xl shadow-amber-500/10 -translate-y-2">
              <Crown className="w-6 h-6 text-amber-400 absolute -top-4 animate-bounce" />
              <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center absolute -top-3 shadow-lg shadow-amber-500/50">
                1º
              </div>
              <img
                src={top1.avatar}
                alt={top1.name}
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-xl mb-2 mt-3 bg-slate-800 ring-4 ring-amber-400/20"
              />
              <h4 className="text-xs sm:text-base font-black text-white truncate max-w-full">
                {top1.name.split(' ')[0]}
              </h4>
              <span className="text-[10px] sm:text-xs text-amber-300 font-semibold truncate">{top1.favoriteTeam}</span>
              {top1.bestBetLabel && (
                <span className="text-[10px] text-emerald-300 font-mono mt-0.5 font-bold">{top1.bestBetLabel}</span>
              )}
              <div className="mt-2 bg-amber-500/20 px-3 py-1 rounded-xl border border-amber-400/40 w-full">
                <span className="text-base sm:text-xl font-black text-amber-300">{top1.totalPoints}</span>
                <span className="text-xs text-amber-400 font-bold ml-1">pts</span>
              </div>
              <div className="text-[10px] sm:text-xs text-emerald-400 font-bold mt-1.5 flex items-center gap-1 justify-center">
                <Target className="w-3 h-3" />
                <span>{top1.exactHits} placares exatos</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3 && (
            <div className="bg-gradient-to-t from-slate-900 via-slate-900/90 to-amber-950/20 border border-amber-700/40 rounded-3xl p-3 sm:p-4 text-center flex flex-col items-center relative shadow-lg">
              <div className="w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center absolute -top-3 shadow">
                3º
              </div>
              <img
                src={top3.avatar}
                alt={top3.name}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-amber-700 shadow-md mb-2 mt-2 bg-slate-800"
              />
              <h4 className="text-xs sm:text-sm font-extrabold text-white truncate max-w-full">
                {top3.name.split(' ')[0]}
              </h4>
              <span className="text-[10px] text-slate-400 truncate">{top3.favoriteTeam}</span>
              {top3.bestBetLabel && (
                <span className="text-[9px] text-emerald-400 font-mono mt-0.5 truncate">{top3.bestBetLabel}</span>
              )}
              <div className="mt-2 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 w-full">
                <span className="text-sm sm:text-base font-black text-slate-200">{top3.totalPoints}</span>
                <span className="text-[10px] text-slate-400 ml-1">pts</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                🎯 {top3.exactHits} exatos
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            Classificação {rankingType === 'round' ? `da ${currentRoundObj?.title || 'Rodada'}` : 'Geral Acumulada'} ({activeList.length} Participantes)
          </span>
          <span className="text-[11px] text-slate-400">
            Atualizado automaticamente
          </span>
        </div>

        {activeList.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Nenhum palpite confirmado para esta rodada ainda.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {activeList.map(entry => {
              const isCurrentUser = entry.userId === currentUser?.id;

              return (
                <div
                  key={entry.userId}
                  className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                    isCurrentUser
                      ? 'bg-emerald-950/40 hover:bg-emerald-950/60 border-l-4 border-emerald-400'
                      : entry.isRoundWinner && rankingType === 'round'
                      ? 'bg-amber-950/20 border-l-4 border-amber-400'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  {/* Left: Position & User Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                        entry.position === 1
                          ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/40'
                          : entry.position === 2
                          ? 'bg-slate-300 text-slate-950'
                          : entry.position === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {entry.position}º
                    </span>

                    <img
                      src={entry.avatar}
                      alt={entry.name}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border border-slate-700 bg-slate-800 shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-xs sm:text-sm font-bold text-white truncate">
                          {entry.name}
                        </p>
                        {isCurrentUser && (
                          <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            Você
                          </span>
                        )}
                        {entry.position === 1 && rankingType === 'round' && (
                          <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                            <Crown className="w-3 h-3 text-amber-400" />
                            Ganhador da Rodada
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                        <span>{entry.favoriteTeam}</span>
                        {entry.bestBetLabel && rankingType === 'round' && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400 font-mono font-medium">{entry.bestBetLabel}</span>
                          </>
                        )}
                        {rankingType === 'global' && (
                          <>
                            <span>•</span>
                            <span>{entry.roundsCount} {entry.roundsCount === 1 ? 'rodada' : 'rodadas'}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Scores Breakdown */}
                  <div className="flex items-center gap-3 sm:gap-6 shrink-0 text-right">
                    {/* Exact Hits Count */}
                    <div className="hidden sm:block">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Placar Exato (3 pts)
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        {entry.exactHits}x ({entry.exactHits * 3} pts)
                      </span>
                    </div>

                    {/* Outcome Hits Count */}
                    <div className="hidden sm:block">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Vencedor (1 pt)
                      </span>
                      <span className="text-xs font-bold text-amber-400">
                        {entry.outcomeHits}x ({entry.outcomeHits} pts)
                      </span>
                    </div>

                    {/* Total Points */}
                    <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 min-w-[70px] text-center">
                      <span className="text-base sm:text-lg font-black text-emerald-300 block leading-tight">
                        {entry.totalPoints}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-slate-400">
                        PONTOS
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rules Explainer Card */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-400 space-y-1.5">
        <p className="font-bold text-slate-300 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-emerald-400" />
          Regras de Premiação e Ganhador da Rodada:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-400">
          <li><strong>Ganhador da Rodada:</strong> O usuário que somar mais pontos até o final de todos os jogos da rodada é o vencedor e leva a premiação do bolão.</li>
          <li><strong>Múltiplos Palpites:</strong> Cada participante pode fazer quantos bilhetes quiser por rodada (R$ 10,00 cada). No ranking oficial, é computado o bilhete de maior pontuação do usuário.</li>
          <li><strong>Pontuação:</strong> 3 pontos por Placar Exato cravado e 1 ponto por acerto de Vencedor/Empate.</li>
          <li><strong>Critérios de Desempate:</strong> 1º Maior número de pontos totais, 2º Mais placares exatos, 3º Mais acertos de resultado.</li>
        </ul>
      </div>
    </div>
  );
};
