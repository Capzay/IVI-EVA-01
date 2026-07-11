import {
  ContainerBuilder,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
} from "discord.js";
import { logoThumbnail } from "../util/logo";
import { bannerGallery, BANNERS } from "../util/banners";

export function RulesContainer() {
  const container = new ContainerBuilder();

  const banner = bannerGallery(BANNERS.rules);

  const header = new SectionBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        "**PLEASE TAKE THE TIME TO READ AND FOLLOW THE SERVER RULES**"
      )
    )
    .setThumbnailAccessory(logoThumbnail());

  const rulesText = new TextDisplayBuilder().setContent(
    [
      "**No slurs or discrimination of any kind.**",
      "╰ Keep conversations respectful and slur-free. Hate speech, discrimination, and explicit content are not tolerated.",
      "",
      "**No threats or hate speech to other members of the server or anyone else.**",
      "╰ Keep conversations respectful and slur-free. Hate speech, discrimination, and explicit content are not tolerated.",
      "",
      "**No distributing cheats or mods.**",
      "╰ No cheating, piracy, promotion of cheats, or organized player harassment.",
      "",
      "**Golden rule - be respectful.**",
      "╰ We are all responsible for creating and contributing to a positive community, be kind, understanding, and strive to better the server.",
      "",
      "**Follow the Discord TOS.**",
      "╰ Adhere to Discord’s rules as well as our own: https://discord.com/terms",
      "",
      "**No racism or discrimination based on country or beliefs.**",
      "╰ Do not engage in bullying, intimidation, or personal attacks, including targeting users based on race, gender, disability, nationality, religion, age, or any other characteristic.",
      "",
      "**Ping moderators for rule breakers. Don't take it into your own hands.**",
      "╰ Report users by pinging a moderator or a member of staff, do not take it upon yourself to try and resolve the situation.",
      "",
      "**Have fun!**",
      "╰ Enjoy your stay, and welcome to the ivi Society.",
    ].join("\n")
  );

  const separator = new SeparatorBuilder({
    spacing: SeparatorSpacingSize.Large,
  });

  container.addMediaGalleryComponents(banner);
  container.addSectionComponents(header);
  container.addSeparatorComponents(separator);
  container.addTextDisplayComponents(rulesText);

  return container;
}
