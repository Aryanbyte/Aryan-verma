
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface NewsResponse {
  text: string;
  groundingChunks: GroundingChunk[];
}

export interface PlayerStatsDetail {
  matches: string;
  runs: string;
  average: string;
  strikeRate: string;
  wickets?: string;
  economy?: string;
  bestFigures?: string;
}

export interface PlayerProfileData {
  name: string;
  role: string;
  country: string;
  battingStyle: string;
  bowlingStyle: string;
  bio: string;
  careerHighlights: string[];
  recentForm: string;
  majorTeams: string[];
  battingStats: PlayerStatsDetail;
  bowlingStats: PlayerStatsDetail;
}

export interface MatchInfo {
  team1: string;
  team2: string;
  score?: string;
  status: string;
  date?: string;
  venue: string;
  result?: string;
}

export interface MatchData {
  live: MatchInfo[];
  recent: MatchInfo[];
  upcoming: MatchInfo[];
}

export interface TeamStanding {
  rank: number;
  team: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  nrr: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}
