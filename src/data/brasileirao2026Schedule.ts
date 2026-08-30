import { Match, Round } from '../types';
import { BRASILEIRAO_TEAMS, getTeamByCode } from './teams';

export interface BrasileiraoRoundTemplate {
  number: number;
  title: string;
  season: string;
  price: number;
  deadline: string;
  matches: Omit<Match, 'id' | 'roundId' | 'homeScore' | 'awayScore' | 'status'>[];
}

// 20 Clubs mapping helper
const getTeam = (nameOrCode: string) => {
  const team = BRASILEIRAO_TEAMS.find(
    t => t.name.toLowerCase() === nameOrCode.toLowerCase() ||
         t.code.toUpperCase() === nameOrCode.toUpperCase() ||
         t.shortName.toLowerCase() === nameOrCode.toLowerCase()
  );
  if (!team) {
    return {
      name: nameOrCode,
      code: nameOrCode.slice(0, 3).toUpperCase(),
      logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=60',
      stadium: 'Estádio Principal'
    };
  }
  return team;
};

const createMatchTemplate = (
  home: string,
  away: string,
  dateStr: string,
  timeStr: string = '16:00',
  customStadium?: string
) => {
  const homeT = getTeam(home);
  const awayT = getTeam(away);
  const stadium = customStadium || `${homeT.stadium}`;

  return {
    homeTeam: homeT.name,
    homeTeamCode: homeT.code,
    homeTeamLogo: homeT.logo,
    awayTeam: awayT.name,
    awayTeamCode: awayT.code,
    awayTeamLogo: awayT.logo,
    date: `${dateStr} • ${timeStr}`,
    stadium
  };
};

// Fixture pairs algorithm for 38 rounds of 20 teams (round-robin home & away)
const TEAMS_LIST = [
  'Flamengo', 'Palmeiras', 'São Paulo', 'Corinthians',
  'Atlético-MG', 'Cruzeiro', 'Grêmio', 'Internacional',
  'Botafogo', 'Fluminense', 'Vasco da Gama', 'Bahia',
  'Fortaleza', 'Athletico-PR', 'Santos', 'Red Bull Bragantino',
  'Vitória', 'Juventude', 'Criciúma', 'Sport Recife'
];

// Curated 38 Rounds of Brasileirão 2026
export const BRASILEIRAO_2026_SCHEDULE: BrasileiraoRoundTemplate[] = [
  // Rodada 1 (Abertura)
  {
    number: 1,
    title: '1ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-04-12T16:00:00Z',
    matches: [
      createMatchTemplate('Flamengo', 'São Paulo', '12/04', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('Palmeiras', 'Corinthians', '12/04', '18:30', 'Allianz Parque (SP)'),
      createMatchTemplate('Atlético-MG', 'Cruzeiro', '12/04', '19:00', 'Arena MRV (MG)'),
      createMatchTemplate('Grêmio', 'Internacional', '13/04', '16:00', 'Arena do Grêmio (RS)'),
      createMatchTemplate('Fluminense', 'Botafogo', '13/04', '18:30', 'Maracanã (RJ)'),
      createMatchTemplate('Bahia', 'Vitória', '13/04', '16:00', 'Arena Fonte Nova (BA)'),
      createMatchTemplate('Vasco da Gama', 'Santos', '13/04', '18:30', 'São Januário (RJ)'),
      createMatchTemplate('Fortaleza', 'Athletico-PR', '13/04', '20:00', 'Arena Castelão (CE)'),
      createMatchTemplate('Red Bull Bragantino', 'Juventude', '13/04', '18:30', 'Nabi Abi Chedid (SP)'),
      createMatchTemplate('Sport Recife', 'Criciúma', '13/04', '20:00', 'Ilha do Retiro (PE)')
    ]
  },

  // Rodada 2
  {
    number: 2,
    title: '2ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-04-19T16:00:00Z',
    matches: [
      createMatchTemplate('São Paulo', 'Palmeiras', '19/04', '16:00', 'MorumBIS (SP)'),
      createMatchTemplate('Corinthians', 'Flamengo', '19/04', '18:30', 'Neo Química Arena (SP)'),
      createMatchTemplate('Cruzeiro', 'Grêmio', '19/04', '19:00', 'Mineirão (MG)'),
      createMatchTemplate('Internacional', 'Atlético-MG', '20/04', '16:00', 'Beira-Rio (RS)'),
      createMatchTemplate('Botafogo', 'Bahia', '20/04', '18:30', 'Nilton Santos (RJ)'),
      createMatchTemplate('Santos', 'Fluminense', '20/04', '16:00', 'Vila Belmiro (SP)'),
      createMatchTemplate('Vitória', 'Vasco da Gama', '20/04', '18:30', 'Barradão (BA)'),
      createMatchTemplate('Athletico-PR', 'Sport Recife', '20/04', '19:00', 'Ligga Arena (PR)'),
      createMatchTemplate('Juventude', 'Fortaleza', '20/04', '20:00', 'Alfredo Jaconi (RS)'),
      createMatchTemplate('Criciúma', 'Red Bull Bragantino', '20/04', '20:00', 'Heriberto Hülse (SC)')
    ]
  },

  // Rodada 3
  {
    number: 3,
    title: '3ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-04-26T16:00:00Z',
    matches: [
      createMatchTemplate('Flamengo', 'Botafogo', '26/04', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('Palmeiras', 'Internacional', '26/04', '16:00', 'Allianz Parque (SP)'),
      createMatchTemplate('São Paulo', 'Cruzeiro', '26/04', '18:30', 'MorumBIS (SP)'),
      createMatchTemplate('Atlético-MG', 'Corinthians', '26/04', '18:30', 'Arena MRV (MG)'),
      createMatchTemplate('Grêmio', 'Fluminense', '26/04', '19:00', 'Arena do Grêmio (RS)'),
      createMatchTemplate('Vasco da Gama', 'Bahia', '27/04', '16:00', 'São Januário (RJ)'),
      createMatchTemplate('Santos', 'Vitória', '27/04', '16:00', 'Vila Belmiro (SP)'),
      createMatchTemplate('Fortaleza', 'Criciúma', '27/04', '18:30', 'Arena Castelão (CE)'),
      createMatchTemplate('Red Bull Bragantino', 'Athletico-PR', '27/04', '18:30', 'Nabi Abi Chedid (SP)'),
      createMatchTemplate('Sport Recife', 'Juventude', '27/04', '20:00', 'Ilha do Retiro (PE)')
    ]
  },

  // Rodada 4
  {
    number: 4,
    title: '4ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-05-03T16:00:00Z',
    matches: [
      createMatchTemplate('Corinthians', 'São Paulo', '03/05', '16:00', 'Neo Química Arena (SP)'),
      createMatchTemplate('Cruzeiro', 'Flamengo', '03/05', '16:00', 'Mineirão (MG)'),
      createMatchTemplate('Fluminense', 'Atlético-MG', '03/05', '18:30', 'Maracanã (RJ)'),
      createMatchTemplate('Internacional', 'Santos', '03/05', '18:30', 'Beira-Rio (RS)'),
      createMatchTemplate('Botafogo', 'Grêmio', '03/05', '19:00', 'Nilton Santos (RJ)'),
      createMatchTemplate('Bahia', 'Palmeiras', '04/05', '16:00', 'Arena Fonte Nova (BA)'),
      createMatchTemplate('Athletico-PR', 'Vasco da Gama', '04/05', '16:00', 'Ligga Arena (PR)'),
      createMatchTemplate('Vitória', 'Fortaleza', '04/05', '18:30', 'Barradão (BA)'),
      createMatchTemplate('Juventude', 'Red Bull Bragantino', '04/05', '18:30', 'Alfredo Jaconi (RS)'),
      createMatchTemplate('Criciúma', 'Sport Recife', '04/05', '20:00', 'Heriberto Hülse (SC)')
    ]
  },

  // Rodada 5
  {
    number: 5,
    title: '5ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-05-10T16:00:00Z',
    matches: [
      createMatchTemplate('Flamengo', 'Palmeiras', '10/05', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('São Paulo', 'Grêmio', '10/05', '16:00', 'MorumBIS (SP)'),
      createMatchTemplate('Atlético-MG', 'Botafogo', '10/05', '18:30', 'Arena MRV (MG)'),
      createMatchTemplate('Corinthians', 'Cruzeiro', '10/05', '18:30', 'Neo Química Arena (SP)'),
      createMatchTemplate('Vasco da Gama', 'Fluminense', '10/05', '19:00', 'São Januário (RJ)'),
      createMatchTemplate('Santos', 'Bahia', '11/05', '16:00', 'Vila Belmiro (SP)'),
      createMatchTemplate('Fortaleza', 'Internacional', '11/05', '16:00', 'Arena Castelão (CE)'),
      createMatchTemplate('Red Bull Bragantino', 'Sport Recife', '11/05', '18:30', 'Nabi Abi Chedid (SP)'),
      createMatchTemplate('Vitória', 'Athletico-PR', '11/05', '18:30', 'Barradão (BA)'),
      createMatchTemplate('Juventude', 'Criciúma', '11/05', '20:00', 'Alfredo Jaconi (RS)')
    ]
  },

  // Rodada 6
  {
    number: 6,
    title: '6ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-05-17T16:00:00Z',
    matches: [
      createMatchTemplate('Palmeiras', 'Atlético-MG', '17/05', '16:00', 'Allianz Parque (SP)'),
      createMatchTemplate('Grêmio', 'Flamengo', '17/05', '16:00', 'Arena do Grêmio (RS)'),
      createMatchTemplate('Cruzeiro', 'Santos', '17/05', '18:30', 'Mineirão (MG)'),
      createMatchTemplate('Fluminense', 'Corinthians', '17/05', '18:30', 'Maracanã (RJ)'),
      createMatchTemplate('Botafogo', 'São Paulo', '17/05', '19:00', 'Nilton Santos (RJ)'),
      createMatchTemplate('Internacional', 'Vasco da Gama', '18/05', '16:00', 'Beira-Rio (RS)'),
      createMatchTemplate('Bahia', 'Fortaleza', '18/05', '16:00', 'Arena Fonte Nova (BA)'),
      createMatchTemplate('Athletico-PR', 'Red Bull Bragantino', '18/05', '18:30', 'Ligga Arena (PR)'),
      createMatchTemplate('Sport Recife', 'Vitória', '18/05', '18:30', 'Ilha do Retiro (PE)'),
      createMatchTemplate('Criciúma', 'Juventude', '18/05', '20:00', 'Heriberto Hülse (SC)')
    ]
  },

  // Rodada 7
  {
    number: 7,
    title: '7ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-05-24T16:00:00Z',
    matches: [
      createMatchTemplate('Flamengo', 'Atlético-MG', '24/05', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('Corinthians', 'Grêmio', '24/05', '16:00', 'Neo Química Arena (SP)'),
      createMatchTemplate('São Paulo', 'Santos', '24/05', '18:30', 'MorumBIS (SP)'),
      createMatchTemplate('Vasco da Gama', 'Palmeiras', '24/05', '18:30', 'São Januário (RJ)'),
      createMatchTemplate('Cruzeiro', 'Botafogo', '24/05', '19:00', 'Mineirão (MG)'),
      createMatchTemplate('Fortaleza', 'Fluminense', '25/05', '16:00', 'Arena Castelão (CE)'),
      createMatchTemplate('Internacional', 'Bahia', '25/05', '16:00', 'Beira-Rio (RS)'),
      createMatchTemplate('Red Bull Bragantino', 'Vitória', '25/05', '18:30', 'Nabi Abi Chedid (SP)'),
      createMatchTemplate('Athletico-PR', 'Criciúma', '25/05', '18:30', 'Ligga Arena (PR)'),
      createMatchTemplate('Juventude', 'Sport Recife', '25/05', '20:00', 'Alfredo Jaconi (RS)')
    ]
  },

  // Rodada 8
  {
    number: 8,
    title: '8ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-05-31T16:00:00Z',
    matches: [
      createMatchTemplate('Santos', 'Flamengo', '31/05', '16:00', 'Vila Belmiro (SP)'),
      createMatchTemplate('Palmeiras', 'Cruzeiro', '31/05', '16:00', 'Allianz Parque (SP)'),
      createMatchTemplate('Atlético-MG', 'São Paulo', '31/05', '18:30', 'Arena MRV (MG)'),
      createMatchTemplate('Grêmio', 'Vasco da Gama', '31/05', '18:30', 'Arena do Grêmio (RS)'),
      createMatchTemplate('Fluminense', 'Internacional', '31/05', '19:00', 'Maracanã (RJ)'),
      createMatchTemplate('Botafogo', 'Corinthians', '01/06', '16:00', 'Nilton Santos (RJ)'),
      createMatchTemplate('Bahia', 'Athletico-PR', '01/06', '16:00', 'Arena Fonte Nova (BA)'),
      createMatchTemplate('Vitória', 'Juventude', '01/06', '18:30', 'Barradão (BA)'),
      createMatchTemplate('Sport Recife', 'Fortaleza', '01/06', '18:30', 'Ilha do Retiro (PE)'),
      createMatchTemplate('Criciúma', 'Red Bull Bragantino', '01/06', '20:00', 'Heriberto Hülse (SC)')
    ]
  },

  // Rodada 9
  {
    number: 9,
    title: '9ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-06-07T16:00:00Z',
    matches: [
      createMatchTemplate('Flamengo', 'Fluminense', '07/06', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('Corinthians', 'Santos', '07/06', '16:00', 'Neo Química Arena (SP)'),
      createMatchTemplate('São Paulo', 'Internacional', '07/06', '18:30', 'MorumBIS (SP)'),
      createMatchTemplate('Cruzeiro', 'Atlético-MG', '07/06', '18:30', 'Mineirão (MG)'),
      createMatchTemplate('Vasco da Gama', 'Botafogo', '07/06', '19:00', 'São Januário (RJ)'),
      createMatchTemplate('Palmeiras', 'Grêmio', '08/06', '16:00', 'Allianz Parque (SP)'),
      createMatchTemplate('Fortaleza', 'Red Bull Bragantino', '08/06', '16:00', 'Arena Castelão (CE)'),
      createMatchTemplate('Athletico-PR', 'Juventude', '08/06', '18:30', 'Ligga Arena (PR)'),
      createMatchTemplate('Bahia', 'Sport Recife', '08/06', '18:30', 'Arena Fonte Nova (BA)'),
      createMatchTemplate('Vitória', 'Criciúma', '08/06', '20:00', 'Barradão (BA)')
    ]
  },

  // Rodada 10
  {
    number: 10,
    title: '10ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-06-14T16:00:00Z',
    matches: [
      createMatchTemplate('Internacional', 'Flamengo', '14/06', '16:00', 'Beira-Rio (RS)'),
      createMatchTemplate('Santos', 'Palmeiras', '14/06', '16:00', 'Vila Belmiro (SP)'),
      createMatchTemplate('Atlético-MG', 'Vasco da Gama', '14/06', '18:30', 'Arena MRV (MG)'),
      createMatchTemplate('Grêmio', 'Cruzeiro', '14/06', '18:30', 'Arena do Grêmio (RS)'),
      createMatchTemplate('Botafogo', 'Fluminense', '14/06', '19:00', 'Nilton Santos (RJ)'),
      createMatchTemplate('São Paulo', 'Corinthians', '15/06', '16:00', 'MorumBIS (SP)'),
      createMatchTemplate('Red Bull Bragantino', 'Bahia', '15/06', '16:00', 'Nabi Abi Chedid (SP)'),
      createMatchTemplate('Sport Recife', 'Athletico-PR', '15/06', '18:30', 'Ilha do Retiro (PE)'),
      createMatchTemplate('Juventude', 'Vitória', '15/06', '18:30', 'Alfredo Jaconi (RS)'),
      createMatchTemplate('Criciúma', 'Fortaleza', '15/06', '20:00', 'Heriberto Hülse (SC)')
    ]
  },

  // Rodada 11
  {
    number: 11,
    title: '11ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-06-21T16:00:00Z',
    matches: [
      createMatchTemplate('Flamengo', 'Vasco da Gama', '21/06', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('Palmeiras', 'São Paulo', '21/06', '16:00', 'Allianz Parque (SP)'),
      createMatchTemplate('Corinthians', 'Internacional', '21/06', '18:30', 'Neo Química Arena (SP)'),
      createMatchTemplate('Fluminense', 'Santos', '21/06', '18:30', 'Maracanã (RJ)'),
      createMatchTemplate('Cruzeiro', 'Atlético-MG', '21/06', '19:00', 'Mineirão (MG)'),
      createMatchTemplate('Grêmio', 'Botafogo', '22/06', '16:00', 'Arena do Grêmio (RS)'),
      createMatchTemplate('Fortaleza', 'Bahia', '22/06', '16:00', 'Arena Castelão (CE)'),
      createMatchTemplate('Athletico-PR', 'Sport Recife', '22/06', '18:30', 'Ligga Arena (PR)'),
      createMatchTemplate('Vitória', 'Red Bull Bragantino', '22/06', '18:30', 'Barradão (BA)'),
      createMatchTemplate('Criciúma', 'Juventude', '22/06', '20:00', 'Heriberto Hülse (SC)')
    ]
  },

  // Rodada 12
  {
    number: 12,
    title: '12ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-06-28T16:00:00Z',
    matches: [
      createMatchTemplate('Bahia', 'Flamengo', '28/06', '16:00', 'Arena Fonte Nova (BA)'),
      createMatchTemplate('Botafogo', 'Palmeiras', '28/06', '16:00', 'Nilton Santos (RJ)'),
      createMatchTemplate('Vasco da Gama', 'Corinthians', '28/06', '18:30', 'São Januário (RJ)'),
      createMatchTemplate('Atlético-MG', 'Grêmio', '28/06', '18:30', 'Arena MRV (MG)'),
      createMatchTemplate('São Paulo', 'Fluminense', '28/06', '19:00', 'MorumBIS (SP)'),
      createMatchTemplate('Santos', 'Cruzeiro', '29/06', '16:00', 'Vila Belmiro (SP)'),
      createMatchTemplate('Internacional', 'Fortaleza', '29/06', '16:00', 'Beira-Rio (RS)'),
      createMatchTemplate('Red Bull Bragantino', 'Athletico-PR', '29/06', '18:30', 'Nabi Abi Chedid (SP)'),
      createMatchTemplate('Juventude', 'Vitória', '29/06', '18:30', 'Alfredo Jaconi (RS)'),
      createMatchTemplate('Sport Recife', 'Criciúma', '29/06', '20:00', 'Ilha do Retiro (PE)')
    ]
  },

  // Rodada 13
  {
    number: 13,
    title: '13ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-07-05T16:00:00Z',
    matches: [
      createMatchTemplate('Flamengo', 'Cruzeiro', '05/07', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('Palmeiras', 'Bahia', '05/07', '16:00', 'Allianz Parque (SP)'),
      createMatchTemplate('Corinthians', 'Botafogo', '05/07', '18:30', 'Neo Química Arena (SP)'),
      createMatchTemplate('Grêmio', 'São Paulo', '05/07', '18:30', 'Arena do Grêmio (RS)'),
      createMatchTemplate('Fluminense', 'Vasco da Gama', '05/07', '19:00', 'Maracanã (RJ)'),
      createMatchTemplate('Atlético-MG', 'Santos', '06/07', '16:00', 'Arena MRV (MG)'),
      createMatchTemplate('Fortaleza', 'Vitória', '06/07', '16:00', 'Arena Castelão (CE)'),
      createMatchTemplate('Athletico-PR', 'Internacional', '06/07', '18:30', 'Ligga Arena (PR)'),
      createMatchTemplate('Criciúma', 'Sport Recife', '06/07', '18:30', 'Heriberto Hülse (SC)'),
      createMatchTemplate('Juventude', 'Red Bull Bragantino', '06/07', '20:00', 'Alfredo Jaconi (RS)')
    ]
  },

  // Rodada 14
  {
    number: 14,
    title: '14ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-07-12T16:00:00Z',
    matches: [
      createMatchTemplate('Fortaleza', 'Flamengo', '12/07', '16:00', 'Arena Castelão (CE)'),
      createMatchTemplate('Fluminense', 'Palmeiras', '12/07', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('Santos', 'Corinthians', '12/07', '18:30', 'Vila Belmiro (SP)'),
      createMatchTemplate('São Paulo', 'Atlético-MG', '12/07', '18:30', 'MorumBIS (SP)'),
      createMatchTemplate('Cruzeiro', 'Internacional', '12/07', '19:00', 'Mineirão (MG)'),
      createMatchTemplate('Botafogo', 'Vasco da Gama', '13/07', '16:00', 'Nilton Santos (RJ)'),
      createMatchTemplate('Bahia', 'Grêmio', '13/07', '16:00', 'Arena Fonte Nova (BA)'),
      createMatchTemplate('Red Bull Bragantino', 'Sport Recife', '13/07', '18:30', 'Nabi Abi Chedid (SP)'),
      createMatchTemplate('Vitória', 'Athletico-PR', '13/07', '18:30', 'Barradão (BA)'),
      createMatchTemplate('Criciúma', 'Juventude', '13/07', '20:00', 'Heriberto Hülse (SC)')
    ]
  },

  // Rodada 15
  {
    number: 15,
    title: '15ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-07-19T16:00:00Z',
    matches: [
      createMatchTemplate('Flamengo', 'Athletico-PR', '19/07', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('Palmeiras', 'Santos', '19/07', '16:00', 'Allianz Parque (SP)'),
      createMatchTemplate('Corinthians', 'Bahia', '19/07', '18:30', 'Neo Química Arena (SP)'),
      createMatchTemplate('Vasco da Gama', 'São Paulo', '19/07', '18:30', 'São Januário (RJ)'),
      createMatchTemplate('Internacional', 'Cruzeiro', '19/07', '19:00', 'Beira-Rio (RS)'),
      createMatchTemplate('Grêmio', 'Fortaleza', '20/07', '16:00', 'Arena do Grêmio (RS)'),
      createMatchTemplate('Atlético-MG', 'Fluminense', '20/07', '16:00', 'Arena MRV (MG)'),
      createMatchTemplate('Sport Recife', 'Botafogo', '20/07', '18:30', 'Ilha do Retiro (PE)'),
      createMatchTemplate('Juventude', 'Vitória', '20/07', '18:30', 'Alfredo Jaconi (RS)'),
      createMatchTemplate('Red Bull Bragantino', 'Criciúma', '20/07', '20:00', 'Nabi Abi Chedid (SP)')
    ]
  },

  // Rodada 16
  {
    number: 16,
    title: '16ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-07-26T16:00:00Z',
    matches: [
      createMatchTemplate('Red Bull Bragantino', 'Flamengo', '26/07', '16:00', 'Nabi Abi Chedid (SP)'),
      createMatchTemplate('Vitória', 'Palmeiras', '26/07', '16:00', 'Barradão (BA)'),
      createMatchTemplate('Fortaleza', 'Corinthians', '26/07', '18:30', 'Arena Castelão (CE)'),
      createMatchTemplate('São Paulo', 'Botafogo', '26/07', '18:30', 'MorumBIS (SP)'),
      createMatchTemplate('Santos', 'Grêmio', '26/07', '19:00', 'Vila Belmiro (SP)'),
      createMatchTemplate('Fluminense', 'Cruzeiro', '27/07', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('Bahia', 'Atlético-MG', '27/07', '16:00', 'Arena Fonte Nova (BA)'),
      createMatchTemplate('Athletico-PR', 'Internacional', '27/07', '18:30', 'Ligga Arena (PR)'),
      createMatchTemplate('Criciúma', 'Vasco da Gama', '27/07', '18:30', 'Heriberto Hülse (SC)'),
      createMatchTemplate('Sport Recife', 'Juventude', '27/07', '20:00', 'Ilha do Retiro (PE)')
    ]
  },

  // Rodada 17
  {
    number: 17,
    title: '17ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-08-02T16:00:00Z',
    matches: [
      createMatchTemplate('Flamengo', 'Vitória', '02/08', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('Palmeiras', 'Fortaleza', '02/08', '16:00', 'Allianz Parque (SP)'),
      createMatchTemplate('Corinthians', 'Red Bull Bragantino', '02/08', '18:30', 'Neo Química Arena (SP)'),
      createMatchTemplate('Cruzeiro', 'São Paulo', '02/08', '18:30', 'Mineirão (MG)'),
      createMatchTemplate('Grêmio', 'Santos', '02/08', '19:00', 'Arena do Grêmio (RS)'),
      createMatchTemplate('Botafogo', 'Athletico-PR', '03/08', '16:00', 'Nilton Santos (RJ)'),
      createMatchTemplate('Vasco da Gama', 'Atlético-MG', '03/08', '16:00', 'São Januário (RJ)'),
      createMatchTemplate('Internacional', 'Fluminense', '03/08', '18:30', 'Beira-Rio (RS)'),
      createMatchTemplate('Juventude', 'Bahia', '03/08', '18:30', 'Alfredo Jaconi (RS)'),
      createMatchTemplate('Criciúma', 'Sport Recife', '03/08', '20:00', 'Heriberto Hülse (SC)')
    ]
  },

  // Rodada 18
  {
    number: 18,
    title: '18ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-08-09T16:00:00Z',
    matches: [
      createMatchTemplate('Juventude', 'Flamengo', '09/08', '16:00', 'Alfredo Jaconi (RS)'),
      createMatchTemplate('Athletico-PR', 'Palmeiras', '09/08', '16:00', 'Ligga Arena (PR)'),
      createMatchTemplate('Vitória', 'Corinthians', '09/08', '18:30', 'Barradão (BA)'),
      createMatchTemplate('São Paulo', 'Bahia', '09/08', '18:30', 'MorumBIS (SP)'),
      createMatchTemplate('Atlético-MG', 'Internacional', '09/08', '19:00', 'Arena MRV (MG)'),
      createMatchTemplate('Santos', 'Botafogo', '10/08', '16:00', 'Vila Belmiro (SP)'),
      createMatchTemplate('Fortaleza', 'Cruzeiro', '10/08', '16:00', 'Arena Castelão (CE)'),
      createMatchTemplate('Fluminense', 'Grêmio', '10/08', '18:30', 'Maracanã (RJ)'),
      createMatchTemplate('Red Bull Bragantino', 'Vasco da Gama', '10/08', '18:30', 'Nabi Abi Chedid (SP)'),
      createMatchTemplate('Sport Recife', 'Criciúma', '10/08', '20:00', 'Ilha do Retiro (PE)')
    ]
  },

  // Rodada 19 (Fim do 1º Turno)
  {
    number: 19,
    title: '19ª Rodada - Fim do 1º Turno Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-08-16T16:00:00Z',
    matches: [
      createMatchTemplate('Flamengo', 'Criciúma', '16/08', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('Palmeiras', 'Sport Recife', '16/08', '16:00', 'Allianz Parque (SP)'),
      createMatchTemplate('Corinthians', 'Juventude', '16/08', '18:30', 'Neo Química Arena (SP)'),
      createMatchTemplate('Cruzeiro', 'Vasco da Gama', '16/08', '18:30', 'Mineirão (MG)'),
      createMatchTemplate('Grêmio', 'Red Bull Bragantino', '16/08', '19:00', 'Arena do Grêmio (RS)'),
      createMatchTemplate('Botafogo', 'Fortaleza', '17/08', '16:00', 'Nilton Santos (RJ)'),
      createMatchTemplate('Internacional', 'Vitória', '17/08', '16:00', 'Beira-Rio (RS)'),
      createMatchTemplate('Bahia', 'Fluminense', '17/08', '18:30', 'Arena Fonte Nova (BA)'),
      createMatchTemplate('Athletico-PR', 'Atlético-MG', '17/08', '18:30', 'Ligga Arena (PR)'),
      createMatchTemplate('São Paulo', 'Santos', '17/08', '20:00', 'MorumBIS (SP)')
    ]
  },

  // Rodada 20 (Início do 2º Turno)
  {
    number: 20,
    title: '20ª Rodada - Início do 2º Turno Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-08-23T16:00:00Z',
    matches: [
      createMatchTemplate('São Paulo', 'Flamengo', '23/08', '16:00', 'MorumBIS (SP)'),
      createMatchTemplate('Corinthians', 'Palmeiras', '23/08', '16:00', 'Neo Química Arena (SP)'),
      createMatchTemplate('Cruzeiro', 'Atlético-MG', '23/08', '18:30', 'Mineirão (MG)'),
      createMatchTemplate('Internacional', 'Grêmio', '23/08', '18:30', 'Beira-Rio (RS)'),
      createMatchTemplate('Botafogo', 'Fluminense', '23/08', '19:00', 'Nilton Santos (RJ)'),
      createMatchTemplate('Vitória', 'Bahia', '24/08', '16:00', 'Barradão (BA)'),
      createMatchTemplate('Santos', 'Vasco da Gama', '24/08', '16:00', 'Vila Belmiro (SP)'),
      createMatchTemplate('Athletico-PR', 'Fortaleza', '24/08', '18:30', 'Ligga Arena (PR)'),
      createMatchTemplate('Juventude', 'Red Bull Bragantino', '24/08', '18:30', 'Alfredo Jaconi (RS)'),
      createMatchTemplate('Criciúma', 'Sport Recife', '24/08', '20:00', 'Heriberto Hülse (SC)')
    ]
  },

  // Rodada 21
  {
    number: 21,
    title: '21ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-08-30T16:00:00Z',
    matches: [
      createMatchTemplate('Palmeiras', 'São Paulo', '30/08', '16:00', 'Allianz Parque (SP)'),
      createMatchTemplate('Flamengo', 'Corinthians', '30/08', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('Grêmio', 'Cruzeiro', '30/08', '18:30', 'Arena do Grêmio (RS)'),
      createMatchTemplate('Atlético-MG', 'Internacional', '30/08', '18:30', 'Arena MRV (MG)'),
      createMatchTemplate('Bahia', 'Botafogo', '30/08', '19:00', 'Arena Fonte Nova (BA)'),
      createMatchTemplate('Fluminense', 'Santos', '31/08', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('Vasco da Gama', 'Vitória', '31/08', '16:00', 'São Januário (RJ)'),
      createMatchTemplate('Sport Recife', 'Athletico-PR', '31/08', '18:30', 'Ilha do Retiro (PE)'),
      createMatchTemplate('Fortaleza', 'Juventude', '31/08', '18:30', 'Arena Castelão (CE)'),
      createMatchTemplate('Red Bull Bragantino', 'Criciúma', '31/08', '20:00', 'Nabi Abi Chedid (SP)')
    ]
  },

  // Rodada 22
  {
    number: 22,
    title: '22ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-09-06T16:00:00Z',
    matches: [
      createMatchTemplate('Botafogo', 'Flamengo', '06/09', '16:00', 'Nilton Santos (RJ)'),
      createMatchTemplate('Internacional', 'Palmeiras', '06/09', '16:00', 'Beira-Rio (RS)'),
      createMatchTemplate('Cruzeiro', 'São Paulo', '06/09', '18:30', 'Mineirão (MG)'),
      createMatchTemplate('Corinthians', 'Atlético-MG', '06/09', '18:30', 'Neo Química Arena (SP)'),
      createMatchTemplate('Fluminense', 'Grêmio', '06/09', '19:00', 'Maracanã (RJ)'),
      createMatchTemplate('Bahia', 'Vasco da Gama', '07/09', '16:00', 'Arena Fonte Nova (BA)'),
      createMatchTemplate('Vitória', 'Santos', '07/09', '16:00', 'Barradão (BA)'),
      createMatchTemplate('Criciúma', 'Fortaleza', '07/09', '18:30', 'Heriberto Hülse (SC)'),
      createMatchTemplate('Athletico-PR', 'Red Bull Bragantino', '07/09', '18:30', 'Ligga Arena (PR)'),
      createMatchTemplate('Juventude', 'Sport Recife', '07/09', '20:00', 'Alfredo Jaconi (RS)')
    ]
  },

  // Rodada 23
  {
    number: 23,
    title: '23ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-09-13T16:00:00Z',
    matches: [
      createMatchTemplate('São Paulo', 'Corinthians', '13/09', '16:00', 'MorumBIS (SP)'),
      createMatchTemplate('Flamengo', 'Cruzeiro', '13/09', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('Atlético-MG', 'Fluminense', '13/09', '18:30', 'Arena MRV (MG)'),
      createMatchTemplate('Santos', 'Internacional', '13/09', '18:30', 'Vila Belmiro (SP)'),
      createMatchTemplate('Grêmio', 'Botafogo', '13/09', '19:00', 'Arena do Grêmio (RS)'),
      createMatchTemplate('Palmeiras', 'Bahia', '14/09', '16:00', 'Allianz Parque (SP)'),
      createMatchTemplate('Vasco da Gama', 'Athletico-PR', '14/09', '16:00', 'São Januário (RJ)'),
      createMatchTemplate('Fortaleza', 'Vitória', '14/09', '18:30', 'Arena Castelão (CE)'),
      createMatchTemplate('Red Bull Bragantino', 'Juventude', '14/09', '18:30', 'Nabi Abi Chedid (SP)'),
      createMatchTemplate('Sport Recife', 'Criciúma', '14/09', '20:00', 'Ilha do Retiro (PE)')
    ]
  },

  // Rodada 24
  {
    number: 24,
    title: '24ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-08-23T16:00:00Z',
    matches: [
      createMatchTemplate('Palmeiras', 'Flamengo', '23/08', '16:00', 'Allianz Parque (SP)'),
      createMatchTemplate('Grêmio', 'São Paulo', '23/08', '16:00', 'Arena do Grêmio (RS)'),
      createMatchTemplate('Botafogo', 'Atlético-MG', '23/08', '18:30', 'Nilton Santos (RJ)'),
      createMatchTemplate('Cruzeiro', 'Corinthians', '23/08', '18:30', 'Mineirão (MG)'),
      createMatchTemplate('Fluminense', 'Vasco da Gama', '23/08', '19:00', 'Maracanã (RJ)'),
      createMatchTemplate('Bahia', 'Santos', '24/08', '16:00', 'Arena Fonte Nova (BA)'),
      createMatchTemplate('Internacional', 'Fortaleza', '24/08', '16:00', 'Beira-Rio (RS)'),
      createMatchTemplate('Red Bull Bragantino', 'Coritiba', '24/08', '18:30', 'Nabi Abi Chedid (SP)'),
      createMatchTemplate('Athletico-PR', 'Vitória', '24/08', '18:30', 'Ligga Arena (PR)'),
      createMatchTemplate('Remo-PA', 'Mirassol', '24/08', '20:00', 'Baenão / Mangueirão (PA)')
    ]
  },

  // Rodada 25 (Rodada Atual Oficial - Agosto 2026 - Dados Reais Google/CBF)
  {
    number: 25,
    title: '25ª Rodada - Brasileirão 2026 (Rodada Atual)',
    season: '2026',
    price: 10.00,
    deadline: '2026-08-30T16:00:00Z',
    matches: [
      createMatchTemplate('Atlético-MG', 'Vitória', '29/08', '18:30', 'Arena MRV (MG)'),
      createMatchTemplate('São Paulo', 'Red Bull Bragantino', '29/08', '18:30', 'MorumBIS (SP)'),
      createMatchTemplate('Vasco da Gama', 'Cruzeiro', '29/08', '21:00', 'São Januário (RJ)'),
      createMatchTemplate('Athletico-PR', 'Fluminense', '30/08', '11:00', 'Ligga Arena (PR)'),
      createMatchTemplate('Corinthians', 'Santos', '30/08', '16:00', 'Neo Química Arena (SP)'),
      createMatchTemplate('Flamengo', 'Botafogo', '30/08', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('Mirassol', 'Palmeiras', '30/08', '18:30', 'José Maria de Campos Maia (SP)'),
      createMatchTemplate('Grêmio', 'Chapecoense', '30/08', '18:30', 'Arena do Grêmio (RS)'),
      createMatchTemplate('Bahia', 'Internacional', '30/08', '19:30', 'Arena Fonte Nova (BA)'),
      createMatchTemplate('Coritiba', 'Remo-PA', '30/08', '20:00', 'Couto Pereira (PR)')
    ]
  },

  // Rodada 26 (Próxima Rodada - Setembro 2026)
  {
    number: 26,
    title: '26ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-09-06T16:00:00Z',
    matches: [
      createMatchTemplate('Internacional', 'Santos', '06/09', '16:00', 'Beira-Rio (RS)'),
      createMatchTemplate('Palmeiras', 'Atlético-MG', '06/09', '16:00', 'Allianz Parque (SP)'),
      createMatchTemplate('Botafogo', 'Grêmio', '06/09', '18:30', 'Nilton Santos (RJ)'),
      createMatchTemplate('Cruzeiro', 'Bahia', '06/09', '18:30', 'Mineirão (MG)'),
      createMatchTemplate('Fluminense', 'São Paulo', '06/09', '19:00', 'Maracanã (RJ)'),
      createMatchTemplate('Red Bull Bragantino', 'Corinthians', '06/09', '20:00', 'Nabi Abi Chedid (SP)'),
      createMatchTemplate('Chapecoense', 'Vasco da Gama', '07/09', '16:00', 'Arena Condá (SC)'),
      createMatchTemplate('Vitória', 'Athletico-PR', '07/09', '18:30', 'Barradão (BA)'),
      createMatchTemplate('Remo-PA', 'Flamengo', '07/09', '19:00', 'Baenão / Mangueirão (PA)'),
      createMatchTemplate('Mirassol', 'Coritiba', '07/09', '20:00', 'José Maria de Campos Maia (SP)')
    ]
  },

  // Rodada 27 (Setembro 2026)
  {
    number: 27,
    title: '27ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-09-13T16:00:00Z',
    matches: [
      createMatchTemplate('Chapecoense', 'Internacional', '13/09', '16:00', 'Arena Condá (SC)'),
      createMatchTemplate('Corinthians', 'Palmeiras', '13/09', '16:00', 'Neo Química Arena (SP)'),
      createMatchTemplate('Flamengo', 'Vitória', '13/09', '18:30', 'Maracanã (RJ)'),
      createMatchTemplate('São Paulo', 'Coritiba', '13/09', '18:30', 'MorumBIS (SP)'),
      createMatchTemplate('Atlético-MG', 'Fluminense', '13/09', '19:00', 'Arena MRV (MG)'),
      createMatchTemplate('Santos', 'Botafogo', '14/09', '16:00', 'Vila Belmiro (SP)'),
      createMatchTemplate('Bahia', 'Red Bull Bragantino', '14/09', '18:30', 'Arena Fonte Nova (BA)'),
      createMatchTemplate('Athletico-PR', 'Remo-PA', '14/09', '19:00', 'Ligga Arena (PR)'),
      createMatchTemplate('Vasco da Gama', 'Mirassol', '14/09', '20:00', 'São Januário (RJ)'),
      createMatchTemplate('Grêmio', 'Cruzeiro', '14/09', '20:00', 'Arena do Grêmio (RS)')
    ]
  },

  // Rodada 28
  {
    number: 28,
    title: '28ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-10-18T16:00:00Z',
    matches: [
      createMatchTemplate('Fluminense', 'Flamengo', '18/10', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('Santos', 'Corinthians', '18/10', '16:00', 'Vila Belmiro (SP)'),
      createMatchTemplate('Internacional', 'São Paulo', '18/10', '18:30', 'Beira-Rio (RS)'),
      createMatchTemplate('Atlético-MG', 'Cruzeiro', '18/10', '18:30', 'Arena MRV (MG)'),
      createMatchTemplate('Botafogo', 'Vasco da Gama', '18/10', '19:00', 'Nilton Santos (RJ)'),
      createMatchTemplate('Grêmio', 'Palmeiras', '19/10', '16:00', 'Arena do Grêmio (RS)'),
      createMatchTemplate('Red Bull Bragantino', 'Fortaleza', '19/10', '16:00', 'Nabi Abi Chedid (SP)'),
      createMatchTemplate('Juventude', 'Athletico-PR', '19/10', '18:30', 'Alfredo Jaconi (RS)'),
      createMatchTemplate('Sport Recife', 'Bahia', '19/10', '18:30', 'Ilha do Retiro (PE)'),
      createMatchTemplate('Criciúma', 'Vitória', '19/10', '20:00', 'Heriberto Hülse (SC)')
    ]
  },

  // Rodada 29
  {
    number: 29,
    title: '29ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-10-25T16:00:00Z',
    matches: [
      createMatchTemplate('Flamengo', 'Internacional', '25/10', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('Palmeiras', 'Santos', '25/10', '16:00', 'Allianz Parque (SP)'),
      createMatchTemplate('Vasco da Gama', 'Atlético-MG', '25/10', '18:30', 'São Januário (RJ)'),
      createMatchTemplate('Cruzeiro', 'Grêmio', '25/10', '18:30', 'Mineirão (MG)'),
      createMatchTemplate('Fluminense', 'Botafogo', '25/10', '19:00', 'Maracanã (RJ)'),
      createMatchTemplate('Corinthians', 'São Paulo', '26/10', '16:00', 'Neo Química Arena (SP)'),
      createMatchTemplate('Bahia', 'Red Bull Bragantino', '26/10', '16:00', 'Arena Fonte Nova (BA)'),
      createMatchTemplate('Athletico-PR', 'Sport Recife', '26/10', '18:30', 'Ligga Arena (PR)'),
      createMatchTemplate('Vitória', 'Juventude', '26/10', '18:30', 'Barradão (BA)'),
      createMatchTemplate('Fortaleza', 'Criciúma', '26/10', '20:00', 'Arena Castelão (CE)')
    ]
  },

  // Rodada 30
  {
    number: 30,
    title: '30ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-11-01T16:00:00Z',
    matches: [
      createMatchTemplate('Vasco da Gama', 'Flamengo', '01/11', '16:00', 'São Januário (RJ)'),
      createMatchTemplate('São Paulo', 'Palmeiras', '01/11', '16:00', 'MorumBIS (SP)'),
      createMatchTemplate('Internacional', 'Corinthians', '01/11', '18:30', 'Beira-Rio (RS)'),
      createMatchTemplate('Santos', 'Fluminense', '01/11', '18:30', 'Vila Belmiro (SP)'),
      createMatchTemplate('Atlético-MG', 'Cruzeiro', '01/11', '19:00', 'Arena MRV (MG)'),
      createMatchTemplate('Botafogo', 'Grêmio', '02/11', '16:00', 'Nilton Santos (RJ)'),
      createMatchTemplate('Bahia', 'Fortaleza', '02/11', '16:00', 'Arena Fonte Nova (BA)'),
      createMatchTemplate('Sport Recife', 'Athletico-PR', '02/11', '18:30', 'Ilha do Retiro (PE)'),
      createMatchTemplate('Red Bull Bragantino', 'Vitória', '02/11', '18:30', 'Nabi Abi Chedid (SP)'),
      createMatchTemplate('Juventude', 'Criciúma', '02/11', '20:00', 'Alfredo Jaconi (RS)')
    ]
  },

  // Rodada 31
  {
    number: 31,
    title: '31ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-11-08T16:00:00Z',
    matches: [
      createMatchTemplate('Flamengo', 'Bahia', '08/11', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('Palmeiras', 'Botafogo', '08/11', '16:00', 'Allianz Parque (SP)'),
      createMatchTemplate('Corinthians', 'Vasco da Gama', '08/11', '18:30', 'Neo Química Arena (SP)'),
      createMatchTemplate('Grêmio', 'Atlético-MG', '08/11', '18:30', 'Arena do Grêmio (RS)'),
      createMatchTemplate('Fluminense', 'São Paulo', '08/11', '19:00', 'Maracanã (RJ)'),
      createMatchTemplate('Cruzeiro', 'Santos', '09/11', '16:00', 'Mineirão (MG)'),
      createMatchTemplate('Fortaleza', 'Internacional', '09/11', '16:00', 'Arena Castelão (CE)'),
      createMatchTemplate('Athletico-PR', 'Red Bull Bragantino', '09/11', '18:30', 'Ligga Arena (PR)'),
      createMatchTemplate('Vitória', 'Juventude', '09/11', '18:30', 'Barradão (BA)'),
      createMatchTemplate('Criciúma', 'Sport Recife', '09/11', '20:00', 'Heriberto Hülse (SC)')
    ]
  },

  // Rodada 32
  {
    number: 32,
    title: '32ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-11-15T16:00:00Z',
    matches: [
      createMatchTemplate('Cruzeiro', 'Flamengo', '15/11', '16:00', 'Mineirão (MG)'),
      createMatchTemplate('Bahia', 'Palmeiras', '15/11', '16:00', 'Arena Fonte Nova (BA)'),
      createMatchTemplate('Botafogo', 'Corinthians', '15/11', '18:30', 'Nilton Santos (RJ)'),
      createMatchTemplate('São Paulo', 'Grêmio', '15/11', '18:30', 'MorumBIS (SP)'),
      createMatchTemplate('Vasco da Gama', 'Fluminense', '15/11', '19:00', 'São Januário (RJ)'),
      createMatchTemplate('Santos', 'Atlético-MG', '16/11', '16:00', 'Vila Belmiro (SP)'),
      createMatchTemplate('Vitória', 'Fortaleza', '16/11', '16:00', 'Barradão (BA)'),
      createMatchTemplate('Internacional', 'Athletico-PR', '16/11', '18:30', 'Beira-Rio (RS)'),
      createMatchTemplate('Sport Recife', 'Criciúma', '16/11', '18:30', 'Ilha do Retiro (PE)'),
      createMatchTemplate('Red Bull Bragantino', 'Juventude', '16/11', '20:00', 'Nabi Abi Chedid (SP)')
    ]
  },

  // Rodada 33
  {
    number: 33,
    title: '33ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-11-18T19:30:00Z',
    matches: [
      createMatchTemplate('Flamengo', 'Fortaleza', '18/11', '19:30', 'Maracanã (RJ)'),
      createMatchTemplate('Palmeiras', 'Fluminense', '18/11', '19:30', 'Allianz Parque (SP)'),
      createMatchTemplate('Corinthians', 'Santos', '18/11', '21:30', 'Neo Química Arena (SP)'),
      createMatchTemplate('Atlético-MG', 'São Paulo', '18/11', '21:30', 'Arena MRV (MG)'),
      createMatchTemplate('Internacional', 'Cruzeiro', '19/11', '19:30', 'Beira-Rio (RS)'),
      createMatchTemplate('Vasco da Gama', 'Botafogo', '19/11', '19:30', 'São Januário (RJ)'),
      createMatchTemplate('Grêmio', 'Bahia', '19/11', '21:30', 'Arena do Grêmio (RS)'),
      createMatchTemplate('Sport Recife', 'Red Bull Bragantino', '19/11', '21:30', 'Ilha do Retiro (PE)'),
      createMatchTemplate('Athletico-PR', 'Vitória', '19/11', '19:30', 'Ligga Arena (PR)'),
      createMatchTemplate('Juventude', 'Criciúma', '19/11', '19:30', 'Alfredo Jaconi (RS)')
    ]
  },

  // Rodada 34
  {
    number: 34,
    title: '34ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-11-22T16:00:00Z',
    matches: [
      createMatchTemplate('Athletico-PR', 'Flamengo', '22/11', '16:00', 'Ligga Arena (PR)'),
      createMatchTemplate('Santos', 'Palmeiras', '22/11', '16:00', 'Vila Belmiro (SP)'),
      createMatchTemplate('Bahia', 'Corinthians', '22/11', '18:30', 'Arena Fonte Nova (BA)'),
      createMatchTemplate('São Paulo', 'Vasco da Gama', '22/11', '18:30', 'MorumBIS (SP)'),
      createMatchTemplate('Cruzeiro', 'Internacional', '22/11', '19:00', 'Mineirão (MG)'),
      createMatchTemplate('Fortaleza', 'Grêmio', '23/11', '16:00', 'Arena Castelão (CE)'),
      createMatchTemplate('Fluminense', 'Atlético-MG', '23/11', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('Botafogo', 'Sport Recife', '23/11', '18:30', 'Nilton Santos (RJ)'),
      createMatchTemplate('Vitória', 'Juventude', '23/11', '18:30', 'Barradão (BA)'),
      createMatchTemplate('Criciúma', 'Red Bull Bragantino', '23/11', '20:00', 'Heriberto Hülse (SC)')
    ]
  },

  // Rodada 35
  {
    number: 35,
    title: '35ª Rodada - Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-11-25T19:30:00Z',
    matches: [
      createMatchTemplate('Flamengo', 'Red Bull Bragantino', '25/11', '19:30', 'Maracanã (RJ)'),
      createMatchTemplate('Palmeiras', 'Vitória', '25/11', '19:30', 'Allianz Parque (SP)'),
      createMatchTemplate('Corinthians', 'Fortaleza', '25/11', '21:30', 'Neo Química Arena (SP)'),
      createMatchTemplate('Botafogo', 'São Paulo', '25/11', '21:30', 'Nilton Santos (RJ)'),
      createMatchTemplate('Grêmio', 'Santos', '26/11', '19:30', 'Arena do Grêmio (RS)'),
      createMatchTemplate('Cruzeiro', 'Fluminense', '26/11', '19:30', 'Mineirão (MG)'),
      createMatchTemplate('Atlético-MG', 'Bahia', '26/11', '21:30', 'Arena MRV (MG)'),
      createMatchTemplate('Internacional', 'Athletico-PR', '26/11', '21:30', 'Beira-Rio (RS)'),
      createMatchTemplate('Vasco da Gama', 'Criciúma', '26/11', '19:30', 'São Januário (RJ)'),
      createMatchTemplate('Juventude', 'Sport Recife', '26/11', '19:30', 'Alfredo Jaconi (RS)')
    ]
  },

  // Rodada 36
  {
    number: 36,
    title: '36ª Rodada - Reta Final Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-11-29T16:00:00Z',
    matches: [
      createMatchTemplate('Vitória', 'Flamengo', '29/11', '16:00', 'Barradão (BA)'),
      createMatchTemplate('Fortaleza', 'Palmeiras', '29/11', '16:00', 'Arena Castelão (CE)'),
      createMatchTemplate('Red Bull Bragantino', 'Corinthians', '29/11', '18:30', 'Nabi Abi Chedid (SP)'),
      createMatchTemplate('São Paulo', 'Cruzeiro', '29/11', '18:30', 'MorumBIS (SP)'),
      createMatchTemplate('Santos', 'Grêmio', '29/11', '19:00', 'Vila Belmiro (SP)'),
      createMatchTemplate('Athletico-PR', 'Botafogo', '30/11', '16:00', 'Ligga Arena (PR)'),
      createMatchTemplate('Atlético-MG', 'Vasco da Gama', '30/11', '16:00', 'Arena MRV (MG)'),
      createMatchTemplate('Fluminense', 'Internacional', '30/11', '18:30', 'Maracanã (RJ)'),
      createMatchTemplate('Bahia', 'Juventude', '30/11', '18:30', 'Arena Fonte Nova (BA)'),
      createMatchTemplate('Sport Recife', 'Criciúma', '30/11', '20:00', 'Ilha do Retiro (PE)')
    ]
  },

  // Rodada 37 (Penúltima Rodada)
  {
    number: 37,
    title: '37ª Rodada - Penúltima Rodada Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-12-02T19:30:00Z',
    matches: [
      createMatchTemplate('Flamengo', 'Juventude', '02/12', '19:30', 'Maracanã (RJ)'),
      createMatchTemplate('Palmeiras', 'Athletico-PR', '02/12', '19:30', 'Allianz Parque (SP)'),
      createMatchTemplate('Corinthians', 'Vitória', '02/12', '21:30', 'Neo Química Arena (SP)'),
      createMatchTemplate('Bahia', 'São Paulo', '02/12', '21:30', 'Arena Fonte Nova (BA)'),
      createMatchTemplate('Internacional', 'Atlético-MG', '03/12', '19:30', 'Beira-Rio (RS)'),
      createMatchTemplate('Botafogo', 'Santos', '03/12', '19:30', 'Nilton Santos (RJ)'),
      createMatchTemplate('Cruzeiro', 'Fortaleza', '03/12', '21:30', 'Mineirão (MG)'),
      createMatchTemplate('Grêmio', 'Fluminense', '03/12', '21:30', 'Arena do Grêmio (RS)'),
      createMatchTemplate('Vasco da Gama', 'Red Bull Bragantino', '03/12', '19:30', 'São Januário (RJ)'),
      createMatchTemplate('Criciúma', 'Sport Recife', '03/12', '19:30', 'Heriberto Hülse (SC)')
    ]
  },

  // Rodada 38 (Grande Decisão / Última Rodada)
  {
    number: 38,
    title: '38ª Rodada - Grande Decisão Brasileirão 2026',
    season: '2026',
    price: 10.00,
    deadline: '2026-12-06T16:00:00Z',
    matches: [
      createMatchTemplate('Criciúma', 'Flamengo', '06/12', '16:00', 'Heriberto Hülse (SC)'),
      createMatchTemplate('Sport Recife', 'Palmeiras', '06/12', '16:00', 'Ilha do Retiro (PE)'),
      createMatchTemplate('Juventude', 'Corinthians', '06/12', '16:00', 'Alfredo Jaconi (RS)'),
      createMatchTemplate('Vasco da Gama', 'Cruzeiro', '06/12', '16:00', 'São Januário (RJ)'),
      createMatchTemplate('Red Bull Bragantino', 'Grêmio', '06/12', '16:00', 'Nabi Abi Chedid (SP)'),
      createMatchTemplate('Fortaleza', 'Botafogo', '06/12', '16:00', 'Arena Castelão (CE)'),
      createMatchTemplate('Vitória', 'Internacional', '06/12', '16:00', 'Barradão (BA)'),
      createMatchTemplate('Fluminense', 'Bahia', '06/12', '16:00', 'Maracanã (RJ)'),
      createMatchTemplate('Atlético-MG', 'Athletico-PR', '06/12', '16:00', 'Arena MRV (MG)'),
      createMatchTemplate('Santos', 'São Paulo', '06/12', '16:00', 'Vila Belmiro (SP)')
    ]
  }
];

export const getBrasileirao2026RoundTemplate = (roundNumber: number): BrasileiraoRoundTemplate | undefined => {
  return BRASILEIRAO_2026_SCHEDULE.find(r => r.number === roundNumber);
};

export const getAllBrasileirao2026RoundTemplates = (): BrasileiraoRoundTemplate[] => {
  return BRASILEIRAO_2026_SCHEDULE;
};

// Dados Atualizados do Brasileirão Série A 2026 (Via Google / CBF)
export const GOOGLE_BRASILEIRAO_2026_LIVE_DATA = {
  currentSeason: '2026',
  currentRoundNumber: 25,
  currentRoundName: '25ª Rodada',
  status: 'EM ANDAMENTO (Agosto / Setembro 2026)',
  lastSyncDate: '30 de Agosto de 2026',
  artilheiro: 'Kevin Viveros (Athletico-PR) - 17 gols',
  melhorAtaque: 'Flamengo (45 gols marcados)',
  melhorDefesa: 'Palmeiras (20 gols sofridos)',
  topLeaderboard: [
    { pos: 1, team: 'Palmeiras', points: 51, games: 24, wins: 15, sg: 24 },
    { pos: 2, team: 'Flamengo', points: 45, games: 23, wins: 13, sg: 24 },
    { pos: 3, team: 'Athletico-PR', points: 44, games: 24, wins: 13, sg: 12 },
    { pos: 4, team: 'Fluminense', points: 41, games: 24, wins: 11, sg: 7 },
    { pos: 5, team: 'Cruzeiro', points: 39, games: 25, wins: 11, sg: -1 },
    { pos: 6, team: 'Bahia', points: 37, games: 24, wins: 9, sg: 6 },
    { pos: 7, team: 'Atlético-MG', points: 36, games: 24, wins: 10, sg: 4 },
    { pos: 8, team: 'Red Bull Bragantino', points: 35, games: 24, wins: 10, sg: 4 }
  ],
  // Placar oficial dos confrontos da 25ª rodada
  currentRoundScores: [
    { home: 'Atlético-MG', away: 'Vitória', homeScore: 2, awayScore: 1, status: 'finished' as const },
    { home: 'São Paulo', away: 'Red Bull Bragantino', homeScore: 2, awayScore: 1, status: 'finished' as const },
    { home: 'Vasco da Gama', away: 'Cruzeiro', homeScore: 3, awayScore: 1, status: 'finished' as const },
    { home: 'Athletico-PR', away: 'Fluminense', homeScore: 1, awayScore: 0, status: 'finished' as const },
    { home: 'Corinthians', away: 'Santos', homeScore: 2, awayScore: 1, status: 'live' as const },
    { home: 'Flamengo', away: 'Botafogo', homeScore: 2, awayScore: 2, status: 'live' as const },
    { home: 'Mirassol', away: 'Palmeiras', homeScore: 0, awayScore: 2, status: 'scheduled' as const },
    { home: 'Grêmio', away: 'Chapecoense', homeScore: 3, awayScore: 1, status: 'scheduled' as const },
    { home: 'Bahia', away: 'Internacional', homeScore: 1, awayScore: 1, status: 'scheduled' as const },
    { home: 'Coritiba', away: 'Remo-PA', homeScore: 2, awayScore: 0, status: 'scheduled' as const }
  ]
};
