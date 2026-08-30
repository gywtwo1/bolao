import React, { useState } from 'react';
import { useBolao } from '../context/BolaoContext';
import { BRASILEIRAO_TEAMS } from '../data/teams';
import { Match, Round } from '../types';
import { formatCurrency } from '../utils/pix';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  Trash2, 
  RefreshCw, 
  FileText, 
  Eye, 
  Trophy, 
  Clock, 
  Zap, 
  DollarSign, 
  AlertTriangle,
  Calendar,
  Sparkles,
  Search
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    rounds,
    bets,
    selectedRoundId,
    adminApproveBet,
    adminRejectBet,
    adminCreateRound,
    adminDeleteRound,
    adminUpdateMatchScore,
    adminSyncSportsApiScores,
    adminFinalizeRound
  } = useBolao();

  const [adminTab, setAdminTab] = useState<'comprovantes' | 'rodadas' | 'placares'>('comprovantes');
  const [rejectReason, setRejectReason] = useState<{ [betId: string]: string }>({});
  const [selectedReceiptPreview, setSelectedReceiptPreview] = useState<string | null>(null);
  const [isSyncingApi, setIsSyncingApi] = useState(false);
  const [activeAdminRoundId, setActiveAdminRoundId] = useState<number>(selectedRoundId);

  // New Round Creation State
  const [newRoundNumber, setNewRoundNumber] = useState<number>(rounds.length + 1);
  const [newRoundTitle, setNewRoundTitle] = useState<string>(`${rounds.length + 1}ª Rodada - Brasileirão 2026`);
  const [newRoundPrice, setNewRoundPrice] = useState<number>(10.00);
  const [newRoundDeadline, setNewRoundDeadline] = useState<string>('2026-04-26T16:00');
  
  // 10 matches for new round
  const [newMatches, setNewMatches] = useState<Omit<Match, 'id' | 'roundId' | 'homeScore' | 'awayScore' | 'status'>[]>([
    { homeTeam: 'Flamengo', homeTeamCode: 'FLA', homeTeamLogo: BRASILEIRAO_TEAMS[0].logo, awayTeam: 'Corinthians', awayTeamCode: 'COR', awayTeamLogo: BRASILEIRAO_TEAMS[3].logo, date: '26/04 • 16:00', stadium: 'Maracanã (RJ)' },
    { homeTeam: 'Palmeiras', homeTeamCode: 'PAL', homeTeamLogo: BRASILEIRAO_TEAMS[1].logo, awayTeam: 'São Paulo', awayTeamCode: 'SAO', awayTeamLogo: BRASILEIRAO_TEAMS[2].logo, date: '26/04 • 16:00', stadium: 'Allianz Parque (SP)' },
    { homeTeam: 'Grêmio', homeTeamCode: 'GRE', homeTeamLogo: BRASILEIRAO_TEAMS[6].logo, awayTeam: 'Internacional', awayTeamCode: 'INT', awayTeamLogo: BRASILEIRAO_TEAMS[7].logo, date: '26/04 • 18:30', stadium: 'Arena do Grêmio (RS)' },
    { homeTeam: 'Atlético-MG', homeTeamCode: 'CAM', homeTeamLogo: BRASILEIRAO_TEAMS[4].logo, awayTeam: 'Cruzeiro', awayTeamCode: 'CRU', awayTeamLogo: BRASILEIRAO_TEAMS[5].logo, date: '26/04 • 18:30', stadium: 'Arena MRV (MG)' },
    { homeTeam: 'Fluminense', homeTeamCode: 'FLU', homeTeamLogo: BRASILEIRAO_TEAMS[9].logo, awayTeam: 'Vasco da Gama', awayTeamCode: 'VAS', awayTeamLogo: BRASILEIRAO_TEAMS[10].logo, date: '26/04 • 19:00', stadium: 'Maracanã (RJ)' },
    { homeTeam: 'Botafogo', homeTeamCode: 'BOT', homeTeamLogo: BRASILEIRAO_TEAMS[8].logo, awayTeam: 'Bahia', awayTeamCode: 'BAH', awayTeamLogo: BRASILEIRAO_TEAMS[11].logo, date: '27/04 • 16:00', stadium: 'Nilton Santos (RJ)' },
    { homeTeam: 'Santos', homeTeamCode: 'SAN', homeTeamLogo: BRASILEIRAO_TEAMS[14].logo, awayTeam: 'Athletico-PR', awayTeamCode: 'CAP', awayTeamLogo: BRASILEIRAO_TEAMS[13].logo, date: '27/04 • 16:00', stadium: 'Vila Belmiro (SP)' },
    { homeTeam: 'Fortaleza', homeTeamCode: 'FOR', homeTeamLogo: BRASILEIRAO_TEAMS[12].logo, awayTeam: 'Vitória', awayTeamCode: 'VIT', awayTeamLogo: BRASILEIRAO_TEAMS[16].logo, date: '27/04 • 18:30', stadium: 'Arena Castelão (CE)' },
    { homeTeam: 'Red Bull Bragantino', homeTeamCode: 'RBB', homeTeamLogo: BRASILEIRAO_TEAMS[15].logo, awayTeam: 'Juventude', awayTeamCode: 'JUV', awayTeamLogo: BRASILEIRAO_TEAMS[17].logo, date: '27/04 • 18:30', stadium: 'Nabi Abi Chedid (SP)' },
    { homeTeam: 'Sport Recife', homeTeamCode: 'SPO', homeTeamLogo: BRASILEIRAO_TEAMS[19].logo, awayTeam: 'Criciúma', awayTeamCode: 'CRI', awayTeamLogo: BRASILEIRAO_TEAMS[18].logo, date: '27/04 • 20:00', stadium: 'Ilha do Retiro (PE)' }
  ]);

  const targetRound = rounds.find(r => r.id === activeAdminRoundId) || rounds[0];

  // Filter bets needing review
  const pendingReceiptBets = bets.filter(b => b.status === 'receipt_submitted');
  const allOtherBets = bets.filter(b => b.status !== 'receipt_submitted');

  const handleSyncApi = async () => {
    if (!targetRound) return;
    setIsSyncingApi(true);
    try {
      await adminSyncSportsApiScores(targetRound.id);
    } finally {
      setIsSyncingApi(false);
    }
  };

  const handleCreateRoundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMatches.length !== 10) {
      alert('A rodada precisa ter exatamente 10 jogos!');
      return;
    }

    const formattedMatches: Match[] = newMatches.map((m, idx) => ({
      ...m,
      id: `r${newRoundNumber}-m${idx + 1}`,
      roundId: newRoundNumber,
      homeScore: null,
      awayScore: null,
      status: 'scheduled'
    }));

    adminCreateRound({
      number: newRoundNumber,
      title: newRoundTitle,
      season: '2026',
      price: newRoundPrice,
      status: 'open',
      deadline: newRoundDeadline,
      matches: formattedMatches
    });

    alert('Nova rodada criada com sucesso com 10 jogos e aberta para palpites!');
    setAdminTab('rodadas');
  };

  const handleMatchTeamChange = (index: number, teamType: 'home' | 'away', teamName: string) => {
    const foundTeam = BRASILEIRAO_TEAMS.find(t => t.name === teamName);
    if (!foundTeam) return;

    setNewMatches(prev => {
      const copy = [...prev];
      if (teamType === 'home') {
        copy[index] = {
          ...copy[index],
          homeTeam: foundTeam.name,
          homeTeamCode: foundTeam.code,
          homeTeamLogo: foundTeam.logo,
          stadium: `${foundTeam.stadium} (${foundTeam.city.slice(0, 2).toUpperCase()})`
        };
      } else {
        copy[index] = {
          ...copy[index],
          awayTeam: foundTeam.name,
          awayTeamCode: foundTeam.code,
          awayTeamLogo: foundTeam.logo
        };
      }
      return copy;
    });
  };

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto px-3 sm:px-4">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Painel de Administração do Bolão
                </h2>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                  ADM
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Gerencie comprovantes PIX, crie rodadas com 10 jogos, sincronize placares via API e compute o ranking.
              </p>
            </div>
          </div>

          {/* Quick Round Selector for Admin */}
          {rounds.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
              <span className="text-[10px] font-bold text-slate-400 pl-2">Rodada:</span>
              <select
                value={activeAdminRoundId}
                onChange={e => setActiveAdminRoundId(Number(e.target.value))}
                className="bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-xl border border-slate-700 focus:outline-none"
              >
                {rounds.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.title.split('-')[0]} ({r.status})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Sub-tabs */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2">
          <button
            onClick={() => setAdminTab('comprovantes')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              adminTab === 'comprovantes'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/60'
                : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Aprovar PIX ({pendingReceiptBets.length})</span>
            {pendingReceiptBets.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                adminTab === 'comprovantes' ? 'bg-slate-950 text-amber-400' : 'bg-amber-500 text-slate-950 animate-pulse'
              }`}>
                {pendingReceiptBets.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('rodadas')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              adminTab === 'rodadas'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/60'
                : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Criar / Gerenciar Rodadas</span>
          </button>

          <button
            onClick={() => setAdminTab('placares')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              adminTab === 'placares'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/60'
                : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>API & Placares Oficiais</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: APROVAÇÃO DE COMPROVANTES PIX (TELA DO ADM ACEITAR) */}
      {/* ======================================================== */}
      {adminTab === 'comprovantes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                Fila de Comprovantes PIX Pendentes de Validação
              </h3>
              <p className="text-xs text-slate-400">
                O usuário precisa ter o comprovante aprovado para que seus 10 palpites contem na pontuação e no ranking.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
              {pendingReceiptBets.length} aguardando análise
            </span>
          </div>

          {pendingReceiptBets.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-10 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Tudo em dia!</h4>
              <p className="text-xs text-slate-400">
                Não há nenhum comprovante de pagamento PIX pendente de aprovação no momento.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingReceiptBets.map(bet => {
                const betRound = rounds.find(r => r.id === bet.roundId);
                const predictionsCount = Object.keys(bet.predictions).length;

                return (
                  <div
                    key={bet.id}
                    className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4"
                  >
                    {/* User & Bet Info Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <img
                          src={bet.userAvatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                          alt={bet.userName}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-700 bg-slate-800"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-black text-white">{bet.userName}</h4>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              Pendente ADM
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            {bet.userEmail} • {betRound?.title || `Rodada ${bet.roundId}`} • Taxa: <strong className="text-emerald-400">R$ 10,00</strong>
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Enviado em {new Date(bet.receiptUploadedAt || bet.createdAt).toLocaleString('pt-BR')} • {predictionsCount} palpites registrados
                          </p>
                        </div>
                      </div>

                      {/* View Predictions Summary */}
                      <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          10 Palpites Travados:
                        </span>
                        <span className="font-mono text-emerald-400 font-bold">
                          {predictionsCount} de 10 jogos preenchidos
                        </span>
                      </div>
                    </div>

                    {/* Receipt Preview & Decision Zone */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Left: Receipt Preview Image */}
                      <div className="md:col-span-5 bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col items-center">
                        <span className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          Comprovante Anexado pelo Usuário:
                        </span>
                        <div
                          onClick={() => setSelectedReceiptPreview(bet.receiptUrl || null)}
                          className="cursor-pointer group relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900 max-h-48 w-full flex items-center justify-center"
                        >
                          <img
                            src={bet.receiptUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80'}
                            alt="Comprovante PIX"
                            className="h-44 object-contain group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-white">
                            Clique para Ampliar
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="md:col-span-7 space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-300">
                            Motivo / Observação (caso rejeitar):
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Comprovante ilegível, valor diferente de R$ 10,00..."
                            value={rejectReason[bet.id] || ''}
                            onChange={e => setRejectReason({ ...rejectReason, [bet.id]: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          <button
                            onClick={() => {
                              adminApproveBet(bet.id);
                              alert(`Palpite de ${bet.userName} APROVADO com sucesso! R$ 10,00 adicionados ao pote da rodada.`);
                            }}
                            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3 px-4 rounded-xl shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02]"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Confirmar Palpite (Aceitar)</span>
                          </button>

                          <button
                            onClick={() => {
                              const reason = rejectReason[bet.id] || 'Comprovante ilegível ou valor incorreto.';
                              adminRejectBet(bet.id, reason);
                              alert(`Comprovante de ${bet.userName} REJEITADO com notificação enviada.`);
                            }}
                            className="flex items-center justify-center gap-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs py-3 px-4 rounded-xl transition-all"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Rejeitar Comprovante</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* History of other approved/rejected bets */}
          <div className="mt-8 pt-4 border-t border-slate-800">
            <h4 className="text-sm font-bold text-slate-300 mb-3">
              Histórico de Palpites Já Processados ({allOtherBets.length})
            </h4>
            <div className="divide-y divide-slate-800/80 bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden text-xs">
              {allOtherBets.map(b => (
                <div key={b.id} className="p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img src={b.userAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                    <div>
                      <span className="font-bold text-white">{b.userName}</span>
                      <span className="text-slate-400 ml-2">Rodada {b.roundId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : b.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {b.status === 'confirmed' ? '✅ Aprovado' : b.status === 'rejected' ? '❌ Rejeitado' : b.status}
                    </span>
                    {b.calculatedPoints !== undefined && (
                      <span className="font-bold text-emerald-400">{b.calculatedPoints} pts</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CRIAR / GERENCIAR RODADAS (10 JOGOS, DELETAR RODADA) */}
      {/* ======================================================== */}
      {adminTab === 'rodadas' && (
        <div className="space-y-6">
          {/* Active Rounds Management List */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              Rodadas Ativas no Sistema ({rounds.length})
            </h3>
            <p className="text-xs text-slate-400">
              O Administrador pode excluir rodadas para que não fiquem visíveis na tela de palpites dos usuários.
            </p>

            <div className="space-y-2.5 pt-2">
              {rounds.map(r => (
                <div
                  key={r.id}
                  className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-white">{r.title}</h4>
                      <span
                        className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded ${
                          r.status === 'open'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : r.status === 'finished'
                            ? 'bg-slate-800 text-slate-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {r.status === 'open' ? '🟢 Aberta' : r.status === 'finished' ? 'Finalizada' : r.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      10 Jogos • Taxa: {formatCurrency(r.price)} • Pote Acumulado: <strong className="text-amber-400">{formatCurrency(r.totalPot)}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adminFinalizeRound(r.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
                    >
                      {r.status === 'finished' ? 'Recalcular Pontos' : 'Finalizar Rodada'}
                    </button>

                    {/* Delete Round Button */}
                    <button
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja deletar a "${r.title}"? Ela será removida da tela de palpites de todos os usuários.`)) {
                          adminDeleteRound(r.id);
                        }
                      }}
                      className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl transition-colors"
                      title="Deletar Rodada da Tela de Palpites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form to Create New Round */}
          <form
            onSubmit={handleCreateRoundSubmit}
            className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-400" />
                  Criar Nova Rodada Oficial (10 Jogos)
                </h3>
                <p className="text-xs text-slate-400">
                  Configure o número da rodada, valor da aposta (R$ 10,00) e os 10 confrontos do Brasileirão 2026.
                </p>
              </div>
              <span className="text-xs font-black text-emerald-400 bg-emerald-950 px-3 py-1 rounded-xl border border-emerald-500/30">
                10 Jogos Obrigatórios
              </span>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Número da Rodada:
                </label>
                <input
                  type="number"
                  required
                  value={newRoundNumber}
                  onChange={e => {
                    const num = parseInt(e.target.value, 10);
                    setNewRoundNumber(num);
                    setNewRoundTitle(`${num}ª Rodada - Brasileirão 2026`);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Título da Rodada:
                </label>
                <input
                  type="text"
                  required
                  value={newRoundTitle}
                  onChange={e => setNewRoundTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Valor da Aposta (R$):
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newRoundPrice}
                  onChange={e => setNewRoundPrice(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-emerald-400 font-bold px-3 py-2 rounded-xl focus:border-emerald-400"
                />
              </div>
            </div>

            {/* 10 Matches Editor */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Definição dos 10 Jogos da Rodada:
                </h4>
                <span className="text-[11px] text-slate-400">
                  Selecione Mandante e Visitante para cada um dos 10 jogos
                </span>
              </div>

              <div className="space-y-2">
                {newMatches.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-2.5 sm:p-3 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs"
                  >
                    <span className="sm:col-span-1 w-5 h-5 rounded-full bg-slate-800 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>

                    {/* Home Team Select */}
                    <div className="sm:col-span-4">
                      <select
                        value={m.homeTeam}
                        onChange={e => handleMatchTeamChange(idx, 'home', e.target.value)}
                        className="w-full bg-slate-900 text-white font-bold px-2 py-1.5 rounded-lg border border-slate-700"
                      >
                        {BRASILEIRAO_TEAMS.map(team => (
                          <option key={team.id} value={team.name}>
                            {team.name} ({team.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <span className="sm:col-span-1 text-center font-black text-slate-500">
                      x
                    </span>

                    {/* Away Team Select */}
                    <div className="sm:col-span-4">
                      <select
                        value={m.awayTeam}
                        onChange={e => handleMatchTeamChange(idx, 'away', e.target.value)}
                        className="w-full bg-slate-900 text-white font-bold px-2 py-1.5 rounded-lg border border-slate-700"
                      >
                        {BRASILEIRAO_TEAMS.map(team => (
                          <option key={team.id} value={team.name}>
                            {team.name} ({team.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date / Stadium */}
                    <div className="sm:col-span-2 text-right">
                      <input
                        type="text"
                        value={m.date}
                        onChange={e => {
                          const copy = [...newMatches];
                          copy[idx].date = e.target.value;
                          setNewMatches(copy);
                        }}
                        className="w-full bg-slate-900 text-slate-300 text-[11px] px-2 py-1 rounded border border-slate-800"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-emerald-950 transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Publicar Rodada Oficial e Abrir Palpites</span>
            </button>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: API DE ESTATÍSTICAS & PLACARES OFICIAIS */}
      {/* ======================================================== */}
      {adminTab === 'placares' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Atualização de Placares & API Esportiva
                </h3>
                <p className="text-xs text-slate-400">
                  Sincronize os placares dos 10 jogos via API de estatísticas esportivas para atualizar o ranking automaticamente.
                </p>
              </div>

              {/* 1-Click Sports API Sync */}
              <button
                onClick={handleSyncApi}
                disabled={isSyncingApi}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-blue-950 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingApi ? 'animate-spin' : ''}`} />
                <span>{isSyncingApi ? 'Buscando API...' : 'Sincronizar Placares via API Esportiva'}</span>
              </button>
            </div>
          </div>

          {/* Matches Score Editor for Target Round */}
          {targetRound && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-white">
                  Jogos da {targetRound.title}:
                </span>
                <span className="text-[11px] text-slate-400">
                  Placar Exato = 3 pts • Acerto Vencedor = 1 pt
                </span>
              </div>

              <div className="space-y-2.5">
                {targetRound.matches.map((match, idx) => (
                  <div
                    key={match.id}
                    className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    {/* Teams Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-extrabold text-white text-sm">
                          {match.homeTeam} x {match.awayTeam}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {match.date} • {match.stadium}
                        </p>
                      </div>
                    </div>

                    {/* Score Control */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-[11px] text-slate-400 font-semibold">Placar Final:</span>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={match.homeScore !== null ? match.homeScore : ''}
                        placeholder="0"
                        onChange={e => {
                          const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                          adminUpdateMatchScore(targetRound.id, match.id, val, match.awayScore ?? 0, 'finished');
                        }}
                        className="w-10 text-center font-black text-emerald-300 bg-slate-900 border border-slate-700 py-1 rounded-lg text-sm"
                      />
                      <span className="font-black text-slate-500">x</span>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={match.awayScore !== null ? match.awayScore : ''}
                        placeholder="0"
                        onChange={e => {
                          const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                          adminUpdateMatchScore(targetRound.id, match.id, match.homeScore ?? 0, val, 'finished');
                        }}
                        className="w-10 text-center font-black text-emerald-300 bg-slate-900 border border-slate-700 py-1 rounded-lg text-sm"
                      />

                      <button
                        onClick={() => {
                          adminFinalizeRound(targetRound.id);
                          alert('Placares salvos e ranking recalculado com sucesso!');
                        }}
                        className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-bold transition-colors ml-2"
                      >
                        Salvar & Computar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Receipt Full Preview Modal */}
      {selectedReceiptPreview && (
        <div
          onClick={() => setSelectedReceiptPreview(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-4 max-w-xl max-h-[90vh] overflow-hidden flex flex-col items-center gap-3">
            <h4 className="text-sm font-bold text-white">Comprovante de Pagamento PIX</h4>
            <img
              src={selectedReceiptPreview}
              alt="Comprovante Ampliado"
              className="max-h-[70vh] object-contain rounded-xl border border-slate-800"
            />
            <button
              onClick={() => setSelectedReceiptPreview(null)}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
            >
              Fechar Visualização
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
