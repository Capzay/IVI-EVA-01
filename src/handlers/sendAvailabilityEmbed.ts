import { StringSelectMenuInteraction, TextChannel } from "discord.js";
import { AvailabilityButtons, AvailabilityEmbed } from "../embeds/Availability";

export async function sendAvailabilityEmbed(
  interaction: StringSelectMenuInteraction,
  channelID: string,
  roleID: string
) {
  const embed = AvailabilityEmbed();
  const buttons = AvailabilityButtons(roleID);

  const channel = interaction.client.channels.cache.get(
    channelID
  ) as TextChannel;
  if (!channel) return;

  const role = interaction.guild?.roles.cache.get(roleID);
  if (!role) return;

  const embedMessage = await channel.send({
    embeds: [embed],
    components: buttons,
  });
  const pingMessage = await channel.send({
    content: `${role} Please select your availability for the week.`,
  });

  return [embedMessage, pingMessage];
}
