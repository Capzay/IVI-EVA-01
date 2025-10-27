import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { readAvailabilityConfig } from "../util/readAvailabilityConfig";
import * as fs from "fs";
import { Availability } from "../types/availability";

export async function updateAvailabilityEmbed(
  client: Client,
  roleID: string,
  ping: boolean
) {
  const availabilityConfig = readAvailabilityConfig();
  for (const teamName in availabilityConfig) {
    if (availabilityConfig[teamName].roleID === roleID) {
      if (!availabilityConfig[teamName].embedMessageID) return;
      if (!availabilityConfig[teamName].availabilityChannel) return;
      if (!availabilityConfig[teamName].pingMessageID) return;

      const channel = (await client.channels.fetch(
        availabilityConfig[teamName].availabilityChannel
      )) as TextChannel;
      if (!channel || !channel.isTextBased()) return;
      const oldMessage = await channel.messages.fetch(
        availabilityConfig[teamName].embedMessageID
      );

      const availabilityData: Availability = JSON.parse(
        fs.readFileSync(`src/data/availability/${roleID}.json`, "utf-8")
      );

      let Monday_Text = "";
      let Tuesday_Text = "";
      let Wednesday_Text = "";
      let Thursday_Text = "";
      let Friday_Text = "";
      let Saturday_Text = "";
      let Sunday_Text = "";

      availabilityData.monday.map((userIDs) => {
        if (userIDs !== "") {
          Monday_Text += `<@${userIDs}>\n`;
        }
      });

      availabilityData.tuesday.map((userIDs) => {
        if (userIDs !== "") {
          Tuesday_Text += `<@${userIDs}>\n`;
        }
      });

      availabilityData.wednesday.map((userIDs) => {
        if (userIDs !== "") {
          Wednesday_Text += `<@${userIDs}>\n`;
        }
      });

      availabilityData.thursday.map((userIDs) => {
        if (userIDs !== "") {
          Thursday_Text += `<@${userIDs}>\n`;
        }
      });

      availabilityData.friday.map((userIDs) => {
        if (userIDs !== "") {
          Friday_Text += `<@${userIDs}>\n`;
        }
      });

      availabilityData.saturday.map((userIDs) => {
        if (userIDs !== "") {
          Saturday_Text += `<@${userIDs}>\n`;
        }
      });

      availabilityData.sunday.map((userIDs) => {
        if (userIDs !== "") {
          Sunday_Text += `<@${userIDs}>\n`;
        }
      });

      const oldEmbed = oldMessage.embeds[0];

      const newEmbed = new EmbedBuilder()
        .setTitle(oldEmbed.title)
        .setDescription(oldEmbed.description)
        .setColor("#00FF00");

      newEmbed.addFields(
        { name: "Monday", value: Monday_Text, inline: false },
        { name: "Tuesday", value: Tuesday_Text, inline: false },
        { name: "Wednesday", value: Wednesday_Text, inline: false },
        { name: "Thursday", value: Thursday_Text, inline: false },
        { name: "Friday", value: Friday_Text, inline: false },
        { name: "Saturday", value: Saturday_Text, inline: false },
        { name: "Sunday", value: Sunday_Text, inline: false }
      );
      await oldMessage.edit({ embeds: [newEmbed] });
      if (ping) {
        const messages = await channel.messages.fetch();

        const pingMessage = messages.find(
          (msg) =>
            client.user !== null &&
            msg.author.id === client.user.id &&
            msg.id === availabilityConfig[teamName].pingMessageID
        );
        await pingMessage?.delete();
        const guild = channel.guild;
        const role = guild.roles.cache.get(roleID);
        if (!role) return;
        const newPingMessage = await channel.send({
          content: `${role}`,
        });
        availabilityConfig[teamName].pingMessageID = newPingMessage.id;
        fs.writeFileSync(
          `src/data/availability-config.json`,
          JSON.stringify(availabilityConfig, null, 2)
        );
      }
    }
  }
}
