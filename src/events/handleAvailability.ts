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
import * as fs from "fs";
import { updateAvailabilityEmbed } from "../handlers/updateAvailabilityEmbed";
import { readAvailabilityConfig } from "../util/readAvailabilityConfig";
import { Availability } from "../types/availability";

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction, client: Client<true>) {
    try {
      if (interaction.isButton()) {
        const i = interaction as ButtonInteraction;
        if (interaction.customId.startsWith("avail")) {
          if (!i.deferred) await i.deferReply({ ephemeral: true });
          const [_, day, roleID] = interaction.customId.split("-");
          if (day !== "stop") {
            const availabilityData: Availability = JSON.parse(
              fs.readFileSync(`src/data/availability/${roleID}.json`, "utf-8")
            );
            let Monday: string[] = availabilityData.monday;
            let Tuesday: string[] = availabilityData.tuesday;
            let Wednesday: string[] = availabilityData.wednesday;
            let Thursday: string[] = availabilityData.thursday;
            let Friday: string[] = availabilityData.friday;
            let Saturday: string[] = availabilityData.saturday;
            let Sunday: string[] = availabilityData.sunday;

            const daysMap: Record<string, string[]> = {
              monday: Monday,
              tuesday: Tuesday,
              wednesday: Wednesday,
              thursday: Thursday,
              friday: Friday,
              saturday: Saturday,
              sunday: Sunday,
            };

            if (daysMap[day]) {
              let dayArr = daysMap[day];
              if (dayArr.includes(i.user.id)) {
                dayArr = dayArr.filter((id) => id !== i.user.id);
              } else {
                dayArr.push(i.user.id);
              }
              dayArr = dayArr.filter((id) => id !== "");
              daysMap[day] = dayArr;
              (availabilityData as any)[day] = dayArr;
            }

            ({
              monday: Monday,
              tuesday: Tuesday,
              wednesday: Wednesday,
              thursday: Thursday,
              friday: Friday,
              saturday: Saturday,
              sunday: Sunday,
            } = daysMap);

            fs.writeFileSync(
              `src/data/availability/${roleID}.json`,
              JSON.stringify(availabilityData, null, 2)
            );

            await updateAvailabilityEmbed(client, roleID, false);
            return i.editReply({
              content: "Availability updated!",
              embeds: [],
            });
          }
          if (day === "stop") {
            const availabilityConfig = readAvailabilityConfig();
            for (const teamName in availabilityConfig) {
              if (availabilityConfig[teamName].captainID === i.user.id) {
                if (!availabilityConfig[teamName].availabilityChannel) return;
                if (!availabilityConfig[teamName].embedMessageID) return;
                if (!availabilityConfig[teamName].pingMessageID) return;
                const channel = client.channels.cache.get(
                  availabilityConfig[teamName].availabilityChannel
                ) as TextChannel;

                if (!channel) {
                  return i.editReply({
                    content: "Could not find the team's channel.",
                  });
                }
                const messages = await channel.messages.fetch();
                const availabilityMessage = messages.find(
                  (msg) =>
                    msg.author.id === client.user.id &&
                    msg.id === availabilityConfig[teamName].embedMessageID
                );
                const pingMessage = messages.find(
                  (msg) =>
                    msg.author.id === client.user.id &&
                    msg.id === availabilityConfig[teamName].pingMessageID
                );
                if (availabilityMessage) {
                  await availabilityMessage.delete();
                }
                if (pingMessage) {
                  await pingMessage.delete();
                }
                fs.unlinkSync(`src/data/availability/${roleID}.json`);
                delete availabilityConfig[teamName];
                fs.writeFileSync(
                  "src/data/availability-config.json",
                  JSON.stringify(availabilityConfig, null, 2)
                );
                i.editReply({
                  content: "Done!",
                });
              } else {
                i.editReply({
                  content: "You are not the captain of this team.",
                });
              }
            }
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
