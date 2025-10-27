import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  TextChannel,
} from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-management")
    .setDescription("Sends the embed for management tools")
    .setDefaultMemberPermissions(0),

  async execute(
    interaction: ChatInputCommandInteraction,
    client: Client<true>
  ) {},
};
