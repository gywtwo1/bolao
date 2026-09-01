import React, { useState } from 'react';
import { useBolao } from '../context/BolaoContext';
import { BRASILEIRAO_TEAMS } from '../data/teams';
import { 
  BRASILEIRAO_2026_SCHEDULE, 
  getBrasileirao2026RoundTemplate, 
  getAllBrasileirao2026RoundTemplates,
  GOOGLE_BRASILEIRAO_2026_LIVE_DATA
} from '../data/brasileirao2026Schedule';
import { Match, Round, Team } from '../types';
import { formatCurrency } from '../utils/pix';
import { formatDeadlineDisplay, formatDeadlineShort } from '../utils/scoring';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  Trash2, 
  RefreshCw, 
  FileText, 
  Eye, 
  EyeOff,
  Trophy, 
  Clock, 
  Zap, 
  DollarSign, 
  AlertTriangle,
  Calendar,
  Sparkles,
  Search,
  Edit3,
  Users,
  Lock,
  LogOut,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowRight,
  MessageCircle,
  Phone,
  Mail,
  Send,
  Radio,
  UserCheck,
  MessageSquare,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

interface AdminPanelProps {
  onExitAdmin?: () => void;
  openAuth?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onExitAdmin, openAuth }) => {
  const {
    rounds,
    bets,
    teams,
    users,
    selectedRoundId,
    isAdmin,
    login,
    logout,
    adminApproveBet,
    adminRejectBet,
    adminCreateRound,
    adminDeleteRound,
    adminUpdateMatchScore,
    adminSyncSportsApiScores,
    adminFinalizeRound,
    adminAddTeam,
    adminDeleteTeam,
    adminUpdateTeam,
    adminUpdateRoundDeadline,
    adminSendNotification,
    adminUpdateUser
  } = useBolao();

  // Admin Login State for Protected Gate
  const [adminGateLogin, setAdminGateLogin] = useState('');
  const [adminGatePass, setAdminGatePass] = useState('');
  const [showGatePass, setShowGatePass] = useState(false);
  const [gateError, setGateError] = useState('');

  // Admin Tab & Modals State
  const [adminTab, setAdminTab] = useState<'comprovantes' | 'usuarios' | 'rodadas' | 'placares' | 'times'>('comprovantes');
  const [rejectReason, setRejectReason] = useState<{ [betId: string]: string }>({});
  const [selectedReceiptPreview, setSelectedReceiptPreview] = useState<string | null>(null);
  const [isSyncingApi, setIsSyncingApi] = useState(false);
  const [activeAdminRoundId, setActiveAdminRoundId] = useState<number>(selectedRoundId);

  // Online Users & Contacts State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'online' | 'with_bets' | 'pending_pix'>('all');
  const [selectedUserForMsg, setSelectedUserForMsg] = useState<any | null>(null);
  const [directMsgTitle, setDirectMsgTitle] = useState('');
  const [directMsgText, setDirectMsgText] = useState('');
  const [directMsgType, setDirectMsgType] = useState<'system' | 'payment_confirmed' | 'payment_rejected' | 'round_open' | 'results_ready'>('system');
  const [copiedPixKey, setCopiedPixKey] = useState<string | null>(null);

  // In-App Confirmation Modals
  const [roundToDelete, setRoundToDelete] = useState<Round | null>(null);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [editingDeadlineRound, setEditingDeadlineRound] = useState<Round | null>(null);
  const [editingDeadlineValue, setEditingDeadlineValue] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Editing Team State
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editTeamName, setEditTeamName] = useState('');
  const [editTeamCode, setEditTeamCode] = useState('');
  const [editTeamStadium, setEditTeamStadium] = useState('');
  const [editTeamCity, setEditTeamCity] = useState('');

  // Add New Team State
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamCode, setNewTeamCode] = useState('');
  const [newTeamCity, setNewTeamCity] = useState('');
  const [newTeamStadium, setNewTeamStadium] = useState('');
  const [newTeamPrimaryColor, setNewTeamPrimaryColor] = useState('#10b981');

  // New Round Creation State
  const [newRoundNumber, setNewRoundNumber] = useState<number>(rounds.length + 1);
  const [newRoundTitle, setNewRoundTitle] = useState<string>(`${rounds.length + 1}ª Rodada - Brasileirão 2026`);
  const [newRoundPrice, setNewRoundPrice] = useState<number>(10.00);
  const [newRoundDeadline, setNewRoundDeadline] = useState<string>('2026-04-26T16:00');

  // Automatic Brasileirão 2026 Round State
  const existingRoundNumbers = new Set(rounds.map(r => r.number || r.id));
  const nextSuggestedRoundNumber = Array.from({ length: 38 }, (_, i) => i + 1).find(n => !existingRoundNumbers.has(n)) || (rounds.length + 1);
  const [selectedAutoRoundNum, setSelectedAutoRoundNum] = useState<number>(nextSuggestedRoundNumber <= 38 ? nextSuggestedRoundNumber : 1);
  const [showAutoMatchesPreview, setShowAutoMatchesPreview] = useState<boolean>(true);
  const [showGoogleLiveTable, setShowGoogleLiveTable] = useState<boolean>(false);
  const selectedTemplate = getBrasileirao2026RoundTemplate(selectedAutoRoundNum) || BRASILEIRAO_2026_SCHEDULE[Math.min(Math.max(selectedAutoRoundNum - 1, 0), 37)];

  const handleGateLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGateError('');
    const res = login(adminGateLogin.trim(), adminGatePass.trim());
    if (!res.success) {
      setGateError(res.message || 'Credenciais inválidas. Verifique seu login e senha.');
    }
  };

  // If user is not authenticated as Admin, show the restricted login gate
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 pb-24">
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-950/40">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-block mb-2">
            Acesso Restrito
          </span>

          <h2 className="text-xl font-black text-white">
            Painel de Administração
          </h2>

          <p className="text-xs text-slate-400 mt-2 mb-6 leading-relaxed">
            Área restrita à coordenação do Bolão. Insira as credenciais autorizadas para gerenciar comprovantes, rodadas e placares.
          </p>

          <form onSubmit={handleGateLoginSubmit} className="space-y-3.5 text-left">
            {gateError && (
              <div className="p-3 bg-rose-950/70 border border-rose-500/50 rounded-xl text-xs text-rose-200 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{gateError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Usuário / Login:
              </label>
              <input
                type="text"
                required
                value={adminGateLogin}
                onChange={e => setAdminGateLogin(e.target.value)}
                placeholder="Insira seu login de administrador"
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white px-3.5 py-2.5 rounded-xl focus:border-amber-400 focus:outline-none font-sans"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Senha de Acesso:
              </label>
              <div className="relative">
                <input
                  type={showGatePass ? 'text' : 'password'}
                  required
                  value={adminGatePass}
                  onChange={e => setAdminGatePass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white px-3.5 py-2.5 pr-10 rounded-xl focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowGatePass(!showGatePass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showGatePass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-950/60 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Autenticar como Administrador</span>
              </button>

              {openAuth && (
                <button
                  type="button"
                  onClick={openAuth}
                  className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Entrar com conta de Participante
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
  
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

  const handleAutoCreateRound = (roundNum: number) => {
    const template = getBrasileirao2026RoundTemplate(roundNum) || BRASILEIRAO_2026_SCHEDULE[Math.min(roundNum - 1, 37)];
    if (!template) {
      alert(`Não foi encontrado o modelo da Rodada ${roundNum}.`);
      return;
    }

    const isAlreadyCreated = rounds.some(r => r.number === roundNum || r.id === roundNum);
    if (isAlreadyCreated) {
      const confirmDup = confirm(`A Rodada ${roundNum} já existe no sistema! Deseja criar mesmo assim?`);
      if (!confirmDup) return;
    }

    const formattedMatches: Match[] = template.matches.map((m, idx) => ({
      ...m,
      id: `r${roundNum}-m${idx + 1}`,
      roundId: roundNum,
      homeScore: null,
      awayScore: null,
      status: 'scheduled'
    }));

    adminCreateRound({
      number: template.number,
      title: template.title,
      season: template.season || '2026',
      price: template.price || 10.00,
      status: 'open',
      deadline: template.deadline,
      matches: formattedMatches
    });

    setSuccessToast(`⚡ ${template.title} criada com sucesso com os 10 jogos oficiais do Brasileirão 2026!`);
    setTimeout(() => setSuccessToast(null), 5000);
    setActiveAdminRoundId(roundNum);
  };

  const handleLoadTemplateIntoForm = (roundNum: number) => {
    const template = getBrasileirao2026RoundTemplate(roundNum) || BRASILEIRAO_2026_SCHEDULE[Math.min(roundNum - 1, 37)];
    if (!template) return;

    setNewRoundNumber(template.number);
    setNewRoundTitle(template.title);
    setNewRoundPrice(template.price || 10.00);
    setNewRoundDeadline(template.deadline ? template.deadline.slice(0, 16) : '2026-04-26T16:00');
    setNewMatches(template.matches);

    setSuccessToast(`📋 10 Jogos da ${template.title} carregados no formulário de edição abaixo!`);
    setTimeout(() => setSuccessToast(null), 4000);

    const formEl = document.getElementById('manual-round-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

    if (!newRoundDeadline) {
      alert('Informe a data e horário limite de fechamento para os palpites!');
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

    setSuccessToast(`Nova rodada ${newRoundNumber} criada com sucesso! Fechamento: ${formatDeadlineShort(newRoundDeadline)}`);
    setTimeout(() => setSuccessToast(null), 4000);
    setAdminTab('rodadas');
  };

  const handleMatchTeamChange = (index: number, teamType: 'home' | 'away', teamName: string) => {
    const foundTeam = teams.find(t => t.name === teamName) || BRASILEIRAO_TEAMS.find(t => t.name === teamName);
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

  const handleStartEditTeam = (team: Team) => {
    setEditingTeamId(team.id);
    setEditTeamName(team.name);
    setEditTeamCode(team.code);
    setEditTeamStadium(team.stadium);
    setEditTeamCity(team.city);
  };

  const handleSaveTeamEdit = (teamId: string) => {
    if (!editTeamName.trim() || !editTeamCode.trim()) {
      alert('Nome e sigla do time são obrigatórios!');
      return;
    }
    adminUpdateTeam(teamId, {
      name: editTeamName.trim(),
      code: editTeamCode.trim().toUpperCase(),
      stadium: editTeamStadium.trim(),
      city: editTeamCity.trim()
    });
    setEditingTeamId(null);
    alert('Time atualizado com sucesso! Alterações refletidas nas rodadas.');
  };

  const handleCreateNewTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !newTeamCode.trim()) {
      alert('Nome e sigla são obrigatórios!');
      return;
    }
    adminAddTeam({
      name: newTeamName.trim(),
      code: newTeamCode.trim().toUpperCase(),
      city: newTeamCity.trim() || 'Brasil',
      stadium: newTeamStadium.trim() || 'Estádio Principal',
      primaryColor: newTeamPrimaryColor || '#10b981',
      secondaryColor: '#ffffff'
    });
    setNewTeamName('');
    setNewTeamCode('');
    setNewTeamCity('');
    setNewTeamStadium('');
    alert('Novo time adicionado com sucesso à base do Brasileirão 2026!');
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

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            {/* Exit Admin Mode Button */}
            <button
              type="button"
              onClick={() => {
                if (onExitAdmin) {
                  onExitAdmin();
                } else {
                  logout();
                  if (openAuth) openAuth();
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-2xl text-xs font-bold transition-all shadow-sm"
              title="Sair do Modo ADM e voltar para a tela de login"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair do ADM</span>
            </button>

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
        </div>

        {/* Sub-tabs */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <button
            onClick={() => setAdminTab('comprovantes')}
            className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
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
            onClick={() => setAdminTab('usuarios')}
            className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              adminTab === 'usuarios'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/60'
                : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="relative">
              <Users className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span>Contatos & Online</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              adminTab === 'usuarios' ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              {users.filter(u => u.isOnline && u.role !== 'admin').length} online
            </span>
          </button>

          <button
            onClick={() => setAdminTab('rodadas')}
            className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              adminTab === 'rodadas'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/60'
                : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Rodadas Brasileirão</span>
          </button>

          <button
            onClick={() => setAdminTab('placares')}
            className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              adminTab === 'placares'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/60'
                : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>API & Placares</span>
          </button>

          <button
            onClick={() => setAdminTab('times')}
            className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              adminTab === 'times'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/60'
                : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Times ({teams.length})</span>
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
                const betUser = users.find(u => u.id === bet.userId || u.email === bet.userEmail);
                const cleanPhone = (betUser?.phone || '').replace(/\D/g, '');
                const waMessage = encodeURIComponent(`Olá ${bet.userName}, tudo bem? Aqui é do Bolão Brasileirão 2026 sobre seu comprovante PIX do ${bet.betLabel || 'Palpite'} da ${betRound?.title || 'Rodada'}!`);

                return (
                  <div
                    key={bet.id}
                    className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4"
                  >
                    {/* User & Bet Info Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={bet.userAvatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                            alt={bet.userName}
                            className="w-12 h-12 rounded-2xl object-cover border border-slate-700 bg-slate-800"
                          />
                          {betUser?.isOnline && (
                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full" title="Online Agora" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-black text-white">{bet.userName}</h4>
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              {bet.betLabel || `Palpite #${bet.betNumber || 1}`}
                            </span>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              Pendente ADM
                            </span>
                            {betUser?.isOnline && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Online Agora
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">
                            {bet.userEmail} {betUser?.phone && `• ${betUser.phone}`} • {betRound?.title || `Rodada ${bet.roundId}`} • Taxa: <strong className="text-emerald-400">R$ 10,00</strong>
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Enviado em {new Date(bet.receiptUploadedAt || bet.createdAt).toLocaleString('pt-BR')} • {predictionsCount} palpites registrados
                          </p>
                        </div>
                      </div>

                      {/* Direct Contact Buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {cleanPhone && (
                          <a
                            href={`https://wa.me/55${cleanPhone}?text=${waMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                            title="Conversar no WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                        {betUser?.phone && (
                          <a
                            href={`tel:${betUser.phone}`}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
                            title="Ligar para o usuário"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => {
                            if (betUser) {
                              setSelectedUserForMsg(betUser);
                              setDirectMsgTitle('Comprovante PIX');
                              setDirectMsgText(`Olá ${bet.userName}, recebemos o comprovante do seu ${bet.betLabel || 'palpite'} da ${betRound?.title || 'rodada'}.`);
                            }
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold transition-colors"
                          title="Enviar Notificação Push Direta"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Notificar</span>
                        </button>
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
      {/* TAB: USUÁRIOS & CONTATOS ONLINE */}
      {/* ======================================================== */}
      {adminTab === 'usuarios' && (
        <div className="space-y-5">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">Total Usuários</span>
                <Users className="w-4 h-4 text-sky-400" />
              </div>
              <p className="text-xl font-black text-white">{users.length}</p>
              <p className="text-[10px] text-slate-500">Cadastrados no bolão</p>
            </div>

            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-300">Online Agora</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xl font-black text-emerald-400">
                {users.filter(u => u.isOnline).length}
              </p>
              <p className="text-[10px] text-emerald-400/80">Conectados em tempo real</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">Na Rodada Ativa</span>
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-xl font-black text-amber-400">
                {new Set(bets.filter(b => b.roundId === selectedRoundId).map(b => b.userId)).size}
              </p>
              <p className="text-[10px] text-slate-500">Apostadores únicos</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">PIX Pendentes</span>
                <FileText className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-xl font-black text-rose-400">{pendingReceiptBets.length}</p>
              <p className="text-[10px] text-slate-500">Aguardando aprovação</p>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  Contatos e Status dos Usuários
                </h3>
                <p className="text-xs text-slate-400">
                  Fale com os apostadores via WhatsApp, telefone ou envie notificações diretas no app.
                </p>
              </div>

              {/* Quick Broadcast Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedUserForMsg({
                    id: 'broadcast-all',
                    name: 'Todos os Usuários (Transmissão Geral)',
                    email: 'todos@bolao',
                    role: 'user',
                    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=broadcast',
                    favoriteTeam: 'Todos',
                    pixKey: '',
                    phone: '',
                    createdAt: '',
                    totalPoints: 0,
                    totalExactHits: 0,
                    totalOutcomeHits: 0,
                    roundsParticipated: 0
                  });
                  setDirectMsgTitle('📢 Comunicado da Administração');
                  setDirectMsgText('Atenção apostadores: A rodada atual está aberta e os jogos começam em breve!');
                  setDirectMsgType('system');
                }}
                className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-1.5 transition-all shrink-0"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Notificar Todos os Usuários</span>
              </button>
            </div>

            {/* Search Input and Filter Chips */}
            <div className="flex flex-col md:flex-row items-center gap-2.5 pt-2">
              <div className="relative w-full md:flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nome, e-mail, telefone, time ou cidade..."
                  value={userSearchQuery}
                  onChange={e => setUserSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white pl-9 pr-4 py-2.5 rounded-xl focus:border-amber-400 focus:outline-none"
                />
                {userSearchQuery && (
                  <button
                    onClick={() => setUserSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                <button
                  type="button"
                  onClick={() => setUserFilter('all')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                    userFilter === 'all'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  Todos ({users.length})
                </button>
                <button
                  type="button"
                  onClick={() => setUserFilter('online')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    userFilter === 'online'
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-950 text-emerald-400 hover:bg-slate-800 border border-emerald-500/30'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online ({users.filter(u => u.isOnline).length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserFilter('with_bets')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                    userFilter === 'with_bets'
                      ? 'bg-sky-500 text-slate-950 font-black'
                      : 'bg-slate-950 text-sky-400 hover:bg-slate-800 border border-sky-500/30'
                  }`}
                >
                  Com Palpites ({new Set(bets.map(b => b.userId)).size})
                </button>
                <button
                  type="button"
                  onClick={() => setUserFilter('pending_pix')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                    userFilter === 'pending_pix'
                      ? 'bg-rose-500 text-white font-black'
                      : 'bg-slate-950 text-rose-400 hover:bg-slate-800 border border-rose-500/30'
                  }`}
                >
                  PIX Pendente ({pendingReceiptBets.length})
                </button>
              </div>
            </div>
          </div>

          {/* User Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users
              .filter(user => {
                const query = userSearchQuery.toLowerCase();
                const matchesQuery =
                  user.name.toLowerCase().includes(query) ||
                  user.email.toLowerCase().includes(query) ||
                  (user.phone && user.phone.includes(query)) ||
                  (user.favoriteTeam && user.favoriteTeam.toLowerCase().includes(query)) ||
                  (user.city && user.city.toLowerCase().includes(query));

                if (!matchesQuery) return false;

                if (userFilter === 'online') return !!user.isOnline;
                if (userFilter === 'with_bets') return bets.some(b => b.userId === user.id);
                if (userFilter === 'pending_pix') return bets.some(b => b.userId === user.id && b.status === 'pending_receipt');

                return true;
              })
              .map(user => {
                const isOnline = user.isOnline ?? (user.role === 'admin' || user.id === 'user-1' || user.id === 'user-2' || user.id === 'user-3');
                const cleanPhone = (user.phone || '').replace(/\D/g, '');
                const userBets = bets.filter(b => b.userId === user.id);
                const userBetsInActiveRound = bets.filter(b => b.userId === user.id && b.roundId === selectedRoundId);
                const hasPendingReceipt = userBets.some(b => b.status === 'pending_receipt');
                const hasConfirmedBet = userBets.some(b => b.status === 'confirmed');

                const waMessage = encodeURIComponent(
                  `Olá ${user.name}, tudo bem? Aqui é o Administrador do Bolão Brasileirão 2026! Gostaria de falar sobre sua conta e palpites.`
                );

                return (
                  <div
                    key={user.id}
                    className={`bg-slate-900 border rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col justify-between gap-4 transition-all ${
                      isOnline
                        ? 'border-emerald-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20'
                        : 'border-slate-800'
                    }`}
                  >
                    {/* User Top Info */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <img
                              src={user.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                              alt={user.name}
                              className="w-13 h-13 rounded-2xl object-cover border border-slate-700 bg-slate-800"
                            />
                            <span
                              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                                isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                              }`}
                              title={isOnline ? 'Usuário Online Agora' : 'Offline'}
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-base font-black text-white truncate">
                                {user.name}
                              </h4>
                              {user.role === 'admin' ? (
                                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px] border border-purple-500/30">
                                  Administrador
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px] border border-slate-700">
                                  Apostador
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-400 truncate mt-0.5">
                              {user.email}
                            </p>

                            <div className="flex items-center gap-2 mt-1 flex-wrap text-[11px]">
                              {isOnline ? (
                                <span className="flex items-center gap-1 font-bold text-emerald-400">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  Online agora
                                </span>
                              ) : (
                                <span className="text-slate-400">
                                  Visto: {user.lastActive || 'Recente'}
                                </span>
                              )}
                              {(user.city || user.state) && (
                                <span className="text-slate-400">
                                  • {user.city ? `${user.city}` : ''}{user.state ? ` (${user.state})` : ''}
                                </span>
                              )}
                              {user.favoriteTeam && (
                                <span className="text-amber-400 font-semibold">
                                  • ⚽ {user.favoriteTeam}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Admin Toggle Online Status Simulation */}
                        <button
                          type="button"
                          onClick={() => {
                            adminUpdateUser(user.id, { isOnline: !isOnline, lastActive: !isOnline ? 'Online agora' : 'Há instantes' });
                          }}
                          className={`text-[10px] px-2 py-1 rounded-lg border font-bold transition-colors ${
                            isOnline
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                          }`}
                          title="Clique para alternar o status online para testes"
                        >
                          {isOnline ? '🟢 Online' : '⚪ Offline'}
                        </button>
                      </div>

                      {/* Contact Badges & PIX Details */}
                      <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">
                              Telefone / WhatsApp
                            </span>
                            <span className="font-mono text-white font-bold">
                              {user.phone || 'Não informado'}
                            </span>
                          </div>

                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">
                              Chave PIX Cadastrada
                            </span>
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-mono text-amber-300 truncate font-semibold">
                                {user.pixKey || 'Não cadastrada'}
                              </span>
                              {user.pixKey && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(user.pixKey || '');
                                    setCopiedPixKey(user.id);
                                    setTimeout(() => setCopiedPixKey(null), 2500);
                                  }}
                                  className="text-[10px] px-1.5 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 flex items-center gap-1 shrink-0"
                                  title="Copiar Chave PIX"
                                >
                                  {copiedPixKey === user.id ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span className="text-emerald-400">Copiado</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3 text-slate-400" />
                                      <span>Copiar</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Tournament & Round Summary */}
                        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between flex-wrap gap-2 text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">Pontuação Total:</span>
                            <span className="font-black text-emerald-400 font-mono text-xs">
                              {user.totalPoints} pts
                            </span>
                            <span className="text-slate-500">|</span>
                            <span className="text-slate-400">Cravadas:</span>
                            <span className="font-bold text-amber-400 font-mono">
                              {user.totalExactHits}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400">Na Rodada Atual:</span>
                            <span className="font-bold text-white">
                              {userBetsInActiveRound.length} {userBetsInActiveRound.length === 1 ? 'palpite' : 'palpites'}
                            </span>
                            {hasPendingReceipt && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                                PIX Pendente
                              </span>
                            )}
                            {hasConfirmedBet && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                                Confirmado
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions Bar: WhatsApp, Phone, Email, Direct Push Message */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-800/80">
                      {cleanPhone ? (
                        <a
                          href={`https://wa.me/55${cleanPhone}?text=${waMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>WhatsApp</span>
                        </a>
                      ) : (
                        <button
                          disabled
                          className="py-2.5 px-3 bg-slate-800/50 text-slate-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Sem Zap</span>
                        </button>
                      )}

                      {user.phone ? (
                        <a
                          href={`tel:${user.phone}`}
                          className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-4 h-4 text-sky-400" />
                          <span>Ligar</span>
                        </a>
                      ) : (
                        <button
                          disabled
                          className="py-2.5 px-3 bg-slate-800/50 text-slate-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Sem Tel</span>
                        </button>
                      )}

                      <a
                        href={`mailto:${user.email}?subject=Bolão%20Brasileirão%202026`}
                        className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Mail className="w-4 h-4 text-amber-400" />
                        <span>E-mail</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUserForMsg(user);
                          setDirectMsgTitle('Mensagem da Administração');
                          setDirectMsgText(`Olá ${user.name}, tudo bem?`);
                          setDirectMsgType('system');
                        }}
                        className="py-2.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-black text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-4 h-4" />
                        <span>Notificar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CRIAR / GERENCIAR RODADAS (10 JOGOS, DELETAR RODADA) */}
      {/* ======================================================== */}
      {adminTab === 'rodadas' && (
        <div className="space-y-6">
          {/* Automatic Brasileirão 2026 Round Generator */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Gerador Automático de Rodadas (Brasileirão 2026)
                  </h3>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    38 Rodadas Oficiais
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    Google Dados 2026 Atualizados
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Crie qualquer uma das 38 rodadas oficiais com 1 clique. Os 10 confrontos, mandantes, visitantes, estádios, datas e horários sincronizados com a tabela oficial da CBF / Google!
                </p>
              </div>

              {/* One-Click Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAutoRoundNum(GOOGLE_BRASILEIRAO_2026_LIVE_DATA.currentRoundNumber);
                    handleAutoCreateRound(GOOGLE_BRASILEIRAO_2026_LIVE_DATA.currentRoundNumber);
                  }}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-xs rounded-xl shadow-md border border-amber-400/40 flex items-center justify-center gap-1.5 transition-all transform active:scale-95 whitespace-nowrap"
                  title="Criar a rodada que está acontecendo agora (25ª Rodada)"
                >
                  <Zap className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200" />
                  <span>Criar Rodada Atual ({GOOGLE_BRASILEIRAO_2026_LIVE_DATA.currentRoundNumber}ª)</span>
                </button>

                {nextSuggestedRoundNumber <= 38 && (
                  <button
                    type="button"
                    onClick={() => handleAutoCreateRound(nextSuggestedRoundNumber)}
                    className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md border border-emerald-400/40 flex items-center justify-center gap-1.5 transition-all transform active:scale-95 whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Criar Rodada {nextSuggestedRoundNumber}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Google / CBF Série A 2026 Live Status Badge */}
            <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs relative z-10">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-black text-[11px] border border-sky-500/30">
                  CBF / Google 2026
                </span>
                <span className="text-slate-300">
                  Status: <strong className="text-emerald-400 font-bold">{GOOGLE_BRASILEIRAO_2026_LIVE_DATA.status}</strong>
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">
                  Líder: <strong className="text-white">Palmeiras (51 pts)</strong>
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">
                  Vice: <strong className="text-white">Flamengo (45 pts)</strong>
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">
                  Artilheiro: <strong className="text-amber-400">{GOOGLE_BRASILEIRAO_2026_LIVE_DATA.artilheiro}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowGoogleLiveTable(!showGoogleLiveTable)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-lg border border-slate-700 font-bold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  <span>{showGoogleLiveTable ? 'Ocultar Tabela Google' : 'Ver Tabela & Jogos Google'}</span>
                </button>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{GOOGLE_BRASILEIRAO_2026_LIVE_DATA.lastSyncDate}</span>
                </div>
              </div>
            </div>

            {/* Expandable Google Serie A 2026 Standings & Real Match Scores */}
            {showGoogleLiveTable && (
              <div className="bg-slate-950/90 border border-sky-500/30 rounded-2xl p-4 space-y-4 relative z-10 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                    <h4 className="text-xs sm:text-sm font-extrabold text-white">
                      Tabela de Classificação do Brasileirão 2026 (Top 8 - Dados Oficiais)
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Fonte: Google Search / CBF Oficial 2026
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Leaderboard Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-bold text-[11px]">
                          <th className="py-1.5 px-2">#</th>
                          <th className="py-1.5 px-2">Clube</th>
                          <th className="py-1.5 px-2 text-center">PTS</th>
                          <th className="py-1.5 px-2 text-center">J</th>
                          <th className="py-1.5 px-2 text-center">V</th>
                          <th className="py-1.5 px-2 text-center">SG</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {GOOGLE_BRASILEIRAO_2026_LIVE_DATA.topLeaderboard.map(item => (
                          <tr key={item.pos} className="hover:bg-slate-900/60 transition-colors">
                            <td className="py-1.5 px-2 font-black text-slate-300">
                              <span className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] ${
                                item.pos === 1 ? 'bg-amber-500/20 text-amber-300 font-black' :
                                item.pos <= 4 ? 'bg-blue-500/20 text-blue-300 font-bold' :
                                'bg-slate-800 text-slate-300'
                              }`}>
                                {item.pos}
                              </span>
                            </td>
                            <td className="py-1.5 px-2 font-bold text-white">
                              {item.team}
                            </td>
                            <td className="py-1.5 px-2 text-center font-black text-emerald-400">
                              {item.points}
                            </td>
                            <td className="py-1.5 px-2 text-center text-slate-300">
                              {item.games}
                            </td>
                            <td className="py-1.5 px-2 text-center text-slate-300">
                              {item.wins}
                            </td>
                            <td className="py-1.5 px-2 text-center font-semibold text-slate-300">
                              {item.sg > 0 ? `+${item.sg}` : item.sg}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Round 25 Official Scores & Fixtures */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800/80 pb-1">
                      <span>Resultados da 25ª Rodada (Agosto 2026):</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">10 Jogos</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
                      {GOOGLE_BRASILEIRAO_2026_LIVE_DATA.currentRoundScores.map((sc, i) => (
                        <div key={i} className="bg-slate-900/90 border border-slate-800 rounded-lg p-2 flex items-center justify-between text-[11px]">
                          <span className="font-bold text-white truncate max-w-[75px]">{sc.home}</span>
                          <span className={`px-1.5 py-0.5 rounded font-black text-[11px] ${
                            sc.status === 'finished' ? 'bg-slate-800 text-emerald-300' :
                            sc.status === 'live' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' :
                            'bg-slate-950 text-slate-400'
                          }`}>
                            {sc.status === 'scheduled' ? 'vs' : `${sc.homeScore} x ${sc.awayScore}`}
                          </span>
                          <span className="font-bold text-white truncate max-w-[75px] text-right">{sc.away}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Controls Bar: Select Round & Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center relative z-10">
              <div className="md:col-span-5 space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Selecionar Rodada do Brasileirão 2026:</span>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    {rounds.some(r => r.number === selectedAutoRoundNum || r.id === selectedAutoRoundNum)
                      ? '🟢 Já criada no bolão'
                      : '✨ Disponível para criação'}
                  </span>
                </label>
                <select
                  value={selectedAutoRoundNum}
                  onChange={e => setSelectedAutoRoundNum(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-sm font-bold rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                >
                  {BRASILEIRAO_2026_SCHEDULE.map(template => {
                    const isCreated = rounds.some(r => r.number === template.number || r.id === template.number);
                    const isCurrent = template.number === GOOGLE_BRASILEIRAO_2026_LIVE_DATA.currentRoundNumber;
                    const isNext = template.number === GOOGLE_BRASILEIRAO_2026_LIVE_DATA.currentRoundNumber + 1;
                    const tag = isCurrent 
                      ? '🔥 [Rodada Atual Google]' 
                      : isNext 
                        ? '⚡ [Próxima Rodada]' 
                        : isCreated 
                          ? '(🟢 Já no Bolão)' 
                          : '(✨ Criar)';
                    return (
                      <option key={template.number} value={template.number}>
                        Rodada {template.number} {tag} - {template.title}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="md:col-span-7 flex items-center gap-2 flex-wrap sm:flex-nowrap pt-1 sm:pt-0">
                {/* Instant Create Button */}
                <button
                  type="button"
                  onClick={() => handleAutoCreateRound(selectedAutoRoundNum)}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md border border-emerald-400/30 flex items-center justify-center gap-2 transition-colors"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>⚡ Criar Rodada {selectedAutoRoundNum} Automaticamente</span>
                </button>

                {/* Load Into Manual Form Button */}
                <button
                  type="button"
                  onClick={() => handleLoadTemplateIntoForm(selectedAutoRoundNum)}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                  title="Carregar 10 confrontos no editor manual abaixo para personalização"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Editar Antes</span>
                </button>

                {/* Toggle Preview Button */}
                <button
                  type="button"
                  onClick={() => setShowAutoMatchesPreview(!showAutoMatchesPreview)}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 flex items-center justify-center transition-colors"
                  title={showAutoMatchesPreview ? 'Ocultar prévia' : 'Ver prévia dos 10 confrontos'}
                >
                  {showAutoMatchesPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Preview of the 10 Matches of the Selected Round */}
            {showAutoMatchesPreview && selectedTemplate && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-extrabold text-white">
                      Prévia dos 10 Confrontos da {selectedTemplate.title}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      R$ {selectedTemplate.price?.toFixed(2) || '10.00'} por palpite
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Fechamento sugerido: <strong>{formatDeadlineDisplay(selectedTemplate.deadline)}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedTemplate.matches.map((m, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 p-2.5 rounded-xl flex items-center justify-between gap-2 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        
                        {/* Home Team */}
                        <div className="flex items-center gap-1.5 min-w-0 truncate">
                          <img
                            src={m.homeTeamLogo}
                            alt={m.homeTeam}
                            className="w-5 h-5 object-contain shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <span className="font-bold text-white truncate text-[11px] sm:text-xs">
                            {m.homeTeam}
                          </span>
                        </div>
                      </div>

                      {/* Match Meta (vs & date) */}
                      <div className="text-center shrink-0 px-1.5">
                        <span className="text-[10px] font-extrabold text-slate-400 block uppercase">
                          x
                        </span>
                        <span className="text-[9px] text-emerald-400 font-bold block whitespace-nowrap">
                          {m.date}
                        </span>
                      </div>

                      {/* Away Team */}
                      <div className="flex items-center justify-end gap-1.5 min-w-0 flex-1">
                        <span className="font-bold text-white truncate text-right text-[11px] sm:text-xs">
                          {m.awayTeam}
                        </span>
                        <img
                          src={m.awayTeamLogo}
                          alt={m.awayTeam}
                          className="w-5 h-5 object-contain shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <span>* Todos os estádios e horários oficiais do Brasileirão 2026 já estão associados aos 10 jogos.</span>
                  <button
                    type="button"
                    onClick={() => handleAutoCreateRound(selectedAutoRoundNum)}
                    className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                  >
                    <span>Confirmar e Criar Agora</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Active Rounds Management List */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  Rodadas Ativas no Sistema ({rounds.length})
                </h3>
                <p className="text-xs text-slate-400">
                  O Administrador pode gerenciar, alterar o horário de fechamento ou excluir rodadas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (nextSuggestedRoundNumber <= 38) {
                    handleAutoCreateRound(nextSuggestedRoundNumber);
                  } else {
                    handleAutoCreateRound(selectedAutoRoundNum);
                  }
                }}
                className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>+ Rodada Automática ({nextSuggestedRoundNumber <= 38 ? nextSuggestedRoundNumber : selectedAutoRoundNum}ª)</span>
              </button>
            </div>

            <div className="space-y-2.5 pt-2">
              {rounds.map(r => (
                <div
                  key={r.id}
                  className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
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
                    <p className="text-xs text-slate-400">
                      10 Jogos • Taxa: {formatCurrency(r.price)} • Pote Acumulado: <strong className="text-amber-400">{formatCurrency(r.totalPot)}</strong>
                    </p>
                    <div className="flex items-center gap-2 pt-0.5 text-xs text-amber-300">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        Fechamento: <strong className="text-white">{formatDeadlineDisplay(r.deadline)}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Edit Deadline Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDeadlineRound(r);
                        setEditingDeadlineValue(r.deadline ? (r.deadline.length > 16 ? r.deadline.slice(0, 16) : r.deadline) : '2026-04-26T16:00');
                      }}
                      className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                      title="Editar Horário de Fechamento"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Alterar Horário</span>
                    </button>

                    <button
                      onClick={() => adminFinalizeRound(r.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
                    >
                      {r.status === 'finished' ? 'Recalcular Pontos' : 'Finalizar Rodada'}
                    </button>

                    {/* Delete Round Button - opens in-app confirmation modal */}
                    <button
                      type="button"
                      onClick={() => setRoundToDelete(r)}
                      className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold"
                      title="Deletar Rodada"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Excluir</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form to Create New Round */}
          <form
            id="manual-round-form"
            onSubmit={handleCreateRoundSubmit}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-400" />
                  Editor Manual de Rodadas (Personalizado)
                </h3>
                <p className="text-xs text-slate-400">
                  Personalize os 10 confrontos, data limite ou valor da aposta manualmente se desejar.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLoadTemplateIntoForm(newRoundNumber)}
                  className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Preencher com Rodada {newRoundNumber} do Brasileirão 2026</span>
                </button>
                <span className="text-xs font-black text-emerald-400 bg-emerald-950 px-3 py-1 rounded-xl border border-emerald-500/30">
                  10 Jogos
                </span>
              </div>
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

            {/* Closing Deadline Section (Horário de Fechamento para Palpitar) */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    Data e Horário de Fechamento para Palpitar (Obrigatório):
                  </label>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Os palpites dos participantes serão bloqueados automaticamente assim que atingir este horário limite.
                  </p>
                </div>
                <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                  ⏰ Bloqueio Automático
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-5">
                  <input
                    type="datetime-local"
                    required
                    value={newRoundDeadline}
                    onChange={e => setNewRoundDeadline(e.target.value)}
                    className="w-full bg-slate-900 border border-amber-500/50 text-xs sm:text-sm font-bold text-amber-300 px-3.5 py-2.5 rounded-xl focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Quick Presets for Admin */}
                <div className="sm:col-span-7 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setHours(16, 0, 0, 0);
                      setNewRoundDeadline(d.toISOString().slice(0, 16));
                    }}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    Hoje 16h
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 1);
                      d.setHours(16, 0, 0, 0);
                      setNewRoundDeadline(d.toISOString().slice(0, 16));
                    }}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    Amanhã 16h
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      const day = d.getDay();
                      const diff = (6 - day + 7) % 7 || 7;
                      d.setDate(d.getDate() + diff);
                      d.setHours(16, 0, 0, 0);
                      setNewRoundDeadline(d.toISOString().slice(0, 16));
                    }}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    Sábado 16h
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      const day = d.getDay();
                      const diff = (7 - day + 7) % 7 || 7;
                      d.setDate(d.getDate() + diff);
                      d.setHours(16, 0, 0, 0);
                      setNewRoundDeadline(d.toISOString().slice(0, 16));
                    }}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    Domingo 16h
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      const day = d.getDay();
                      const diff = (3 - day + 7) % 7 || 7;
                      d.setDate(d.getDate() + diff);
                      d.setHours(19, 30, 0, 0);
                      setNewRoundDeadline(d.toISOString().slice(0, 16));
                    }}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    Quarta 19h30
                  </button>
                </div>
              </div>

              {/* Formatted Confirmation Preview */}
              <div className="text-xs text-slate-300 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Fechamento configurado para:{' '}
                  <strong className="text-amber-300 font-bold">
                    {formatDeadlineDisplay(newRoundDeadline)}
                  </strong>
                </span>
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
                        {teams.map(team => (
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
                        {teams.map(team => (
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
                <div>
                  <span className="text-xs font-bold text-white">
                    Jogos da {targetRound.title}:
                  </span>
                  <span className="text-[11px] text-slate-400 block sm:inline sm:ml-2">
                    Placar Exato = 3 pts • Acerto Vencedor = 1 pt
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRoundToDelete(targetRound)}
                    className="p-1.5 px-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                    title="Excluir esta rodada"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir Rodada</span>
                  </button>
                </div>
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

      {/* ======================================================== */}
      {/* TAB 4: GERENCIAR TIMES (EDITAR NOME, DELETAR, ADICIONAR) */}
      {/* ======================================================== */}
      {adminTab === 'times' && (
        <div className="space-y-6">
          {/* Add New Team Card */}
          <form
            onSubmit={handleCreateNewTeam}
            className="bg-slate-900 border border-amber-500/40 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-amber-400" />
                  Adicionar Novo Time ao Brasileirão 2026
                </h3>
                <p className="text-xs text-slate-400">
                  Cadastre novos times para utilização na criação de rodadas e confrontos do Bolão.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
                Total de Times: {teams.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Nome do Time:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Santos FC"
                  value={newTeamName}
                  onChange={e => setNewTeamName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Sigla (3 letras):
                </label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  placeholder="Ex: SAN"
                  value={newTeamCode}
                  onChange={e => setNewTeamCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl focus:border-amber-400 focus:outline-none font-mono uppercase"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Estádio:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Vila Belmiro"
                  value={newTeamStadium}
                  onChange={e => setNewTeamStadium(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Cidade / UF:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Santos (SP)"
                  value={newTeamCity}
                  onChange={e => setNewTeamCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-950/60 transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Salvar Novo Time</span>
            </button>
          </form>

          {/* List of Teams with Edit and Delete */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Times do Brasileirão ({teams.length})
              </h3>
              <p className="text-xs text-slate-400">
                O Administrador pode editar o nome, sigla, estádio ou deletar times. A alteração de nome atualiza automaticamente os confrontos das rodadas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {teams.map(team => {
                const isEditing = editingTeamId === team.id;

                return (
                  <div
                    key={team.id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between gap-2.5"
                  >
                    {isEditing ? (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-[11px] font-bold text-amber-400">Editando Time:</span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {team.id}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block">Nome do Time:</label>
                            <input
                              type="text"
                              value={editTeamName}
                              onChange={e => setEditTeamName(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 text-white px-2 py-1 rounded text-xs focus:border-amber-400"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block">Sigla:</label>
                            <input
                              type="text"
                              maxLength={4}
                              value={editTeamCode}
                              onChange={e => setEditTeamCode(e.target.value.toUpperCase())}
                              className="w-full bg-slate-900 border border-slate-700 text-white px-2 py-1 rounded text-xs font-mono uppercase focus:border-amber-400"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block">Estádio:</label>
                            <input
                              type="text"
                              value={editTeamStadium}
                              onChange={e => setEditTeamStadium(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 text-white px-2 py-1 rounded text-xs focus:border-amber-400"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 block">Cidade:</label>
                            <input
                              type="text"
                              value={editTeamCity}
                              onChange={e => setEditTeamCity(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 text-white px-2 py-1 rounded text-xs focus:border-amber-400"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSaveTeamEdit(team.id)}
                            className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Salvar Alteração</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingTeamId(null)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-lg transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black font-mono text-emerald-400 text-xs shrink-0">
                            {team.code}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-black text-white truncate">
                              {team.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate">
                              {team.stadium || 'Estádio'} • {team.city || 'Brasil'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Edit Team Button */}
                          <button
                            onClick={() => handleStartEditTeam(team)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors"
                            title="Editar Nome do Time"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                          </button>

                          {/* Delete Team Button */}
                          <button
                            type="button"
                            onClick={() => setTeamToDelete(team)}
                            className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl transition-colors"
                            title="Deletar Time"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Edit Round Deadline Modal */}
      {editingDeadlineRound && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setEditingDeadlineRound(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-white">Alterar Horário de Fechamento</h4>
                <p className="text-xs text-slate-400">{editingDeadlineRound.title}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Nova Data e Horário Limite dos Palpites:
                </label>
                <input
                  type="datetime-local"
                  value={editingDeadlineValue}
                  onChange={e => setEditingDeadlineValue(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/50 text-sm font-bold text-amber-300 px-3.5 py-2.5 rounded-xl focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Quick presets inside modal */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    d.setHours(16, 0, 0, 0);
                    setEditingDeadlineValue(d.toISOString().slice(0, 16));
                  }}
                  className="px-2 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] font-semibold text-slate-300 transition-colors"
                >
                  Hoje 16h
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 1);
                    d.setHours(16, 0, 0, 0);
                    setEditingDeadlineValue(d.toISOString().slice(0, 16));
                  }}
                  className="px-2 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] font-semibold text-slate-300 transition-colors"
                >
                  Amanhã 16h
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    const day = d.getDay();
                    const diff = (6 - day + 7) % 7 || 7;
                    d.setDate(d.getDate() + diff);
                    d.setHours(16, 0, 0, 0);
                    setEditingDeadlineValue(d.toISOString().slice(0, 16));
                  }}
                  className="px-2 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] font-semibold text-slate-300 transition-colors"
                >
                  Sábado 16h
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    const day = d.getDay();
                    const diff = (7 - day + 7) % 7 || 7;
                    d.setDate(d.getDate() + diff);
                    d.setHours(16, 0, 0, 0);
                    setEditingDeadlineValue(d.toISOString().slice(0, 16));
                  }}
                  className="px-2 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] font-semibold text-slate-300 transition-colors"
                >
                  Domingo 16h
                </button>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Fechamento: <strong className="text-amber-300 font-bold">{formatDeadlineDisplay(editingDeadlineValue)}</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setEditingDeadlineRound(null)}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!editingDeadlineValue) {
                    alert('Selecione uma data e horário válido!');
                    return;
                  }
                  adminUpdateRoundDeadline(editingDeadlineRound.id, editingDeadlineValue);
                  setEditingDeadlineRound(null);
                  setSuccessToast(`Horário de fechamento da "${editingDeadlineRound.title}" atualizado para ${formatDeadlineShort(editingDeadlineValue)}!`);
                  setTimeout(() => setSuccessToast(null), 4000);
                }}
                className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvar Horário</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Confirmation Modal: Delete Round */}
      {roundToDelete && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setRoundToDelete(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-slate-900 border border-rose-500/50 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl shadow-rose-950/50 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/40 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  Excluir Rodada Definitivamente?
                </h3>
                <p className="text-xs text-slate-400">
                  Confirmação de exclusão do sistema
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-white text-sm">{roundToDelete.title}</span>
                <span
                  className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${
                    roundToDelete.status === 'open'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : roundToDelete.status === 'finished'
                      ? 'bg-slate-800 text-slate-300 border border-slate-700'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {roundToDelete.status === 'open' ? 'Aberta' : roundToDelete.status === 'finished' ? 'Finalizada' : roundToDelete.status}
                </span>
              </div>

              <p className="text-slate-400 text-xs">
                10 Jogos • Pote Acumulado: <strong className="text-amber-400">{formatCurrency(roundToDelete.totalPot)}</strong>
              </p>

              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-[11px] text-rose-300 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" />
                  O que acontece ao excluir:
                </p>
                <p className="text-rose-200/80">
                  • A rodada é removida da tela de palpites e do histórico de todos os usuários.<br />
                  • Os 10 confrontos e os palpites registrados são excluídos com segurança.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setRoundToDelete(null)}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => {
                  const targetId = roundToDelete.id;
                  setRoundToDelete(null);
                  adminDeleteRound(targetId);
                  setSuccessToast('Rodada excluída do sistema com sucesso!');
                  setTimeout(() => setSuccessToast(null), 4000);
                }}
                className="py-2.5 px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-950/60 transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sim, Excluir</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Confirmation Modal: Delete Team */}
      {teamToDelete && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setTeamToDelete(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-slate-900 border border-rose-500/50 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/40 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  Excluir Time da Base?
                </h3>
                <p className="text-xs text-slate-400">
                  Confirmação de exclusão
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
              <p className="font-bold text-white text-sm">{teamToDelete.name} ({teamToDelete.code})</p>
              <p className="text-slate-400 text-[11px] mt-0.5">{teamToDelete.stadium} • {teamToDelete.city}</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setTeamToDelete(null)}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => {
                  const targetId = teamToDelete.id;
                  setTeamToDelete(null);
                  adminDeleteTeam(targetId);
                  setSuccessToast('Time removido da base de dados com sucesso!');
                  setTimeout(() => setSuccessToast(null), 4000);
                }}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sim, Excluir</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast Notification */}
      {successToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-black text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-300">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Direct Push Message Modal */}
      {selectedUserForMsg && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedUserForMsg(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    Enviar Notificação no App
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
                    Destino: <strong className="text-amber-300">{selectedUserForMsg.name}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForMsg(null)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick Templates */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 block">
                Modelos Rápidos de Mensagem:
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setDirectMsgTitle('✅ Comprovante PIX Aprovado!');
                    setDirectMsgText(`Olá ${selectedUserForMsg.name}, seu comprovante de pagamento foi validado com sucesso. Seus palpites estão confirmados no ranking!`);
                    setDirectMsgType('payment_confirmed');
                  }}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] font-bold text-emerald-400 transition-colors"
                >
                  PIX Aprovado
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDirectMsgTitle('⚠️ Comprovante com Problema');
                    setDirectMsgText(`Olá ${selectedUserForMsg.name}, por favor reenvie o comprovante PIX legível ou com o valor exato de R$ 10,00.`);
                    setDirectMsgType('payment_rejected');
                  }}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] font-bold text-rose-400 transition-colors"
                >
                  PIX Recusado
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDirectMsgTitle('⏰ Lembrete: Rodada Fechando!');
                    setDirectMsgText(`Não se esqueça de salvar seus palpites e enviar o comprovante antes do fechamento da rodada!`);
                    setDirectMsgType('round_open');
                  }}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] font-bold text-amber-300 transition-colors"
                >
                  Lembrete Prazo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDirectMsgTitle('🏆 Parabéns pela Pontuação!');
                    setDirectMsgText(`Excelente desempenho na rodada do Brasileirão 2026! Confira sua nova posição no ranking geral.`);
                    setDirectMsgType('results_ready');
                  }}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] font-bold text-sky-400 transition-colors"
                >
                  Parabéns Ranking
                </button>
              </div>
            </div>

            {/* Title & Message inputs */}
            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Título da Notificação:
                </label>
                <input
                  type="text"
                  value={directMsgTitle}
                  onChange={e => setDirectMsgTitle(e.target.value)}
                  placeholder="Ex: Aviso da Administração"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Mensagem / Notificação Push:
                </label>
                <textarea
                  rows={3}
                  value={directMsgText}
                  onChange={e => setDirectMsgText(e.target.value)}
                  placeholder="Digite a mensagem que o apostador receberá no sino de notificações..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:border-amber-400 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedUserForMsg(null)}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!directMsgTitle || !directMsgText) {
                    alert('Por favor, preencha o título e a mensagem!');
                    return;
                  }
                  adminSendNotification({
                    userId: selectedUserForMsg.id === 'broadcast-all' ? undefined : selectedUserForMsg.id,
                    title: directMsgTitle,
                    message: directMsgText,
                    type: directMsgType
                  });
                  setSelectedUserForMsg(null);
                  setSuccessToast(`Notificação enviada com sucesso para ${selectedUserForMsg.name}!`);
                  setTimeout(() => setSuccessToast(null), 4000);
                }}
                className="py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-950 transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Agora</span>
              </button>
            </div>
          </div>
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
