import { AttachmentBuilder, MediaGalleryBuilder } from "discord.js";
import path from "path";

// Full-width banner graphics uploaded from the local assets folder (see
// Dockerfile `COPY . /app`; the bot runs from the project root so process.cwd()
// resolves in both local dev and Docker).
const assetsDir = path.join(process.cwd(), "assets");

// File names of the banner assets, keyed by embed.
export const BANNERS = {
  socials: "socials-banner.png",
  roles: "roles-banner.png",
  rules: "rules-banner.png",
  rosters: "rosters-banner.png",
} as const;

// A full-width media gallery referencing an attached banner file. Add it to a
// ContainerBuilder via `.addMediaGalleryComponents(bannerGallery(BANNERS.x))`.
export function bannerGallery(fileName: string) {
  return new MediaGalleryBuilder({
    items: [{ media: { url: `attachment://${fileName}` } }],
  });
}

// The attachment that must accompany any message whose components reference the
// banner. Create a fresh one per message send.
export function bannerAttachment(fileName: string) {
  return new AttachmentBuilder(path.join(assetsDir, fileName), {
    name: fileName,
  });
}
