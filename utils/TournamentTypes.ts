interface Participant {
  name: string;
}

interface Match {
  participant1: string;
  participant2: string;
  winner: string | null;
}

interface Bracket {
  id?: string
  matchdata: {
    id: string,
    rounds: Match[]
  };
}

export type { Participant, Match, Bracket };
