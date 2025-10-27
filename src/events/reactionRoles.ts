import {
  ButtonInteraction,
  Events,
  Interaction,
  Client,
  TextChannel,
} from "discord.js";
import { ErrorEmbed } from "../embeds/Errors";
import { getEnvVariable } from "../util/getEnvVar";
import { HandleError } from "../handlers/handleError";

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction, client: Client<true>) {
    try {
      if (interaction.isButton()) {
        const i = interaction as ButtonInteraction;
        const regex = /(\d+)-react/;
        const match = i.customId.match(regex);
        if (match && i.guild) {
          if (!i.deferred) await i.deferReply({ ephemeral: true });
          const roleId = match[1];

          const member = i.guild.members.cache.get(i.user.id);
          if (!member) return;

          const roles = member.roles.cache.map((role) => role.id);
          const hasRole = roles.includes(roleId);

          if (hasRole) {
            await member.roles.remove(roleId);
            await i.editReply({
              content: `Removed role <@&${roleId}> from you.`,
            });
          } else {
            await member.roles.add(roleId);
            await i.editReply({
              content: `Added role <@&${roleId}> to you.`,
            });
          }
        }
      }
    } catch (error) {
      const i = interaction as ButtonInteraction;

      if (error instanceof Error) {
        await HandleError(error, client);

        return i.followUp({
          content: "An error occurred while processing your request.",
        });
      } else {
        return i.followUp({
          content: "An error occurred while processing your request.",
        });
      }
    }
  },
};
