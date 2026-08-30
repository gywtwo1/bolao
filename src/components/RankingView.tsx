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
  Award
} from 'lucide-react';

export const RankingView: React.FC = () => {
  const { getGlobalRanking, getRoundRanking, rounds, selectedRoundId, currentUser } = useBolao();
  const [rankingType, setRankingType] = useState<'global' | 'round'>('global');
  const [targetRoundId, setTargetRoundId] = useState<number>(1); // Default to Round 1 (finished with real scores)

  const globalRanking = getGlobalRanking();
  const roundRanking = getRoundRanking(targetRoundId);

  const activeList = rankingType === 'global' ? globalRanking : roundRanking;

  const top1 = activeList[0];
  const top2 = activeList[1];
  const top3 = activeList[2];

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
                Ranking Oficial Brasileirão 2026
              </h2>
              <p className="text-xs text-slate-400">
                Critérios: <strong className="text-emerald-400">Placar Exato (3 pts)</strong> • <strong className="text-amber-400">Acerto Resultado (1 pt)</strong>
              </p>
            </div>
          </div>

          {/* Toggle Type */}
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 shrink-0">
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
            <button
              onClick={() => setRankingType('round')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                rankingType === 'round'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Por Rodada
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
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  targetRoundId === r.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/50'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {r.title.split('-')[0]}
              </button>
            ))}
          </div>
        )}
      </div>

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
              <div className="mt-2 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 w-full">
                <span className="text-sm sm:text-base font-black text-slate-200">{top2.totalPoints}</span>
                <span className="text-[10px] text-slate-400 ml-1">pts</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                🎯 {top2.exactHits} exatos
              </div>
            </div>
          )}

          {/* 1st Place (Champion) */}
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
            Classificação Completa ({activeList.length} Participantes)
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
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs sm:text-sm font-bold text-white truncate">
                          {entry.name}
                        </p>
                        {isCurrentUser && (
                          <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            Você
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{entry.favoriteTeam}</span>
                        <span>•</span>
                        <span>{entry.roundsCount} {entry.roundsCount === 1 ? 'rodada' : 'rodadas'}</span>
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
          Como funciona a pontuação do Bolão Brasileirão 2026:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-400">
          <li><strong>Placar Exato (3 pontos):</strong> Quando você acerta na mosca o resultado exato dos dois times (Ex: Palpite 2x1 e resultado 2x1).</li>
          <li><strong>Acerto de Resultado (1 ponto):</strong> Quando você acerta quem venceu ou empate, mas errou o número de gols (Ex: Palpite 3x1 e resultado 2x0).</li>
          <li><strong>Critérios de Desempate:</strong> 1º Maior número de pontos totais, 2º Mais placares exatos, 3º Mais acertos de resultado, 4º Ordem alfabética.</li>
        </ul>
      </div>
    </div>
  );
};
