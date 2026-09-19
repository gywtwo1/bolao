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
 * By official rule, the bolão closes at the kickoff time of the round's first match.
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

  // If any match in the round has already started (live) or finished, betting is locked
  if (round.matches && round.matches.some(m => m.status === 'live' || m.status === 'finished')) {
    return { isClosed: true, reason: 'O primeiro jogo da rodada já começou. Palpites encerrados.' };
  }

  // Check if current date/time has passed the configured round deadline (kickoff of the 1st match)
  if (round.deadline) {
    const deadlineTime = new Date(round.deadline).getTime();
    if (!isNaN(deadlineTime) && Date.now() > deadlineTime) {
      return { isClosed: true, reason: 'O horário limite do 1º jogo foi atingido. Palpites encerrados.' };
    }
  }
  return { isClosed: false, reason: '' };
}

/**
 * Parses match date strings like "19/09 • 16:00", "12/04/2026 • 18:30" or ISO dates into Date objects.
 */
export function parseMatchDateTime(dateStr?: string, seasonYear: string | number = 2026): Date | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();

  // Try ISO or YYYY-MM-DD format first
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) return d;
  }

  // Format: "DD/MM • HH:mm" or "DD/MM/YYYY • HH:mm" or "DD/MM HH:mm" or "DD/MM - HH:mm"
  const matchRegex = /(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?.*?(\d{1,2}):(\d{2})/;
  const match = trimmed.match(matchRegex);
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // 0-indexed in JS
    let year = match[3] ? parseInt(match[3], 10) : Number(seasonYear) || 2026;
    if (year < 100) year += 2000;
    const hours = parseInt(match[4], 10);
    const minutes = parseInt(match[5], 10);

    const date = new Date(year, month, day, hours, minutes, 0, 0);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  const fallback = new Date(trimmed);
  if (!isNaN(fallback.getTime())) {
    return fallback;
  }

  return null;
}

/**
 * Calculates the closing deadline for a round based on the date/time of its 1st match.
 */
export function getFirstMatchDeadline(
  matches?: Array<{ date?: string }>,
  season?: string | number,
  fallbackDeadline?: string
): string {
  if (!matches || matches.length === 0) {
    return fallbackDeadline || new Date().toISOString();
  }

  // 1. Check designated 1st match (matches[0])
  const firstMatchDate = parseMatchDateTime(matches[0]?.date, season);

  // 2. Also check all matches to find the chronologically earliest kickoff
  let earliestDate = firstMatchDate;
  for (const m of matches) {
    const d = parseMatchDateTime(m.date, season);
    if (d && (!earliestDate || d.getTime() < earliestDate.getTime())) {
      earliestDate = d;
    }
  }

  if (earliestDate) {
    return earliestDate.toISOString();
  }

  return fallbackDeadline || new Date().toISOString();
}

/**
 * Formats a Date or date string to YYYY-MM-DDTHH:mm for datetime-local input fields.
 */
export function formatToDateTimeLocal(dateInput: Date | string): string {
  const d = typeof dateInput === 'string' ? (parseMatchDateTime(dateInput) || new Date(dateInput)) : dateInput;
  if (!d || isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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


