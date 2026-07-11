import {
  ContainerBuilder,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
} from "discord.js";
import { logoThumbnail } from "../util/logo";
import { bannerGallery, BANNERS } from "../util/banners";
import { RosterCategory, RosterData } from "../types/roster";

// White ivi logo emoji rendered inline in each category header.
const IVI_WHITE_EMOJI = "<:iviWhite:1317978667296755854>";

function renderCategory(category: RosterCategory): string {
  const lines: string[] = [`# ${category.name} ${IVI_WHITE_EMOJI} #`];
  for (const team of category.teams) {
    lines.push("");
    lines.push(`[${team.emoji}] **${team.name}**`);
    for (const player of team.players) {
      lines.push(`- ${player}`);
    }
  }
  return lines.join("\n");
}

export function RostersContainer(data: RosterData) {
  const container = new ContainerBuilder();
  const separator = new SeparatorBuilder({
    spacing: SeparatorSpacingSize.Large,
  });

  container.addMediaGalleryComponents(bannerGallery(BANNERS.rosters));

  data.categories.forEach((category, index) => {
    const text = new TextDisplayBuilder().setContent(renderCategory(category));
    if (index === 0) {
      // Logo sits top-right on the first category block, matching the other embeds.
      container.addSectionComponents(
        new SectionBuilder()
          .addTextDisplayComponents(text)
          .setThumbnailAccessory(logoThumbnail())
      );
    } else {
      container.addSeparatorComponents(separator);
      container.addTextDisplayComponents(text);
    }
  });

  if (data.footer) {
    container.addSeparatorComponents(separator);
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`-# ${data.footer}`)
    );
  }

  return container;
}
