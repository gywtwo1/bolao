import { Match } from '../types';

export interface SportsApiResult {
  matchId: string;
  homeScore: number;
  awayScore: number;
  status: 'finished' | 'live';
  minute?: string;
  events: string[];
}

/**
 * Simulates fetching live or final sports statistics from external Football API
 * (e.g. API-Futebol, SofaScore, Football-Data).
 * Generates realistic Brazilian Série A scores and goal events.
 */
export async function fetchLiveSportsScores(matches: Match[]): Promise<SportsApiResult[]> {
  // Simulate network delay for API response
  await new Promise(resolve => setTimeout(resolve, 800));

  const realisticScores = [
    { h: 2, a: 1, events: ['⚽ 14\' Gol do Flamengo', '⚽ 45\' Gol do São Paulo', '⚽ 78\' Gol do Flamengo (Pênalti)'] },
    { h: 1, a: 0, events: ['⚽ 33\' Gol do Mandante', '🟨 60\' Cartão amarelo'] },
    { h: 2, a: 2, events: ['⚽ 10\' Gol Visitante', '⚽ 25\' Gol Mandante', '⚽ 55\' Gol Mandante', '⚽ 88\' Gol Visitante (Falta)'] },
    { h: 0, a: 0, events: ['🧤 40\' Grande defesa do goleiro', '🟨 72\' Cartão amarelo'] },
    { h: 3, a: 1, events: ['⚽ 05\' Gol Mandante', '⚽ 22\' Gol Mandante', '⚽ 67\' Gol Visitante', '⚽ 84\' Gol Mandante'] },
    { h: 0, a: 1, events: ['⚽ 62\' Gol do Visitante (Cabeceio)'] },
    { h: 1, a: 1, events: ['⚽ 19\' Gol Visitante', '⚽ 49\' Gol Mandante'] },
    { h: 2, a: 0, events: ['⚽ 30\' Gol Mandante', '⚽ 75\' Gol Mandante'] },
    { h: 3, a: 2, events: ['⚽ 12\' Gol Mandante', '⚽ 31\' Gol Visitante', '⚽ 44\' Gol Mandante', '⚽ 59\' Gol Visitante', '⚽ 90+2\' Gol da Vitória'] },
    { h: 1, a: 2, events: ['⚽ 18\' Gol Mandante', '⚽ 50\' Gol Visitante', '⚽ 70\' Gol da Virada'] }
  ];

  return matches.map((match, idx) => {
    // If the match already has a score, we can preserve or finalize it
    const template = realisticScores[idx % realisticScores.length];
    const finalHome = match.homeScore !== null ? match.homeScore : template.h;
    const finalAway = match.awayScore !== null ? match.awayScore : template.a;

    return {
      matchId: match.id,
      homeScore: finalHome,
      awayScore: finalAway,
      status: 'finished',
      events: template.events
    };
  });
}
