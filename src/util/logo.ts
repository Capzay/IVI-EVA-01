import { AttachmentBuilder, ThumbnailBuilder } from "discord.js";
import path from "path";

// Shared white ivi logo used as the top-right thumbnail accessory on embeds.
export const LOGO_ATTACHMENT_NAME = "ivi_Logo_White.png";

// The assets folder is copied into the image alongside the source (see Dockerfile
// `COPY . /app`) and the bot always runs from the project root, so process.cwd()
// resolves in both local dev and Docker.
const logoPath = path.join(process.cwd(), "assets", LOGO_ATTACHMENT_NAME);

// A thumbnail referencing the attached logo file. Add it to a SectionBuilder via
// `.setThumbnailAccessory(logoThumbnail())` to render the logo in the top-right.
export function logoThumbnail() {
  return new ThumbnailBuilder({
    media: { url: `attachment://${LOGO_ATTACHMENT_NAME}` },
  });
}

// The attachment that must accompany any message whose components reference the
// logo thumbnail. Create a fresh one per message send.
export function logoAttachment() {
  return new AttachmentBuilder(logoPath, { name: LOGO_ATTACHMENT_NAME });
}
