import { EmbedBuilder } from "discord.js";

export function ErrorEmbed(
  ErrorName: string,
  ErrorDescription: string,
  Stack: string
) {
  return new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle(ErrorName)
    .setDescription(`**Bot Encountered an Error**`)
    .addFields(
      { name: "Stack", value: Stack },
      { name: "Description", value: ErrorDescription }
    )
    .setTimestamp();
}
