import {
  ButtonBuilder,
  ContainerBuilder,
  SectionBuilder,
} from "@discordjs/builders";
import { ButtonStyle, TextDisplayBuilder } from "discord.js";

export function AvailabilityContainer() {
  const text = new TextDisplayBuilder().setContent(
    `# Weekly Team Availability\nIf you wish to have the bot have a weekly availability check, click the availability button.`
  );
  const availabilityButton = new ButtonBuilder()
    .setCustomId("setup-availability")
    .setStyle(ButtonStyle.Primary)
    .setLabel("Availability");
  const section = new SectionBuilder()
    .addTextDisplayComponents(text)
    .setButtonAccessory(availabilityButton);

  const container = new ContainerBuilder();
  container.addSectionComponents(section);
  return container;
}
