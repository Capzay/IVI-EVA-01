import * as fs from "fs";
import * as path from "path";
import { RosterData, RosterTeam } from "../types/roster";

// cwd-relative, matching the rest of the project's data access (the bot always
// runs from the project root in dev and Docker).
const ROSTER_PATH = path.join("src", "data", "roster.json");

export function readRoster(): RosterData {
  return JSON.parse(fs.readFileSync(ROSTER_PATH, "utf-8")) as RosterData;
}

export function writeRoster(data: RosterData): void {
  fs.writeFileSync(ROSTER_PATH, JSON.stringify(data, null, 2));
}

// Locate a team by name (case-insensitive) across all categories.
export function findTeam(
  data: RosterData,
  teamName: string
): { team: RosterTeam; categoryName: string } | undefined {
  for (const category of data.categories) {
    const team = category.teams.find(
      (t) => t.name.toLowerCase() === teamName.toLowerCase()
    );
    if (team) return { team, categoryName: category.name };
  }
  return undefined;
}

// All team names, for autocomplete.
export function allTeamNames(data: RosterData): string[] {
  return data.categories.flatMap((c) => c.teams.map((t) => t.name));
}
