import {
  ButtonInteraction,
  Events,
  Interaction,
  Client,
  TextChannel,
  Role,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  StringSelectMenuInteraction,
} from "discord.js";
import { HandleError } from "../handlers/handleError";
import { readAvailabilityConfig } from "../util/readAvailabilityConfig";
import { AvailabilityConfig } from "../types/availabilityConfig";
import {
  normalizeUnicodeText,
  unicodeTextIncludes,
} from "../util/normalizeUnicode";
import * as fs from "fs";
import { sendAvailabilityEmbed } from "../handlers/sendAvailabilityEmbed";
import { Availability } from "../types/availability";

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction, client: Client<true>) {
    if (!interaction.isStringSelectMenu()) return;

    const i = interaction as StringSelectMenuInteraction;
    if (!i.deferred) await i.deferReply({ ephemeral: true });
    if (!i.member) return;
    if (!i.guild) return;

    if (i.customId === "select-avail-role") {
      const selectedRoleId = i.values[0];
      const member = i.guild.members.cache.get(i.user.id);
      if (!member) return;

      const role = i.guild.roles.cache.get(selectedRoleId);
      if (!role) {
        await i.editReply({ content: "Selected role not found." });
        return;
      }
      const strippedName = role.name.replace(" - ivi", "");

      const categories = role.guild.channels.cache.filter(
        (ch) => ch.type === 4
      );

      const category =
        role.guild.channels.cache.find((ch) => {
          if (ch.type !== 4) return false;
          const normalizedChannelName = normalizeUnicodeText(ch.name);
          const normalizedSearchName = strippedName.toLowerCase();
          return unicodeTextIncludes(ch.name, strippedName);
        }) || null;

      if (!category) {
        await i.editReply({
          content: `Team category not found. ${strippedName}`,
        });
        return;
      }

      const channelsInCategory = i.guild.channels.cache.filter(
        (ch) => ch.parentId === category.id && ch.isTextBased()
      );

      if (channelsInCategory.size === 0) {
        await i.editReply({
          content: `No text channels found in category ${category.name}`,
        });
        return;
      }

      const channelOptions = channelsInCategory.map((channel) => ({
        label: channel.name,
        value: channel.id,
      }));

      const limitedOptions = channelOptions.slice(0, 25);

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("select-availability-channel")
        .setPlaceholder("Choose a channel for availability tracking")
        .addOptions(limitedOptions);

      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        selectMenu
      );

      const availabilityConfig = readAvailabilityConfig();
      const teamConfig: AvailabilityConfig = {
        [role.name]: {
          availabilityChannel: null,
          captainID: i.user.id,
          roleID: role.id,
          embedMessageID: null,
          pingMessageID: null,
        },
      };

      Object.assign(availabilityConfig, teamConfig);
      // Save the updated availabilityConfig back to the file
      fs.writeFileSync(
        "src/data/availability-config.json",
        JSON.stringify(availabilityConfig, null, 2)
      );

      await i.editReply({
        content: `Found ${channelsInCategory.size} channels in **${category.name}**. Please select which channel to use for availability tracking:`,
        components: [row],
      });
    }

    if (i.customId === "select-availability-channel") {
      const selectedChannelId = i.values[0];
      const selectedChannel = i.guild.channels.cache.get(selectedChannelId);

      if (!selectedChannel) {
        await i.editReply({ content: "Selected channel not found." });
        return;
      }

      const availabilityConfig = readAvailabilityConfig();
      for (const teamName in availabilityConfig) {
        if (availabilityConfig[teamName].captainID === i.user.id) {
          if (availabilityConfig[teamName].roleID === null) return;
          const message = await sendAvailabilityEmbed(
            i,
            selectedChannelId,
            availabilityConfig[teamName].roleID
          );
          if (!message) {
            await i.editReply({
              content: "Failed to send availability embed.",
            });
            return;
          }
          availabilityConfig[teamName].availabilityChannel = selectedChannelId;
          availabilityConfig[teamName].embedMessageID = message[0].id;
          availabilityConfig[teamName].pingMessageID = message[1].id;

          const now = new Date();
          const dayOfWeek = now.getUTCDay();
          const daysUntilNextMonday = (8 - dayOfWeek) % 7 || 7;
          const nextMonday = new Date(
            Date.UTC(
              now.getUTCFullYear(),
              now.getUTCMonth(),
              now.getUTCDate() + daysUntilNextMonday,
              6,
              0,
              0,
              0
            )
          );

          const newAvailability: Availability = {
            monday: [""],
            tuesday: [""],
            wednesday: [""],
            thursday: [""],
            friday: [""],
            saturday: [""],
            sunday: [""],
            lastReset: new Date().toUTCString(),
            nextReset: nextMonday.toUTCString(),
          };

          fs.writeFileSync(
            `src/data/availability/${availabilityConfig[teamName].roleID}.json`,
            JSON.stringify(newAvailability, null, 2)
          );
          break;
        }
      }

      fs.writeFileSync(
        "src/data/availability-config.json",
        JSON.stringify(availabilityConfig, null, 2)
      );

      await i.editReply({
        content: `Successfully selected **${selectedChannel.name}** for availability tracking!`,
        components: [],
      });
    }
  },
};
