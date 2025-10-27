import {
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ActionRowBuilder,
} from "discord.js";

export function AvailabilityEmbed() {
  const embed = new EmbedBuilder()
    .setTitle("Weekly Availability")
    .setColor("#9628a3")
    .setDescription("Select your availability status")
    .addFields(
      { name: "Monday", value: "No signups yet", inline: false },
      { name: "Tuesday", value: "No signups yet", inline: false },
      { name: "Wednesday", value: "No signups yet", inline: false },
      { name: "Thursday", value: "No signups yet", inline: false },
      { name: "Friday", value: "No signups yet", inline: false },
      { name: "Saturday", value: "No signups yet", inline: false },
      { name: "Sunday", value: "No signups yet", inline: false }
    )
    .setTimestamp();

  return embed;
}

export function AvailabilityButtons(roleID: string) {
  const buttons = [
    new ButtonBuilder()
      .setCustomId(`avail-monday-${roleID}`)
      .setLabel("Monday")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`avail-tuesday-${roleID}`)
      .setLabel("Tuesday")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`avail-wednesday-${roleID}`)
      .setLabel("Wednesday")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`avail-thursday-${roleID}`)
      .setLabel("Thursday")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`avail-friday-${roleID}`)
      .setLabel("Friday")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`avail-saturday-${roleID}`)
      .setLabel("Saturday")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`avail-sunday-${roleID}`)
      .setLabel("Sunday")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId(`avail-stop-${roleID}`)
      .setLabel("Stop using bot")
      .setStyle(ButtonStyle.Danger),
  ];
  const rows = [
    new ActionRowBuilder<ButtonBuilder>().addComponents(buttons.slice(0, 5)),
    new ActionRowBuilder<ButtonBuilder>().addComponents(buttons.slice(5)),
  ];

  return rows;
}
