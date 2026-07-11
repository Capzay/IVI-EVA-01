import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  Client,
} from "discord.js";
import {
  readRoster,
  writeRoster,
  findTeam,
  allTeamNames,
} from "../../util/roster";
import { updateRosterEmbed } from "../../handlers/updateRosterEmbed";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rosters")
    .setDescription("Manage the ivi rosters embed")
    .setDefaultMemberPermissions(0)
    .addSubcommand((sub) =>
      sub
        .setName("post")
        .setDescription("Post or refresh the rosters embed in the rosters channel")
    )
    .addSubcommand((sub) =>
      sub
        .setName("create-team")
        .setDescription("Add a new team to the rosters")
        .addStringOption((opt) =>
          opt
            .setName("category")
            .setDescription("The header the team sits under (e.g. // ivi Rosters)")
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("emoji")
            .setDescription("Emoji shown before the team name, e.g. <:iviPink:123>")
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("name")
            .setDescription("Team name, e.g. ivi Orion Drift EU")
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("players")
            .setDescription("Optional initial players, comma-separated")
            .setRequired(false)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove-team")
        .setDescription("Remove a team from the rosters")
        .addStringOption((opt) =>
          opt
            .setName("team")
            .setDescription("The team to remove")
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("add-player")
        .setDescription("Add a player to a team")
        .addStringOption((opt) =>
          opt
            .setName("team")
            .setDescription("The team to add to")
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("player")
            .setDescription("Player line, e.g. Gooblin (*Captain*)")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove-player")
        .setDescription("Remove a player from a team")
        .addStringOption((opt) =>
          opt
            .setName("team")
            .setDescription("The team to remove from")
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("player")
            .setDescription("The player to remove")
            .setAutocomplete(true)
            .setRequired(true)
        )
    ),

  async autocomplete(interaction: AutocompleteInteraction) {
    const focused = interaction.options.getFocused(true);
    const data = readRoster();
    const query = focused.value.toLowerCase();

    let choices: string[] = [];
    if (focused.name === "team") {
      choices = allTeamNames(data);
    } else if (focused.name === "category") {
      choices = data.categories.map((c) => c.name);
    } else if (focused.name === "player") {
      const teamName = interaction.options.getString("team");
      const found = teamName ? findTeam(data, teamName) : undefined;
      choices = found ? found.team.players : [];
    }

    const filtered = choices
      .filter((c) => c.toLowerCase().includes(query))
      .slice(0, 25)
      .map((c) => ({ name: c.slice(0, 100), value: c.slice(0, 100) }));

    await interaction.respond(filtered);
  },

  async execute(interaction: ChatInputCommandInteraction, client: Client<true>) {
    await interaction.deferReply({ ephemeral: true });
    const sub = interaction.options.getSubcommand();

    if (sub === "post") {
      await updateRosterEmbed(client);
      return interaction.editReply("Rosters embed posted/refreshed. ✅");
    }

    if (sub === "create-team") {
      const category = interaction.options.getString("category", true).trim();
      const emoji = interaction.options.getString("emoji", true).trim();
      const name = interaction.options.getString("name", true).trim();
      const playersRaw = interaction.options.getString("players");
      const players = playersRaw
        ? playersRaw
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean)
        : [];

      const data = readRoster();
      if (findTeam(data, name)) {
        return interaction.editReply(`A team named **${name}** already exists.`);
      }

      let cat = data.categories.find(
        (c) => c.name.toLowerCase() === category.toLowerCase()
      );
      if (!cat) {
        cat = { name: category, teams: [] };
        data.categories.push(cat);
      }
      cat.teams.push({ emoji, name, players });
      writeRoster(data);
      await updateRosterEmbed(client);
      return interaction.editReply(
        `Created team **${name}** under \`${cat.name}\`. ✅`
      );
    }

    if (sub === "remove-team") {
      const teamName = interaction.options.getString("team", true);
      const data = readRoster();
      const found = findTeam(data, teamName);
      if (!found) {
        return interaction.editReply(`No team named **${teamName}** found.`);
      }
      const cat = data.categories.find((c) => c.name === found.categoryName)!;
      cat.teams = cat.teams.filter(
        (t) => t.name.toLowerCase() !== teamName.toLowerCase()
      );
      // Drop the category header once its last team is gone.
      if (cat.teams.length === 0) {
        data.categories = data.categories.filter((c) => c !== cat);
      }
      writeRoster(data);
      await updateRosterEmbed(client);
      return interaction.editReply(`Removed team **${found.team.name}**. ✅`);
    }

    if (sub === "add-player") {
      const teamName = interaction.options.getString("team", true);
      const player = interaction.options.getString("player", true).trim();
      const data = readRoster();
      const found = findTeam(data, teamName);
      if (!found) {
        return interaction.editReply(`No team named **${teamName}** found.`);
      }
      found.team.players.push(player);
      writeRoster(data);
      await updateRosterEmbed(client);
      return interaction.editReply(
        `Added **${player}** to **${found.team.name}**. ✅`
      );
    }

    if (sub === "remove-player") {
      const teamName = interaction.options.getString("team", true);
      const player = interaction.options.getString("player", true);
      const data = readRoster();
      const found = findTeam(data, teamName);
      if (!found) {
        return interaction.editReply(`No team named **${teamName}** found.`);
      }
      const before = found.team.players.length;
      found.team.players = found.team.players.filter(
        (p) => p.toLowerCase() !== player.toLowerCase()
      );
      if (found.team.players.length === before) {
        return interaction.editReply(
          `**${player}** is not in **${found.team.name}**.`
        );
      }
      writeRoster(data);
      await updateRosterEmbed(client);
      return interaction.editReply(
        `Removed **${player}** from **${found.team.name}**. ✅`
      );
    }

    return interaction.editReply("Unknown subcommand.");
  },
};
