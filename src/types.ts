export interface Team {
  id: string;
  name: string;
  shortName: string;
  code: string;
  logo: string;
  primaryColor: string;
  stadium: string;
  city: string;
}

export interface Match {
  id: string;
  roundId: number;
  homeTeam: string;
  homeTeamCode: string;
  homeTeamLogo: string;
  awayTeam: string;
  awayTeamCode: string;
  awayTeamLogo: string;
  date: string;
  stadium: string;
  homeScore: number | null;
  awayScore: number | null;
  status: 'scheduled' | 'live' | 'finished';
  minute?: string;
  liveEvents?: string[];
}

export interface Round {
  id: number;
  number: number;
  title: string;
  season: string;
  price: number;
  status: 'open' | 'closed' | 'finished';
  deadline: string;
  matches: Match[];
  totalPot: number;
  isArchived?: boolean;
}

export type BetStatus = 'draft' | 'locked_pending_payment' | 'receipt_submitted' | 'confirmed' | 'rejected';

export interface UserPrediction {
  home: number | null;
  away: number | null;
}

export interface UserBet {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  roundId: number;
  betNumber?: number;
  betLabel?: string;
  predictions: Record<string, { home: number; away: number }>;
  status: BetStatus;
  receiptUrl?: string;
  receiptUploadedAt?: string;
  paymentConfirmedAt?: string;
  adminNotes?: string;
  calculatedPoints?: number;
  exactHitsCount?: number;
  outcomeHitsCount?: number;
  wrongHitsCount?: number;
  createdAt: string;
  isLocked: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar: string;
  favoriteTeam: string;
  pixKey?: string;
  phone?: string;
  createdAt: string;
  totalPoints: number;
  totalExactHits: number;
  totalOutcomeHits: number;
  roundsParticipated: number;
  isOnline?: boolean;
  lastActive?: string;
  city?: string;
  state?: string;
}

export interface AppNotification {
  id: string;
  userId?: string; // empty means broadcast to all
  title: string;
  message: string;
  type: 'round_open' | 'payment_confirmed' | 'payment_rejected' | 'results_ready' | 'system' | 'stats_update';
  createdAt: string;
  read: boolean;
  roundId?: number;
}

export interface RankingEntry {
  userId: string;
  name: string;
  avatar: string;
  favoriteTeam: string;
  totalPoints: number;
  exactHits: number;
  outcomeHits: number;
  roundsCount: number;
  position: number;
  lastRoundPoints?: number;
  bestBetLabel?: string;
  isRoundWinner?: boolean;
}
