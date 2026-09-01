import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Round, UserBet, AppNotification, RankingEntry, Match, Team } from '../types';
import { INITIAL_USERS, INITIAL_ROUNDS, INITIAL_BETS, INITIAL_NOTIFICATIONS } from '../data/initialData';
import { BRASILEIRAO_TEAMS } from '../data/teams';
import { evaluateBet, isRoundBettingClosed } from '../utils/scoring';
import { fetchLiveSportsScores } from '../utils/sportsApi';
import confetti from 'canvas-confetti';

interface BolaoContextType {
  currentUser: User | null;
  users: User[];
  teams: Team[];
  rounds: Round[];
  bets: UserBet[];
  notifications: AppNotification[];
  selectedRoundId: number;
  selectedBetId: string | null;
  activeRound: Round | undefined;
  activeBet: UserBet | undefined;
  userRoundBets: UserBet[];
  unreadNotifsCount: number;
  pushToast: AppNotification | null;
  isAdmin: boolean;
  // User Actions
  login: (loginOrEmail: string, pass?: string) => { success: boolean; isAdmin?: boolean; message?: string };
  register: (data: { name: string; email: string; favoriteTeam: string; pixKey?: string; phone?: string }) => void;
  logout: () => void;
  switchUser: (userId: string, adminPass?: string) => { success: boolean; message?: string };
  setSelectedRoundId: (id: number) => void;
  setSelectedBetId: (id: string | null) => void;
  createNewBetForRound: (roundId: number) => UserBet | null;
  deleteDraftBet: (betId: string) => void;
  updatePrediction: (roundId: number, matchId: string, home: number | null, away: number | null, betId?: string) => void;
  getUserPredictionsForRound: (roundId: number, betId?: string) => Record<string, { home: number; away: number }>;
  lockAndProceedToPayment: (roundId: number, betId?: string) => { success: boolean; missingMatchId?: string; missingIndex?: number; message?: string };
  submitPixReceipt: (roundId: number, receiptUrl: string, txId?: string, betId?: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearPushToast: () => void;
  // Admin Actions
  adminApproveBet: (betId: string) => void;
  adminRejectBet: (betId: string, reason: string) => void;
  adminCreateRound: (newRound: Omit<Round, 'id' | 'totalPot'>) => void;
  adminDeleteRound: (roundId: number) => void;
  adminUpdateMatchScore: (roundId: number, matchId: string, home: number, away: number, status: 'scheduled' | 'live' | 'finished') => void;
  adminSyncSportsApiScores: (roundId: number) => Promise<void>;
  adminFinalizeRound: (roundId: number) => void;
  adminAddTeam: (teamData: Omit<Team, 'id'>) => void;
  adminDeleteTeam: (teamId: string) => void;
  adminUpdateTeam: (teamId: string, updated: Partial<Team>) => void;
  adminEditMatchTeams: (roundId: number, matchId: string, homeTeamName: string, awayTeamName: string, stadium?: string) => void;
  adminUpdateRoundDeadline: (roundId: number, newDeadline: string) => void;
  adminSendNotification: (data: { userId?: string; title: string; message: string; type?: AppNotification['type'] }) => void;
  adminUpdateUser: (userId: string, data: Partial<User>) => void;
  // Ranking
  getGlobalRanking: () => RankingEntry[];
  getRoundRanking: (roundId: number) => RankingEntry[];
}

const BolaoContext = createContext<BolaoContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'bolao2026_users',
  TEAMS: 'bolao2026_teams',
  ROUNDS: 'bolao2026_rounds',
  BETS: 'bolao2026_bets',
  NOTIFICATIONS: 'bolao2026_notifications',
  CURRENT_USER_ID: 'bolao2026_current_user_id',
  SELECTED_ROUND_ID: 'bolao2026_selected_round_id'
};

export const BolaoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    const loadedUsers: User[] = saved ? JSON.parse(saved) : INITIAL_USERS;
    const hasAdmin = loadedUsers.some(u => u.role === 'admin' || u.id === 'user-admin' || u.email.toLowerCase() === 'admin');
    if (!hasAdmin) {
      const defaultAdmin = INITIAL_USERS.find(u => u.role === 'admin') || {
        id: 'user-admin',
        name: 'Administrador Oficial',
        email: 'admin',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        favoriteTeam: 'Flamengo',
        pixKey: 'pix@bolao2026.com.br',
        phone: '(11) 99876-5432',
        createdAt: '2026-01-10T10:00:00Z',
        totalPoints: 0,
        totalExactHits: 0,
        totalOutcomeHits: 0,
        roundsParticipated: 0
      };
      return [defaultAdmin, ...loadedUsers];
    }
    return loadedUsers;
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEAMS);
    return saved ? JSON.parse(saved) : BRASILEIRAO_TEAMS;
  });

  const [rounds, setRounds] = useState<Round[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROUNDS);
    return saved ? JSON.parse(saved) : INITIAL_ROUNDS;
  });

  const [bets, setBets] = useState<UserBet[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BETS);
    return saved ? JSON.parse(saved) : INITIAL_BETS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const initialList: AppNotification[] = saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    
    // Ensure all notifications have unique IDs to prevent React duplicate key errors
    const seenIds = new Set<string>();
    return initialList.map((n, idx) => {
      if (!n.id || seenIds.has(n.id)) {
        const uniqueId = `notif-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`;
        seenIds.add(uniqueId);
        return { ...n, id: uniqueId };
      }
      seenIds.add(n.id);
      return n;
    });
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'user-1'; // Default to Carlos Eduardo
  });

  const [selectedRoundId, setSelectedRoundId] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_ROUND_ID);
    return saved ? Number(saved) : 2; // Default to Round 2 (Open)
  });

  const [selectedBetId, setSelectedBetId] = useState<string | null>(null);
  const [pushToast, setPushToast] = useState<AppNotification | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROUNDS, JSON.stringify(rounds));
  }, [rounds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BETS, JSON.stringify(bets));
  }, [bets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_ROUND_ID, selectedRoundId.toString());
  }, [selectedRoundId]);

  const currentUser = users.find(u => u.id === currentUserId) || null;
  const isAdmin = currentUser?.role === 'admin';

  const visibleRounds = rounds.filter(r => !r.isArchived);
  const activeRound = visibleRounds.find(r => r.id === selectedRoundId) || visibleRounds[0];

  const userRoundBets = bets.filter(b => b.userId === currentUserId && b.roundId === selectedRoundId);
  const activeBet = selectedBetId
    ? userRoundBets.find(b => b.id === selectedBetId) || userRoundBets[0]
    : (userRoundBets[userRoundBets.length - 1] || userRoundBets[0]);

  const unreadNotifsCount = notifications.filter(n => !n.read && (!n.userId || n.userId === currentUserId)).length;

  const triggerPush = useCallback((notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    const uniqueSuffix = Math.random().toString(36).substring(2, 8) + '-' + Math.floor(Math.random() * 10000);
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${uniqueSuffix}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    setPushToast(newNotif);

    // Auto-dismiss push toast after 6 seconds
    setTimeout(() => {
      setPushToast(curr => (curr?.id === newNotif.id ? null : curr));
    }, 6000);
  }, []);

  const clearPushToast = () => setPushToast(null);

  const login = (loginOrEmail: string, pass?: string): { success: boolean; isAdmin?: boolean; message?: string } => {
    const cleanInput = (loginOrEmail || '').trim().toLowerCase();
    const cleanPass = (pass || '').trim();

    const isAdminIdentifier =
      cleanInput === 'admin' ||
      cleanInput === 'adm' ||
      cleanInput === 'administrador' ||
      cleanInput === 'admin@bolao.com' ||
      cleanInput === 'adm@bolao.com' ||
      cleanInput === 'admin@bolao2026.com.br' ||
      cleanInput === 'adm@bolao2026.com.br' ||
      cleanInput === 'admin@email.com';

    // Check for Admin access constraint
    if (isAdminIdentifier) {
      if (cleanPass !== '228891') {
        return {
          success: false,
          message: 'Senha de Administrador incorreta.'
        };
      }

      let adminUser = users.find(u => u.role === 'admin' || u.id === 'user-admin' || u.email.toLowerCase() === 'admin');
      if (!adminUser) {
        adminUser = {
          id: 'user-admin',
          name: 'Administrador Oficial',
          email: 'admin',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          favoriteTeam: 'Flamengo',
          pixKey: 'pix@bolao2026.com.br',
          phone: '(11) 99876-5432',
          createdAt: new Date().toISOString(),
          totalPoints: 0,
          totalExactHits: 0,
          totalOutcomeHits: 0,
          roundsParticipated: 0
        };
        setUsers(prev => [adminUser!, ...prev.filter(u => u.id !== 'user-admin')]);
      } else if (adminUser.role !== 'admin') {
        adminUser = { ...adminUser, role: 'admin' };
        setUsers(prev => prev.map(u => u.id === adminUser!.id ? { ...u, role: 'admin' } : u));
      }

      setCurrentUserId(adminUser.id);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, adminUser.id);

      triggerPush({
        title: '🛡️ Modo Administrador Autenticado',
        message: 'Você entrou na conta ADM com sucesso. O Painel de Administração está liberado.',
        type: 'system',
        userId: adminUser.id
      });
      return { success: true, isAdmin: true };
    }

    // Check regular users
    const user = users.find(
      u => u.email.toLowerCase() === cleanInput || u.name.toLowerCase() === cleanInput
    );

    if (user) {
      if (user.role === 'admin') {
        if (cleanPass !== '228891') {
          return {
            success: false,
            message: 'Senha incorreta para esta conta de Administrador.'
          };
        }
      }
      setCurrentUserId(user.id);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
      return { success: true, isAdmin: user.role === 'admin' };
    }

    return {
      success: false,
      message: 'Usuário ou e-mail não encontrado. Verifique os dados digitados ou cadastre-se.'
    };
  };

  const register = (data: { name: string; email: string; favoriteTeam: string; pixKey?: string; phone?: string }) => {
    const newUser: User = {
      id: 'user-' + Date.now(),
      name: data.name,
      email: data.email,
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
      favoriteTeam: data.favoriteTeam,
      pixKey: data.pixKey || '',
      phone: data.phone || '',
      createdAt: new Date().toISOString(),
      totalPoints: 0,
      totalExactHits: 0,
      totalOutcomeHits: 0,
      roundsParticipated: 0
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    triggerPush({
      title: '🎉 Bem-vindo ao Bolão Brasileirão 2026!',
      message: `Olá ${data.name}, seu cadastro foi concluído. Participe da rodada ativa e concorra aos prêmios!`,
      type: 'system',
      userId: newUser.id
    });
  };

  const logout = () => {
    const firstUser = users.find(u => u.role === 'user') || users[0];
    if (firstUser) setCurrentUserId(firstUser.id);
  };

  const switchUser = (userId: string, adminPass?: string): { success: boolean; message?: string } => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser?.role === 'admin') {
      if (adminPass !== '228891') {
        return {
          success: false,
          message: 'Acesso restrito: Credenciais de Administrador obrigatórias.'
        };
      }
    }
    setCurrentUserId(userId);
    return { success: true };
  };

  const createNewBetForRound = (roundId: number): UserBet | null => {
    if (!currentUser) return null;

    const round = rounds.find(r => r.id === roundId);
    if (round) {
      const closedCheck = isRoundBettingClosed(round);
      if (closedCheck.isClosed) {
        triggerPush({
          title: '🔒 Rodada Fechada',
          message: 'Não é possível criar novo palpite pois a rodada já encerrou ou o 1º jogo começou.',
          type: 'system',
          roundId,
          userId: currentUserId
        });
        return null;
      }
    }

    const currentRoundBets = bets.filter(b => b.userId === currentUserId && b.roundId === roundId);
    const betNumber = currentRoundBets.length + 1;
    const newBetId = `bet-r${roundId}-${currentUserId}-${Date.now()}`;
    const newBet: UserBet = {
      id: newBetId,
      userId: currentUserId,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userAvatar: currentUser.avatar,
      roundId,
      betNumber,
      betLabel: `Palpite #${betNumber}`,
      predictions: {},
      status: 'draft',
      createdAt: new Date().toISOString(),
      isLocked: false
    };

    setBets(prev => [...prev, newBet]);
    setSelectedBetId(newBetId);

    triggerPush({
      title: `🎫 Novo Bilhete Criado: Palpite #${betNumber}`,
      message: `Você iniciou o Palpite #${betNumber} para a Rodada ${roundId}. Preencha os 10 jogos para travar e pagar a taxa via PIX!`,
      type: 'system',
      roundId,
      userId: currentUserId
    });

    return newBet;
  };

  const deleteDraftBet = (betId: string) => {
    const targetBet = bets.find(b => b.id === betId);
    if (!targetBet || (targetBet.isLocked && targetBet.status !== 'draft')) return;

    setBets(prev => prev.filter(b => b.id !== betId));
    setSelectedBetId(null);
  };

  const getUserPredictionsForRound = (roundId: number, betId?: string): Record<string, { home: number; away: number }> => {
    const roundBets = bets.filter(b => b.userId === currentUserId && b.roundId === roundId);
    if (roundBets.length === 0) return {};

    let targetBet: UserBet | undefined;
    if (betId) {
      targetBet = roundBets.find(b => b.id === betId);
    } else if (selectedBetId) {
      targetBet = roundBets.find(b => b.id === selectedBetId);
    }
    if (!targetBet) {
      targetBet = roundBets[roundBets.length - 1] || roundBets[0];
    }
    return targetBet ? targetBet.predictions : {};
  };

  const updatePrediction = (
    roundId: number, 
    matchId: string, 
    home: number | null, 
    away: number | null, 
    betId?: string
  ) => {
    if (!currentUser) return;

    const targetRound = rounds.find(r => r.id === roundId);
    if (targetRound) {
      const closedCheck = isRoundBettingClosed(targetRound);
      if (closedCheck.isClosed) {
        triggerPush({
          title: '🔒 Palpites Encerrados',
          message: `${closedCheck.reason} Não é possível alterar palpites depois que o 1º jogo começou.`,
          type: 'system'
        });
        return;
      }
    }

    setBets(prev => {
      const userRoundBetsList = prev.filter(b => b.userId === currentUserId && b.roundId === roundId);
      let targetBetId = betId || selectedBetId;
      let target = userRoundBetsList.find(b => b.id === targetBetId);

      // If target is locked or not found, see if we have an active unlocked draft
      if (!target || (target.isLocked && target.status !== 'draft')) {
        const editableDraft = userRoundBetsList.find(b => !b.isLocked && b.status === 'draft');
        if (editableDraft) {
          target = editableDraft;
          targetBetId = editableDraft.id;
        }
      }

      if (target) {
        if (target.isLocked && target.status !== 'draft') {
          return prev;
        }

        return prev.map(b => {
          if (b.id === target!.id) {
            const updatedPreds = { ...b.predictions };
            if (home === null || away === null) {
              delete updatedPreds[matchId];
            } else {
              updatedPreds[matchId] = { home, away };
            }
            return {
              ...b,
              predictions: updatedPreds
            };
          }
          return b;
        });
      } else {
        if (home === null || away === null) return prev;
        const betNum = userRoundBetsList.length + 1;
        const newBetId = `bet-r${roundId}-${currentUserId}-${Date.now()}`;
        const newBet: UserBet = {
          id: newBetId,
          userId: currentUserId,
          userName: currentUser.name,
          userEmail: currentUser.email,
          userAvatar: currentUser.avatar,
          roundId,
          betNumber: betNum,
          betLabel: `Palpite #${betNum}`,
          predictions: { [matchId]: { home, away } },
          status: 'draft',
          createdAt: new Date().toISOString(),
          isLocked: false
        };
        setSelectedBetId(newBetId);
        return [...prev, newBet];
      }
    });
  };

  /**
   * Validates if all 10 matches are filled for the selected bet.
   * If any match is missing, returns the missing matchId and index so UI can auto-scroll to it.
   */
  const lockAndProceedToPayment = (roundId: number, betId?: string): { success: boolean; missingMatchId?: string; missingIndex?: number; message?: string } => {
    const round = rounds.find(r => r.id === roundId);
    if (!round) return { success: false, message: 'Rodada não encontrada' };

    // Check if 1st game started or deadline passed
    const closedCheck = isRoundBettingClosed(round);
    if (closedCheck.isClosed) {
      return {
        success: false,
        message: `Não é possível registrar palpites. ${closedCheck.reason}`
      };
    }

    const roundBets = bets.filter(b => b.userId === currentUserId && b.roundId === roundId);
    const targetBet = (betId ? roundBets.find(b => b.id === betId) : null) ||
                      (selectedBetId ? roundBets.find(b => b.id === selectedBetId) : null) ||
                      roundBets.find(b => !b.isLocked && b.status === 'draft') ||
                      roundBets[roundBets.length - 1];

    if (!targetBet) {
      return {
        success: false,
        message: 'Nenhum palpite em edição encontrado para travar. Preencha os 10 jogos.'
      };
    }

    const predictions = targetBet.predictions || {};

    // Check all 10 matches
    for (let i = 0; i < round.matches.length; i++) {
      const match = round.matches[i];
      const p = predictions[match.id];
      if (!p || p.home === undefined || p.home === null || p.away === undefined || p.away === null) {
        return {
          success: false,
          missingMatchId: match.id,
          missingIndex: i + 1,
          message: `Falta preencher o palpite do jogo ${i + 1}: ${match.homeTeam} x ${match.awayTeam}. Todos os 10 palpites são obrigatórios no ${targetBet.betLabel || 'bilhete'}!`
        };
      }
    }

    // All 10 matches predicted! Lock this specific bet and change status to locked_pending_payment
    setBets(prev => {
      return prev.map(b => {
        if (b.id === targetBet.id) {
          return {
            ...b,
            isLocked: true,
            status: 'locked_pending_payment'
          };
        }
        return b;
      });
    });

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.75 }
      });
    } catch {
      // ignore
    }

    return {
      success: true,
      message: `Os 10 palpites do ${targetBet.betLabel || 'bilhete'} foram travados com sucesso! Agora realize o pagamento de R$ 10,00 via PIX para validar sua participação.`
    };
  };

  const submitPixReceipt = (roundId: number, receiptUrl: string, txId?: string, betId?: string) => {
    const roundBets = bets.filter(b => b.userId === currentUserId && b.roundId === roundId);
    const targetBet = (betId ? roundBets.find(b => b.id === betId) : null) ||
                      (selectedBetId ? roundBets.find(b => b.id === selectedBetId) : null) ||
                      roundBets.find(b => b.status === 'locked_pending_payment') ||
                      roundBets[roundBets.length - 1];

    if (!targetBet) return;

    setBets(prev => {
      return prev.map(b => {
        if (b.id === targetBet.id) {
          return {
            ...b,
            status: 'receipt_submitted',
            receiptUrl: receiptUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
            receiptUploadedAt: new Date().toISOString(),
            adminNotes: undefined
          };
        }
        return b;
      });
    });

    triggerPush({
      title: `📤 Comprovante PIX do ${targetBet.betLabel || 'Palpite'} Enviado!`,
      message: `Seu comprovante de R$ 10,00 foi enviado para análise do Administrador. Você já pode fazer outro palpite adicional se quiser!`,
      type: 'system',
      roundId,
      userId: currentUserId
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // ADMIN ACTIONS
  const adminApproveBet = (betId: string) => {
    const betToApprove = bets.find(b => b.id === betId);
    if (!betToApprove) return;

    setBets(prev =>
      prev.map(b => {
        if (b.id === betId) {
          return {
            ...b,
            status: 'confirmed',
            paymentConfirmedAt: new Date().toISOString(),
            adminNotes: 'Aprovado pelo administrador'
          };
        }
        return b;
      })
    );

    // Increase round pot by R$ 10
    setRounds(prev =>
      prev.map(r => {
        if (r.id === betToApprove.roundId) {
          return {
            ...r,
            totalPot: (r.totalPot || 0) + 10.00
          };
        }
        return r;
      })
    );

    // Push notification to user
    triggerPush({
      title: '✅ Comprovante PIX Aprovado!',
      message: `Seu palpite da Rodada ${betToApprove.roundId} foi confirmado pelo Administrador! Seus pontos agora contarão oficialmente no Ranking.`,
      type: 'payment_confirmed',
      roundId: betToApprove.roundId,
      userId: betToApprove.userId
    });
  };

  const adminRejectBet = (betId: string, reason: string) => {
    const betToReject = bets.find(b => b.id === betId);
    if (!betToReject) return;

    setBets(prev =>
      prev.map(b => {
        if (b.id === betId) {
          return {
            ...b,
            status: 'rejected',
            adminNotes: reason || 'Comprovante inválido ou valor incorreto. Por favor envie novamente.'
          };
        }
        return b;
      })
    );

    // Push notification to user
    triggerPush({
      title: '⚠️ Comprovante PIX Não Aceito',
      message: `Seu comprovante da Rodada ${betToReject.roundId} não foi aprovado: ${reason || 'Comprovante ilegível ou inválido'}. Por favor envie novamente.`,
      type: 'payment_rejected',
      roundId: betToReject.roundId,
      userId: betToReject.userId
    });
  };

  const adminCreateRound = (newRoundData: Omit<Round, 'id' | 'totalPot'>) => {
    // If number is provided and not already taken by another round id, use it as ID, else get max+1
    const requestedNumber = newRoundData.number;
    const isIdTaken = rounds.some(r => r.id === requestedNumber);
    const newId = (requestedNumber && !isIdTaken)
      ? requestedNumber
      : (rounds.length > 0 ? Math.max(...rounds.map(r => r.id)) + 1 : 1);

    const formattedMatches = newRoundData.matches.map((m, idx) => ({
      ...m,
      id: m.id || `r${newId}-m${idx + 1}`,
      roundId: newId,
      homeScore: m.homeScore ?? null,
      awayScore: m.awayScore ?? null,
      status: m.status || 'scheduled'
    }));

    const newRound: Round = {
      ...newRoundData,
      id: newId,
      number: newRoundData.number || newId,
      totalPot: 0,
      matches: formattedMatches
    };

    setRounds(prev => [...prev, newRound]);
    setSelectedRoundId(newId);

    triggerPush({
      title: `🟢 Nova Rodada Criada: ${newRound.title}`,
      message: 'Uma nova rodada do Brasileirão 2026 foi aberta para palpites! Acesse e monte seus palpites.',
      type: 'round_open',
      roundId: newId
    });
  };

  const adminDeleteRound = (roundId: number) => {
    const targetRound = rounds.find(r => r.id === roundId);

    setRounds(prev => {
      const nextRounds = prev.filter(r => r.id !== roundId);
      return nextRounds;
    });

    setBets(prev => {
      const remainingBets = prev.filter(b => b.roundId !== roundId);

      // Update overall users total points based on all remaining confirmed bets
      setUsers(currentUsers => {
        return currentUsers.map(user => {
          const userConfirmedBets = remainingBets.filter(b => b.userId === user.id && b.status === 'confirmed');
          const totalPoints = userConfirmedBets.reduce((sum, b) => sum + (b.calculatedPoints || 0), 0);
          const exactHits = userConfirmedBets.reduce((sum, b) => sum + (b.exactHitsCount || 0), 0);
          const outcomeHits = userConfirmedBets.reduce((sum, b) => sum + (b.outcomeHitsCount || 0), 0);

          return {
            ...user,
            totalPoints,
            totalExactHits: exactHits,
            totalOutcomeHits: outcomeHits,
            roundsParticipated: userConfirmedBets.length
          };
        });
      });

      return remainingBets;
    });

    setSelectedRoundId(prevId => {
      if (prevId === roundId) {
        const remaining = rounds.filter(r => r.id !== roundId);
        return remaining.length > 0 ? remaining[0].id : 0;
      }
      return prevId;
    });

    triggerPush({
      title: '🗑️ Rodada Excluída com Sucesso',
      message: `A rodada "${targetRound?.title || 'Rodada'}" foi deletada do sistema.`,
      type: 'system'
    });
  };

  const adminUpdateRoundDeadline = (roundId: number, newDeadline: string) => {
    setRounds(prev =>
      prev.map(r => {
        if (r.id === roundId) {
          return {
            ...r,
            deadline: newDeadline
          };
        }
        return r;
      })
    );

    const target = rounds.find(r => r.id === roundId);
    triggerPush({
      title: '⏰ Horário Limite Atualizado',
      message: `O horário limite de palpites para "${target?.title || `Rodada ${roundId}`}" foi atualizado para ${new Date(newDeadline).toLocaleString('pt-BR')}.`,
      type: 'system',
      roundId
    });
  };

  const adminUpdateMatchScore = (
    roundId: number,
    matchId: string,
    home: number,
    away: number,
    status: 'scheduled' | 'live' | 'finished'
  ) => {
    setRounds(prev =>
      prev.map(r => {
        if (r.id === roundId) {
          const updatedMatches = r.matches.map(m => {
            if (m.id === matchId) {
              return { ...m, homeScore: home, awayScore: away, status };
            }
            return m;
          });
          return { ...r, matches: updatedMatches };
        }
        return r;
      })
    );

    // Recalculate bets for this round
    recalculateRoundScores(roundId);
  };

  const adminSyncSportsApiScores = async (roundId: number) => {
    const round = rounds.find(r => r.id === roundId);
    if (!round) return;

    // Fetch stats from sports API simulator
    const apiResults = await fetchLiveSportsScores(round.matches);

    // Apply scores
    setRounds(prev =>
      prev.map(r => {
        if (r.id === roundId) {
          const updatedMatches = r.matches.map(m => {
            const res = apiResults.find(ar => ar.matchId === m.id);
            if (res) {
              return {
                ...m,
                homeScore: res.homeScore,
                awayScore: res.awayScore,
                status: 'finished',
                liveEvents: res.events
              };
            }
            return m;
          });
          return { ...r, matches: updatedMatches, status: 'finished' };
        }
        return r;
      })
    );

    // Recalculate bets and points
    recalculateRoundScores(roundId, true);

    triggerPush({
      title: '📊 Placares Atualizados via API Esportiva!',
      message: `Os placares oficiais da Rodada ${round.number} foram sincronizados e os pontos do ranking foram computados!`,
      type: 'stats_update',
      roundId
    });
  };

  const recalculateRoundScores = (roundId: number, notify: boolean = false) => {
    setRounds(latestRounds => {
      const targetRound = latestRounds.find(r => r.id === roundId);
      if (!targetRound) return latestRounds;

      setBets(currentBets => {
        const updatedBets = currentBets.map(bet => {
          if (bet.roundId === roundId && bet.status === 'confirmed') {
            const evalResult = evaluateBet(bet.predictions, targetRound.matches);
            return {
              ...bet,
              calculatedPoints: evalResult.totalPoints,
              exactHitsCount: evalResult.exactHits,
              outcomeHitsCount: evalResult.outcomeHits,
              wrongHitsCount: evalResult.wrongHits
            };
          }
          return bet;
        });

        // Update overall users total points based on all confirmed bets
        setUsers(currentUsers => {
          return currentUsers.map(user => {
            const userConfirmedBets = updatedBets.filter(b => b.userId === user.id && b.status === 'confirmed');
            const totalPoints = userConfirmedBets.reduce((sum, b) => sum + (b.calculatedPoints || 0), 0);
            const exactHits = userConfirmedBets.reduce((sum, b) => sum + (b.exactHitsCount || 0), 0);
            const outcomeHits = userConfirmedBets.reduce((sum, b) => sum + (b.outcomeHitsCount || 0), 0);

            return {
              ...user,
              totalPoints,
              totalExactHits: exactHits,
              totalOutcomeHits: outcomeHits,
              roundsParticipated: userConfirmedBets.length
            };
          });
        });

        return updatedBets;
      });

      return latestRounds;
    });

    if (notify) {
      triggerPush({
        title: '🏆 Resultados & Pontuações Calculadas!',
        message: 'Placares consolidados: 3 pontos para placar exato e 1 ponto para acerto de resultado. Veja sua posição no ranking!',
        type: 'results_ready',
        roundId
      });
    }
  };

  const adminFinalizeRound = (roundId: number) => {
    setRounds(prev =>
      prev.map(r => {
        if (r.id === roundId) {
          return { ...r, status: 'finished' };
        }
        return r;
      })
    );
    recalculateRoundScores(roundId, true);
  };

  const adminAddTeam = (teamData: Omit<Team, 'id'>) => {
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    };
    setTeams(prev => [...prev, newTeam]);
    triggerPush({
      title: '🛡️ Novo Clube Cadastrado!',
      message: `O time "${teamData.name}" (${teamData.code}) foi adicionado com sucesso pelo Administrador.`,
      type: 'system'
    });
  };

  const adminDeleteTeam = (teamId: string) => {
    const target = teams.find(t => t.id === teamId);
    setTeams(prev => prev.filter(t => t.id !== teamId));
    triggerPush({
      title: '🛡️ Time Removido!',
      message: `O time "${target?.name || 'Clube'}" foi excluído da lista de times.`,
      type: 'system'
    });
  };

  const adminUpdateTeam = (teamId: string, updated: Partial<Team>) => {
    const oldTeam = teams.find(t => t.id === teamId);
    const oldName = oldTeam?.name;

    setTeams(prev => prev.map(t => (t.id === teamId ? { ...t, ...updated } : t)));

    // Cascade changes to match cards in rounds
    if (oldName && (updated.name || updated.code || updated.stadium || updated.logo)) {
      setRounds(prevRounds =>
        prevRounds.map(round => ({
          ...round,
          matches: round.matches.map(m => {
            let modMatch = { ...m };
            if (m.homeTeam === oldName) {
              modMatch.homeTeam = updated.name || m.homeTeam;
              if (updated.code) modMatch.homeTeamCode = updated.code;
              if (updated.logo) modMatch.homeTeamLogo = updated.logo;
              if (updated.stadium) modMatch.stadium = `${updated.stadium} (${(updated.city || oldTeam?.city || '').slice(0, 2).toUpperCase()})`;
            }
            if (m.awayTeam === oldName) {
              modMatch.awayTeam = updated.name || m.awayTeam;
              if (updated.code) modMatch.awayTeamCode = updated.code;
              if (updated.logo) modMatch.awayTeamLogo = updated.logo;
            }
            return modMatch;
          })
        }))
      );
    }

    triggerPush({
      title: '🛡️ Dados do Time Atualizados!',
      message: `As informações do clube "${updated.name || oldTeam?.name}" foram salvas pelo Administrador.`,
      type: 'system'
    });
  };

  const adminEditMatchTeams = (
    roundId: number,
    matchId: string,
    homeTeamName: string,
    awayTeamName: string,
    stadium?: string
  ) => {
    const home = teams.find(t => t.name === homeTeamName);
    const away = teams.find(t => t.name === awayTeamName);

    setRounds(prev =>
      prev.map(r => {
        if (r.id === roundId) {
          const updatedMatches = r.matches.map(m => {
            if (m.id === matchId) {
              return {
                ...m,
                homeTeam: home ? home.name : homeTeamName,
                homeTeamCode: home ? home.code : homeTeamName.slice(0, 3).toUpperCase(),
                homeTeamLogo: home ? home.logo : m.homeTeamLogo,
                awayTeam: away ? away.name : awayTeamName,
                awayTeamCode: away ? away.code : awayTeamName.slice(0, 3).toUpperCase(),
                awayTeamLogo: away ? away.logo : m.awayTeamLogo,
                stadium: stadium || (home ? `${home.stadium} (${home.city.slice(0, 2).toUpperCase()})` : m.stadium)
              };
            }
            return m;
          });
          return { ...r, matches: updatedMatches };
        }
        return r;
      })
    );
  };

  const adminSendNotification = (data: { userId?: string; title: string; message: string; type?: AppNotification['type'] }) => {
    triggerPush({
      title: data.title,
      message: data.message,
      type: data.type || 'system',
      userId: data.userId
    });
  };

  const adminUpdateUser = (userId: string, data: Partial<User>) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          return { ...u, ...data };
        }
        return u;
      })
    );
  };

  // Ranking calculation
  const getGlobalRanking = (): RankingEntry[] => {
    const list: RankingEntry[] = users
      .filter(u => u.role !== 'admin')
      .map(u => {
        return {
          userId: u.id,
          name: u.name,
          avatar: u.avatar,
          favoriteTeam: u.favoriteTeam,
          totalPoints: u.totalPoints,
          exactHits: u.totalExactHits,
          outcomeHits: u.totalOutcomeHits,
          roundsCount: u.roundsParticipated,
          position: 0
        };
      });

    // Sort: 1. totalPoints desc, 2. exactHits desc, 3. outcomeHits desc, 4. name asc
    list.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.exactHits !== a.exactHits) return b.exactHits - a.exactHits;
      if (b.outcomeHits !== a.outcomeHits) return b.outcomeHits - a.outcomeHits;
      return a.name.localeCompare(b.name);
    });

    return list.map((entry, idx) => ({ ...entry, position: idx + 1 }));
  };

  const getRoundRanking = (roundId: number): RankingEntry[] => {
    const confirmedRoundBets = bets.filter(b => b.roundId === roundId && b.status === 'confirmed');
    const targetRound = rounds.find(r => r.id === roundId);

    // Group bets by userId and pick the user's best performing bet in this round
    const userBestBetsMap = new Map<string, {
      bet: UserBet;
      points: number;
      exactHits: number;
      outcomeHits: number;
    }>();

    confirmedRoundBets.forEach(bet => {
      const evalRes = targetRound ? evaluateBet(bet.predictions, targetRound.matches) : { totalPoints: 0, exactHits: 0, outcomeHits: 0 };
      const pts = bet.calculatedPoints !== undefined ? bet.calculatedPoints : evalRes.totalPoints;
      const exact = bet.exactHitsCount !== undefined ? bet.exactHitsCount : evalRes.exactHits;
      const outcome = bet.outcomeHitsCount !== undefined ? bet.outcomeHitsCount : evalRes.outcomeHits;

      const existing = userBestBetsMap.get(bet.userId);
      if (!existing) {
        userBestBetsMap.set(bet.userId, { bet, points: pts, exactHits: exact, outcomeHits: outcome });
      } else {
        // Tiebreak: points > exactHits > outcomeHits
        if (
          pts > existing.points ||
          (pts === existing.points && exact > existing.exactHits) ||
          (pts === existing.points && exact === existing.exactHits && outcome > existing.outcomeHits)
        ) {
          userBestBetsMap.set(bet.userId, { bet, points: pts, exactHits: exact, outcomeHits: outcome });
        }
      }
    });

    const list: RankingEntry[] = Array.from(userBestBetsMap.values()).map(({ bet, points, exactHits, outcomeHits }) => {
      const user = users.find(u => u.id === bet.userId);

      return {
        userId: bet.userId,
        name: bet.userName || user?.name || 'Participante',
        avatar: bet.userAvatar || user?.avatar || '',
        favoriteTeam: user?.favoriteTeam || 'Brasil',
        totalPoints: points,
        exactHits: exactHits,
        outcomeHits: outcomeHits,
        roundsCount: 1,
        position: 0,
        lastRoundPoints: points,
        bestBetLabel: bet.betLabel || 'Palpite #1',
        isRoundWinner: false
      };
    });

    list.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.exactHits !== a.exactHits) return b.exactHits - a.exactHits;
      if (b.outcomeHits !== a.outcomeHits) return b.outcomeHits - a.outcomeHits;
      return a.name.localeCompare(b.name);
    });

    const maxPoints = list.length > 0 ? list[0].totalPoints : 0;

    return list.map((entry, idx) => ({
      ...entry,
      position: idx + 1,
      // Crown round winner if they hold position 1 and have positive points or round has concluded
      isRoundWinner: idx === 0 && (maxPoints > 0 || targetRound?.status === 'finished')
    }));
  };

  return (
    <BolaoContext.Provider
      value={{
        currentUser,
        users,
        teams,
        rounds: visibleRounds,
        bets,
        notifications,
        selectedRoundId,
        selectedBetId,
        activeRound,
        activeBet,
        userRoundBets,
        unreadNotifsCount,
        pushToast,
        isAdmin,
        login,
        register,
        logout,
        switchUser,
        setSelectedRoundId,
        setSelectedBetId,
        createNewBetForRound,
        deleteDraftBet,
        updatePrediction,
        getUserPredictionsForRound,
        lockAndProceedToPayment,
        submitPixReceipt,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearPushToast,
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
        adminEditMatchTeams,
        adminUpdateRoundDeadline,
        adminSendNotification,
        adminUpdateUser,
        getGlobalRanking,
        getRoundRanking
      }}
    >
      {children}
    </BolaoContext.Provider>
  );
};

export const useBolao = () => {
  const context = useContext(BolaoContext);
  if (!context) {
    throw new Error('useBolao must be used within a BolaoProvider');
  }
  return context;
};
