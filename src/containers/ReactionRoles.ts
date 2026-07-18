import {
  ButtonStyle,
  ButtonBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  SectionBuilder,
  ContainerBuilder,
} from "discord.js";
import { logoThumbnail } from "../util/logo";
import { bannerGallery, BANNERS } from "../util/banners";

// -----------------------------------------------------------------------------
// TODO: Fill in the real role IDs (and optional emojis) for the community roles.
// The Live Ping / ivi Media Ping IDs are carried over from the previous embed.
// Buttons toggle the role on click (see events/reactionRoles.ts).
//
// `emoji` is optional: use a unicode emoji ("🔴") or a custom emoji in the form
// "<:name:id>" / "<a:name:id>". Leave it undefined to render a label-only button.
// -----------------------------------------------------------------------------
type RoleButton = {
  id: string;
  label: string;
  emoji?: string;
};

const communityRoles: RoleButton[] = [
  {
    id: "1343578200487366666", // ROLE_ID: Orion Drift community role
    label: "Orion Drift",
    emoji: "<:OrionDriftLogo:1524841180800749608>",
  },
  {
    id: "1524839175302414527", // ROLE_ID: VAIL community role
    label: "VAIL",
    emoji: "<:VAIL_Logo:1524841385721856121>",
  },
  {
    id: "1524841880796397669", // ROLE_ID: UNDERDOGS community role
    label: "UNDERDOGS",
    emoji: "<:UnderdogsLogo:1524841827654439072>",
  },
];

const pingRoles: RoleButton[] = [
  {
    id: "1343715989476610081", // ROLE_ID: Live Ping role
    label: "Live Ping",
    emoji: "🔴", // Red Circle
  },
  {
    id: "1343716033730580591", // ROLE_ID: ivi Media Ping role
    label: "ivi Media Ping",
    emoji: "<:iviWhite:1317978667296755854>",
  },
  { id: "Event Ping", label: "1527173970275729439", emoji: "🎉" },
];

function roleSection(role: RoleButton) {
  const button = new ButtonBuilder()
    .setCustomId(`${role.id}-react`)
    .setLabel(role.label)
    .setStyle(ButtonStyle.Success);
  if (role.emoji) button.setEmoji(role.emoji);

  return new SectionBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`- ${role.label}`),
    )
    .setButtonAccessory(button);
}

export function ReactionRolesContainer() {
  const container = new ContainerBuilder();

  const banner = bannerGallery(BANNERS.roles);

  const header = new SectionBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent("**COLLECT YOUR ROLES**"),
      new TextDisplayBuilder().setContent(
        "If you want to claim a role for a different community, or change what you get pinged for, click the corresponding buttons below.",
      ),
    )
    .setThumbnailAccessory(logoThumbnail());

  const communityHeader = new TextDisplayBuilder().setContent(
    "## Community Roles",
  );
  const pingHeader = new TextDisplayBuilder().setContent("## Ping Roles");

  const footer = new TextDisplayBuilder().setContent(
    "-# If you already have a role and you want to remove it, click the button anyway, it'll take it away.",
  );

  const separator = new SeparatorBuilder({
    spacing: SeparatorSpacingSize.Large,
  });

  container.addMediaGalleryComponents(banner);
  container.addSectionComponents(header);
  container.addSeparatorComponents(separator);
  container.addTextDisplayComponents(communityHeader);
  for (const role of communityRoles) {
    container.addSectionComponents(roleSection(role));
  }
  container.addSeparatorComponents(separator);
  container.addTextDisplayComponents(pingHeader);
  for (const role of pingRoles) {
    container.addSectionComponents(roleSection(role));
  }
  container.addTextDisplayComponents(footer);

  return container;
}
