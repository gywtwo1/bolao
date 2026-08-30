import { Round, User, UserBet, AppNotification } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Administrador Oficial',
    email: 'adm@bolao.com',
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
  },
  {
    id: 'user-1',
    name: 'Carlos Eduardo Silva',
    email: 'carlos@email.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    favoriteTeam: 'Palmeiras',
    pixKey: 'carlos.pix@email.com',
    phone: '(11) 98111-2233',
    createdAt: '2026-02-01T12:00:00Z',
    totalPoints: 16,
    totalExactHits: 4,
    totalOutcomeHits: 4,
    roundsParticipated: 1
  },
  {
    id: 'user-2',
    name: 'Gabriela Santos',
    email: 'gabriela@email.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    favoriteTeam: 'São Paulo',
    pixKey: '11982223344',
    phone: '(11) 98222-3344',
    createdAt: '2026-02-02T14:30:00Z',
    totalPoints: 14,
    totalExactHits: 3,
    totalOutcomeHits: 5,
    roundsParticipated: 1
  },
  {
    id: 'user-3',
    name: 'Marcos Vinícius',
    email: 'marcos@email.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    favoriteTeam: 'Corinthians',
    pixKey: 'marcos.v@banco.com',
    phone: '(11) 98333-4455',
    createdAt: '2026-02-03T16:00:00Z',
    totalPoints: 11,
    totalExactHits: 2,
    totalOutcomeHits: 5,
    roundsParticipated: 1
  },
  {
    id: 'user-4',
    name: 'Fernanda Lima',
    email: 'fernanda@email.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    favoriteTeam: 'Atlético-MG',
    pixKey: 'fernanda.lima@email.com',
    phone: '(31) 98444-5566',
    createdAt: '2026-02-04T18:20:00Z',
    totalPoints: 10,
    totalExactHits: 2,
    totalOutcomeHits: 4,
    roundsParticipated: 1
  },
  {
    id: 'user-5',
    name: 'Lucas Ferreira',
    email: 'lucas@email.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    favoriteTeam: 'Grêmio',
    pixKey: '51985556677',
    phone: '(51) 98555-6677',
    createdAt: '2026-02-05T09:15:00Z',
    totalPoints: 7,
    totalExactHits: 1,
    totalOutcomeHits: 4,
    roundsParticipated: 1
  }
];

export const INITIAL_ROUNDS: Round[] = [
  {
    id: 1,
    number: 1,
    title: '1ª Rodada - Abertura Brasileirão 2026',
    season: '2026',
    price: 10.00,
    status: 'finished',
    deadline: '2026-04-12T16:00:00Z',
    totalPot: 50.00,
    matches: [
      {
        id: 'r1-m1',
        roundId: 1,
        homeTeam: 'Flamengo',
        homeTeamCode: 'FLA',
        homeTeamLogo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop&q=60',
        awayTeam: 'São Paulo',
        awayTeamCode: 'SAO',
        awayTeamLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=60',
        date: '12/04 • 16:00',
        stadium: 'Maracanã (RJ)',
        homeScore: 2,
        awayScore: 1,
        status: 'finished'
      },
      {
        id: 'r1-m2',
        roundId: 1,
        homeTeam: 'Palmeiras',
        homeTeamCode: 'PAL',
        homeTeamLogo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=60',
        awayTeam: 'Corinthians',
        awayTeamCode: 'COR',
        awayTeamLogo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=100&auto=format&fit=crop&q=60',
        date: '12/04 • 18:30',
        stadium: 'Allianz Parque (SP)',
        homeScore: 2,
        awayScore: 0,
        status: 'finished'
      },
      {
        id: 'r1-m3',
        roundId: 1,
        homeTeam: 'Atlético-MG',
        homeTeamCode: 'CAM',
        homeTeamLogo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100&auto=format&fit=crop&q=60',
        awayTeam: 'Cruzeiro',
        awayTeamCode: 'CRU',
        awayTeamLogo: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=100&auto=format&fit=crop&q=60',
        date: '12/04 • 19:00',
        stadium: 'Arena MRV (MG)',
        homeScore: 1,
        awayScore: 1,
        status: 'finished'
      },
      {
        id: 'r1-m4',
        roundId: 1,
        homeTeam: 'Grêmio',
        homeTeamCode: 'GRE',
        homeTeamLogo: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=100&auto=format&fit=crop&q=60',
        awayTeam: 'Internacional',
        awayTeamCode: 'INT',
        awayTeamLogo: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&auto=format&fit=crop&q=60',
        date: '13/04 • 16:00',
        stadium: 'Arena do Grêmio (RS)',
        homeScore: 3,
        awayScore: 2,
        status: 'finished'
      },
      {
        id: 'r1-m5',
        roundId: 1,
        homeTeam: 'Fluminense',
        homeTeamCode: 'FLU',
        homeTeamLogo: 'https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=100&auto=format&fit=crop&q=60',
        awayTeam: 'Botafogo',
        awayTeamCode: 'BOT',
        awayTeamLogo: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=100&auto=format&fit=crop&q=60',
        date: '13/04 • 18:30',
        stadium: 'Maracanã (RJ)',
        homeScore: 0,
        awayScore: 1,
        status: 'finished'
      },
      {
        id: 'r1-m6',
        roundId: 1,
        homeTeam: 'Bahia',
        homeTeamCode: 'BAH',
        homeTeamLogo: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&auto=format&fit=crop&q=60',
        awayTeam: 'Vitória',
        awayTeamCode: 'VIT',
        awayTeamLogo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100&auto=format&fit=crop&q=60',
        date: '13/04 • 16:00',
        stadium: 'Arena Fonte Nova (BA)',
        homeScore: 2,
        awayScore: 2,
        status: 'finished'
      },
      {
        id: 'r1-m7',
        roundId: 1,
        homeTeam: 'Vasco da Gama',
        homeTeamCode: 'VAS',
        homeTeamLogo: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=100&auto=format&fit=crop&q=60',
        awayTeam: 'Santos',
        awayTeamCode: 'SAN',
        awayTeamLogo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=60',
        date: '13/04 • 18:30',
        stadium: 'São Januário (RJ)',
        homeScore: 1,
        awayScore: 0,
        status: 'finished'
      },
      {
        id: 'r1-m8',
        roundId: 1,
        homeTeam: 'Fortaleza',
        homeTeamCode: 'FOR',
        homeTeamLogo: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=100&auto=format&fit=crop&q=60',
        awayTeam: 'Athletico-PR',
        awayTeamCode: 'CAP',
        awayTeamLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=60',
        date: '13/04 • 20:00',
        stadium: 'Arena Castelão (CE)',
        homeScore: 2,
        awayScore: 1,
        status: 'finished'
      },
      {
        id: 'r1-m9',
        roundId: 1,
        homeTeam: 'Red Bull Bragantino',
        homeTeamCode: 'RBB',
        homeTeamLogo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop&q=60',
        awayTeam: 'Juventude',
        awayTeamCode: 'JUV',
        awayTeamLogo: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&auto=format&fit=crop&q=60',
        date: '13/04 • 18:30',
        stadium: 'Nabi Abi Chedid (SP)',
        homeScore: 3,
        awayScore: 0,
        status: 'finished'
      },
      {
        id: 'r1-m10',
        roundId: 1,
        homeTeam: 'Sport Recife',
        homeTeamCode: 'SPO',
        homeTeamLogo: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=100&auto=format&fit=crop&q=60',
        awayTeam: 'Criciúma',
        awayTeamCode: 'CRI',
        awayTeamLogo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=100&auto=format&fit=crop&q=60',
        date: '13/04 • 20:00',
        stadium: 'Ilha do Retiro (PE)',
        homeScore: 1,
        awayScore: 1,
        status: 'finished'
      }
    ]
  },
  {
    id: 2,
    number: 2,
    title: '2ª Rodada - Brasileirão 2026 (Aberta)',
    season: '2026',
    price: 10.00,
    status: 'open',
    deadline: '2026-04-19T16:00:00Z',
    totalPot: 60.00,
    matches: [
      {
        id: 'r2-m1',
        roundId: 2,
        homeTeam: 'São Paulo',
        homeTeamCode: 'SAO',
        homeTeamLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=60',
        awayTeam: 'Palmeiras',
        awayTeamCode: 'PAL',
        awayTeamLogo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=60',
        date: '19/04 • 16:00',
        stadium: 'MorumBIS (SP)',
        homeScore: null,
        awayScore: null,
        status: 'scheduled'
      },
      {
        id: 'r2-m2',
        roundId: 2,
        homeTeam: 'Corinthians',
        homeTeamCode: 'COR',
        homeTeamLogo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=100&auto=format&fit=crop&q=60',
        awayTeam: 'Flamengo',
        awayTeamCode: 'FLA',
        awayTeamLogo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop&q=60',
        date: '19/04 • 18:30',
        stadium: 'Neo Química Arena (SP)',
        homeScore: null,
        awayScore: null,
        status: 'scheduled'
      },
      {
        id: 'r2-m3',
        roundId: 2,
        homeTeam: 'Cruzeiro',
        homeTeamCode: 'CRU',
        homeTeamLogo: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=100&auto=format&fit=crop&q=60',
        awayTeam: 'Grêmio',
        awayTeamCode: 'GRE',
        awayTeamLogo: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=100&auto=format&fit=crop&q=60',
        date: '19/04 • 19:00',
        stadium: 'Mineirão (MG)',
        homeScore: null,
        awayScore: null,
        status: 'scheduled'
      },
      {
        id: 'r2-m4',
        roundId: 2,
        homeTeam: 'Internacional',
        homeTeamCode: 'INT',
        homeTeamLogo: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&auto=format&fit=crop&q=60',
        awayTeam: 'Atlético-MG',
        awayTeamCode: 'CAM',
        awayTeamLogo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100&auto=format&fit=crop&q=60',
        date: '20/04 • 16:00',
        stadium: 'Beira-Rio (RS)',
        homeScore: null,
        awayScore: null,
        status: 'scheduled'
      },
      {
        id: 'r2-m5',
        roundId: 2,
        homeTeam: 'Botafogo',
        homeTeamCode: 'BOT',
        homeTeamLogo: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=100&auto=format&fit=crop&q=60',
        awayTeam: 'Bahia',
        awayTeamCode: 'BAH',
        awayTeamLogo: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=100&auto=format&fit=crop&q=60',
        date: '20/04 • 18:30',
        stadium: 'Nilton Santos (RJ)',
        homeScore: null,
        awayScore: null,
        status: 'scheduled'
      },
      {
        id: 'r2-m6',
        roundId: 2,
        homeTeam: 'Santos',
        homeTeamCode: 'SAN',
        homeTeamLogo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&auto=format&fit=crop&q=60',
        awayTeam: 'Fluminense',
        awayTeamCode: 'FLU',
        awayTeamLogo: 'https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=100&auto=format&fit=crop&q=60',
        date: '20/04 • 16:00',
        stadium: 'Vila Belmiro (SP)',
        homeScore: null,
        awayScore: null,
        status: 'scheduled'
      },
      {
        id: 'r2-m7',
        roundId: 2,
        homeTeam: 'Vitória',
        homeTeamCode: 'VIT',
        homeTeamLogo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100&auto=format&fit=crop&q=60',
        awayTeam: 'Vasco da Gama',
        awayTeamCode: 'VAS',
        awayTeamLogo: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=100&auto=format&fit=crop&q=60',
        date: '20/04 • 18:30',
        stadium: 'Barradão (BA)',
        homeScore: null,
        awayScore: null,
        status: 'scheduled'
      },
      {
        id: 'r2-m8',
        roundId: 2,
        homeTeam: 'Athletico-PR',
        homeTeamCode: 'CAP',
        homeTeamLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=60',
        awayTeam: 'Sport Recife',
        awayTeamCode: 'SPO',
        awayTeamLogo: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=100&auto=format&fit=crop&q=60',
        date: '20/04 • 19:00',
        stadium: 'Ligga Arena (PR)',
        homeScore: null,
        awayScore: null,
        status: 'scheduled'
      },
      {
        id: 'r2-m9',
        roundId: 2,
        homeTeam: 'Juventude',
        homeTeamCode: 'JUV',
        homeTeamLogo: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=100&auto=format&fit=crop&q=60',
        awayTeam: 'Fortaleza',
        awayTeamCode: 'FOR',
        awayTeamLogo: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=100&auto=format&fit=crop&q=60',
        date: '20/04 • 20:00',
        stadium: 'Alfredo Jaconi (RS)',
        homeScore: null,
        awayScore: null,
        status: 'scheduled'
      },
      {
        id: 'r2-m10',
        roundId: 2,
        homeTeam: 'Criciúma',
        homeTeamCode: 'CRI',
        homeTeamLogo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=100&auto=format&fit=crop&q=60',
        awayTeam: 'Red Bull Bragantino',
        awayTeamCode: 'RBB',
        awayTeamLogo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&auto=format&fit=crop&q=60',
        date: '20/04 • 20:00',
        stadium: 'Heriberto Hülse (SC)',
        homeScore: null,
        awayScore: null,
        status: 'scheduled'
      }
    ]
  }
];

export const INITIAL_BETS: UserBet[] = [
  // Finished bets for Round 1
  {
    id: 'bet-r1-user1',
    userId: 'user-1',
    userName: 'Carlos Eduardo Silva',
    userEmail: 'carlos@email.com',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    roundId: 1,
    status: 'confirmed',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    receiptUploadedAt: '2026-04-11T14:20:00Z',
    paymentConfirmedAt: '2026-04-11T15:00:00Z',
    calculatedPoints: 16,
    exactHitsCount: 4,
    outcomeHitsCount: 4,
    wrongHitsCount: 2,
    createdAt: '2026-04-11T14:15:00Z',
    isLocked: true,
    predictions: {
      'r1-m1': { home: 2, away: 1 }, // Exact (3 pts)
      'r1-m2': { home: 2, away: 0 }, // Exact (3 pts)
      'r1-m3': { home: 1, away: 1 }, // Exact (3 pts)
      'r1-m4': { home: 2, away: 1 }, // Winner GRE (1 pt)
      'r1-m5': { home: 0, away: 1 }, // Exact (3 pts)
      'r1-m6': { home: 1, away: 0 }, // Wrong BAH won in pred vs Draw (0 pt)
      'r1-m7': { home: 2, away: 1 }, // Winner VAS (1 pt)
      'r1-m8': { home: 1, away: 0 }, // Winner FOR (1 pt)
      'r1-m9': { home: 2, away: 0 }, // Winner RBB (1 pt)
      'r1-m10': { home: 2, away: 1 } // Wrong SPO vs Draw (0 pt)
    }
  },
  {
    id: 'bet-r1-user2',
    userId: 'user-2',
    userName: 'Gabriela Santos',
    userEmail: 'gabriela@email.com',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    roundId: 1,
    status: 'confirmed',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    receiptUploadedAt: '2026-04-11T18:00:00Z',
    paymentConfirmedAt: '2026-04-11T18:30:00Z',
    calculatedPoints: 14,
    exactHitsCount: 3,
    outcomeHitsCount: 5,
    wrongHitsCount: 2,
    createdAt: '2026-04-11T17:50:00Z',
    isLocked: true,
    predictions: {
      'r1-m1': { home: 2, away: 1 }, // Exact (3 pts)
      'r1-m2': { home: 3, away: 1 }, // Winner PAL (1 pt)
      'r1-m3': { home: 0, away: 0 }, // Outcome Draw (1 pt)
      'r1-m4': { home: 3, away: 2 }, // Exact (3 pts)
      'r1-m5': { home: 1, away: 2 }, // Winner BOT (1 pt)
      'r1-m6': { home: 2, away: 2 }, // Exact (3 pts)
      'r1-m7': { home: 2, away: 0 }, // Winner VAS (1 pt)
      'r1-m8': { home: 3, away: 1 }, // Winner FOR (1 pt)
      'r1-m9': { home: 1, away: 1 }, // Wrong (0 pt)
      'r1-m10': { home: 0, away: 1 } // Wrong (0 pt)
    }
  },
  // User 3 has a pending receipt in Round 2 for Admin to review!
  {
    id: 'bet-r2-user3',
    userId: 'user-3',
    userName: 'Marcos Vinícius',
    userEmail: 'marcos@email.com',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    roundId: 2,
    status: 'receipt_submitted',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    receiptUploadedAt: '2026-04-18T11:25:00Z',
    createdAt: '2026-04-18T11:20:00Z',
    isLocked: true,
    predictions: {
      'r2-m1': { home: 1, away: 1 },
      'r2-m2': { home: 2, away: 1 },
      'r2-m3': { home: 0, away: 0 },
      'r2-m4': { home: 2, away: 2 },
      'r2-m5': { home: 1, away: 0 },
      'r2-m6': { home: 0, away: 2 },
      'r2-m7': { home: 1, away: 1 },
      'r2-m8': { home: 2, away: 0 },
      'r2-m9': { home: 1, away: 2 },
      'r2-m10': { home: 0, away: 1 }
    }
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '🟢 2ª Rodada do Brasileirão Aberta!',
    message: 'A 2ª rodada já está disponível para palpites. Faça seus 10 palpites e pague a taxa de R$ 10,00 via PIX para garantir sua vaga.',
    type: 'round_open',
    createdAt: '2026-04-15T09:00:00Z',
    read: false,
    roundId: 2
  },
  {
    id: 'notif-2',
    title: '🏆 Resultados da 1ª Rodada Consolidados',
    message: 'A 1ª rodada foi finalizada! Carlos Eduardo lidera o Ranking com 16 pontos (4 placares exatos). Confira o ranking!',
    type: 'results_ready',
    createdAt: '2026-04-14T08:30:00Z',
    read: true,
    roundId: 1
  },
  {
    id: 'notif-3',
    title: '⚡ Regras do Bolão 2026',
    message: 'Lembre-se: Placar Exato = 3 Pontos, Acerto de Vencedor/Empate = 1 Ponto. É obrigatório palpitar em todos os 10 jogos.',
    type: 'system',
    createdAt: '2026-04-10T12:00:00Z',
    read: true
  }
];

export const PIX_CONFIG = {
  key: 'bolao.brasileirao.2026@pix.com.br',
  keyType: 'E-mail',
  receiverName: 'Bolão Brasileirão 2026 Oficial',
  city: 'São Paulo - SP',
  roundPrice: 10.00
};
