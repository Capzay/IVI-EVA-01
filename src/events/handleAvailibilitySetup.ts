import {
  ButtonInteraction,
  Events,
  Interaction,
  Client,
  TextChannel,
  Role,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} from "discord.js";
import { HandleError } from "../handlers/handleError";
import { readAvailabilityConfig } from "../util/readAvailabilityConfig";

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction, client: Client<true>) {
    try {
      if (interaction.isButton()) {
        const i = interaction as ButtonInteraction;
        if (!i.member) return;
        if (!i.guild) return;
        if (i.customId !== "setup-availability") return;
        if (!i.deferred) await i.deferReply({ ephemeral: true });

        const availabilityConfig = readAvailabilityConfig();

        const member = i.guild.members.cache.get(i.user.id);
        if (!member) return;

        const regex = /^[a-zA-Z\s]+ - ivi/;
        let teamRoles: Role[] = [];
        member.roles.cache.map((role) => {
          if (regex.test(role.name)) {
            teamRoles.push(role);
          }
        });

        if (teamRoles.length !== 0) {
          teamRoles.forEach((role) => {
            const teamNames = Object.keys(availabilityConfig);
            if (teamNames.includes(role.name)) {
              teamRoles = teamRoles.filter(
                (teamRole) => teamRole.id !== role.id
              );
            }
          });
          if (teamRoles.length !== 0) {
            const selectComponent = new StringSelectMenuBuilder()
              .setCustomId("select-avail-role")
              .setPlaceholder("Select your team")
              .setMinValues(1)
              .setMaxValues(1)
              .addOptions(
                teamRoles.map((role) => ({
                  label: role.name,
                  value: role.id,
                }))
              );
            const selectMenu =
              new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                selectComponent
              );
            await i.editReply({
              content:
                "Please select your team role(s) from the dropdown below.",
              components: [selectMenu],
            });
          }
        }

        return i.editReply({
          content: "Availability setup complete.",
        });
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
