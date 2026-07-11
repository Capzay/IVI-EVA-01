export interface RosterTeam {
  // Emoji shown before the team name, e.g. "<:iviPink:1314906186717466627>".
  emoji: string;
  name: string;
  // Player lines exactly as displayed, e.g. "Gooblin (*Captain*)". Captain /
  // Co-Captain markers are typed by staff as part of the player string.
  players: string[];
}

export interface RosterCategory {
  // Header text, e.g. "// ivi Rosters".
  name: string;
  teams: RosterTeam[];
}

export interface RosterData {
  // Channel + message the embed lives in, so mutations can edit it in place.
  channelId: string | null;
  messageId: string | null;
  categories: RosterCategory[];
  footer: string;
}
