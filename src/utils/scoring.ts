import { Match } from '../types';

export interface CalculationResult {
  matchId: string;
  points: number;
  type: 'exact' | 'outcome' | 'wrong' | 'pending';
  predictedHome: number;
  predictedAway: number;
  actualHome: number | null;
  actualAway: number | null;
}

/**
 * Calculates score for a single prediction against actual match result.
 * - Placar exato: 3 pontos
 * - Acerto de vencedor ou empate: 1 ponto
 * - Erro: 0 pontos
 */
export function calculateMatchScore(
  predHome: number,
  predAway: number,
  actualHome: number | null,
  actualAway: number | null
): { points: number; type: 'exact' | 'outcome' | 'wrong' | 'pending' } {
  if (actualHome === null || actualAway === null) {
    return { points: 0, type: 'pending' };
  }

  // Exact Score -> 3 Points
  if (predHome === actualHome && predAway === actualAway) {
    return { points: 3, type: 'exact' };
  }

  // Determine actual outcome (-1 away win, 0 draw, 1 home win)
  const actualOutcome = Math.sign(actualHome - actualAway);
  const predOutcome = Math.sign(predHome - predAway);

  // Correct Winner or Correct Draw -> 1 Point
  if (predOutcome === actualOutcome) {
    return { points: 1, type: 'outcome' };
  }

  // Completely wrong -> 0 Points
  return { points: 0, type: 'wrong' };
}

/**
 * Evaluates all matches in a round for a user's bet.
 */
export function evaluateBet(
  predictions: Record<string, { home: number; away: number }>,
  matches: Match[]
): {
  totalPoints: number;
  exactHits: number;
  outcomeHits: number;
  wrongHits: number;
  details: CalculationResult[];
} {
  let totalPoints = 0;
  let exactHits = 0;
  let outcomeHits = 0;
  let wrongHits = 0;
  const details: CalculationResult[] = [];

  for (const match of matches) {
    const pred = predictions[match.id];
    if (!pred) continue;

    const calc = calculateMatchScore(pred.home, pred.away, match.homeScore, match.awayScore);

    if (calc.type === 'exact') {
      totalPoints += 3;
      exactHits += 1;
    } else if (calc.type === 'outcome') {
      totalPoints += 1;
      outcomeHits += 1;
    } else if (calc.type === 'wrong') {
      wrongHits += 1;
    }

    details.push({
      matchId: match.id,
      points: calc.points,
      type: calc.type,
      predictedHome: pred.home,
      predictedAway: pred.away,
      actualHome: match.homeScore,
      actualAway: match.awayScore
    });
  }

  return {
    totalPoints,
    exactHits,
    outcomeHits,
    wrongHits,
    details
  };
}

/**
 * Checks if betting is closed for a round based strictly on its deadline or admin status.
 */
export function isRoundBettingClosed(round: {
  status: string;
  deadline?: string;
  matches?: Array<{ status: string; date?: string }>;
}): { isClosed: boolean; reason: string } {
  if (round.status === 'finished') {
    return { isClosed: true, reason: 'Esta rodada já foi finalizada.' };
  }
  if (round.status === 'closed') {
    return { isClosed: true, reason: 'Rodada encerrada pelo Administrador.' };
  }

  // Check if current date/time has passed the configured round deadline
  if (round.deadline) {
    const deadlineTime = new Date(round.deadline).getTime();
    if (!isNaN(deadlineTime) && Date.now() > deadlineTime) {
      return { isClosed: true, reason: 'O horário limite para registrar palpites foi atingido.' };
    }
  }
  return { isClosed: false, reason: '' };
}

/**
 * Formats a round deadline ISO string into readable PT-BR date & time.
 */
export function formatDeadlineDisplay(deadlineStr?: string): string {
  if (!deadlineStr) return 'Não definido';
  try {
    const d = new Date(deadlineStr);
    if (isNaN(d.getTime())) return deadlineStr;
    return d.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return deadlineStr;
  }
}

export function formatDeadlineShort(deadlineStr?: string): string {
  if (!deadlineStr) return 'Não definido';
  try {
    const d = new Date(deadlineStr);
    if (isNaN(d.getTime())) return deadlineStr;
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    }) + ' às ' + d.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return deadlineStr;
  }
}


