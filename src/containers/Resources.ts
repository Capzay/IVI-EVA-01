import {
  ContainerBuilder,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
} from "discord.js";
import { logoThumbnail } from "../util/logo";
import { bannerGallery, BANNERS } from "../util/banners";

export function ResourcesContainer() {
  const container = new ContainerBuilder();

  const banner = bannerGallery(BANNERS.socials);

  const socials = new SectionBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent("**FOLLOW OUR SOCIALS**"),
      new TextDisplayBuilder().setContent(
        `- TikTok: https://www.tiktok.com/@ivivresports\n\n- YouTube: https://www.youtube.com/@ivivr\n\n- X: https://x.com/ivi_team\n\n- Website: *soon...*`
      )
    )
    .setThumbnailAccessory(logoThumbnail());

  const largeSeparator = new SeparatorBuilder({
    spacing: SeparatorSpacingSize.Large,
  });

  container.addMediaGalleryComponents(banner);
  container.addSeparatorComponents(largeSeparator);
  container.addSectionComponents(socials);

  return container;
}
