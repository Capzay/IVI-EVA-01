import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  SectionBuilder,
  ContainerBuilder,
  MediaGalleryBuilder,
  Client,
} from "discord.js";

const gameRoles = [
  {
    id: "1343578200487366666",
    label: "Looking to Play - OD",
  },
  {
    id: "1343578300135772200",
    label: "Looking to Play - BRC",
  },
  {
    id: "1343578328979869706",
    label: "Looking to Play - BS",
  },
  {
    id: "1343578330644877374",
    label: "Looking to Play - GTAG",
  },
];

const mediaRoles = [
  {
    id: "1343715989476610081",
    label: "Live Ping",
  },
  {
    id: "1343716033730580591",
    label: "ivi Media Ping",
  },
];

export function ReactionRolesContainer() {
  const container = new ContainerBuilder();
  const rolesHeader = new MediaGalleryBuilder().addItems([
    {
      media: {
        url: "https://cdn.discordapp.com/attachments/1337783285971161109/1341182593646858332/ivi_rules_graphic_small.png?ex=67b51120&is=67b3bfa0&hm=8cfd9eefad49aafcc00899d2cddff457b4a11f965c92e408dff3525f8f05aad8&",
      },
    },
  ]);
  const rolesText = new TextDisplayBuilder().setContent(
    `# ivi Ping-to-Play Roles!\nClick the Looking to Play buttons below to receive the roles you want! 🎊\n\nPlease keep in mind these roles are pinged using the command below, and you can only use them inside their respective category...\n\n## For example\nthe Looking to Play - OD role can only be pinged with the correct command inside the '// Orion Drift Public' category! 👀\n\n# Commands 🤖:\n- /ping-od pings 'Looking to Play - OD' + <Message>\n- /ping-brc pings 'Looking to Play - BRC' + <Message>\n- /ping-bs pings 'Looking to Play - BS' + <Message> + <Modded> + <Game Ver>\n- /ping-gtag pings 'Looking to Play - GTAG' + <Message>\n\n## Use Info ℹ️:\n- <Message> typically code/server/gamemode etc\n- <Modded> is whether the game is modded or not\n- <Game Ver> is the version of the game being played\n\n## Games 🎮:`
  );
  const ODText = new TextDisplayBuilder().setContent("- OD = Orion Drift");
  const BRCText = new TextDisplayBuilder().setContent("- BRC = Breachers");
  const BSText = new TextDisplayBuilder().setContent("- BS = Beat Saber");
  const GTAGText = new TextDisplayBuilder().setContent("- GTAG = Gorilla Tag");
  const pingInfo = new TextDisplayBuilder().setContent(
    `-# There is a 30 minute cool-down after every use of a command by ANYONE! No spam pinging here...`
  );

  const ODRole = gameRoles.find((role) => role.label.includes("OD"));
  const ODId = ODRole?.id;
  const ODLabel = ODRole?.label;
  if (!ODId || !ODLabel) return;
  const ODButton = new ButtonBuilder()
    .setCustomId(`${ODId}-react`)
    .setLabel(ODLabel)
    .setStyle(ButtonStyle.Success);

  const BRCRole = gameRoles.find((role) => role.label.includes("BRC"));
  const BRCId = BRCRole?.id;
  const BRCLabel = BRCRole?.label;
  if (!BRCId || !BRCLabel) return;
  const BRCButton = new ButtonBuilder()
    .setCustomId(`${BRCId}-react`)
    .setLabel(BRCLabel)
    .setStyle(ButtonStyle.Success);

  const BSRole = gameRoles.find((role) => role.label.includes("BS"));
  const BSId = BSRole?.id;
  const BSLabel = BSRole?.label;
  if (!BSId || !BSLabel) return;
  const BSButton = new ButtonBuilder()
    .setCustomId(`${BSId}-react`)
    .setLabel(BSLabel)
    .setStyle(ButtonStyle.Success);

  const GTAGRole = gameRoles.find((role) => role.label.includes("GTAG"));
  const GTAGId = GTAGRole?.id;
  const GTAGLabel = GTAGRole?.label;
  if (!GTAGId || !GTAGLabel) return;
  const GTAGButton = new ButtonBuilder()
    .setCustomId(`${GTAGId}-react`)
    .setLabel(GTAGLabel)
    .setStyle(ButtonStyle.Success);

  const ODSection = new SectionBuilder()
    .addTextDisplayComponents(ODText)
    .setButtonAccessory(ODButton);
  const BRCSection = new SectionBuilder()
    .addTextDisplayComponents(BRCText)
    .setButtonAccessory(BRCButton);
  const BSSection = new SectionBuilder()
    .addTextDisplayComponents(BSText)
    .setButtonAccessory(BSButton);
  const GTAGSection = new SectionBuilder()
    .addTextDisplayComponents(GTAGText)
    .setButtonAccessory(GTAGButton);

  const separator = new SeparatorBuilder({
    spacing: SeparatorSpacingSize.Large,
  });

  const contentText = new TextDisplayBuilder().setContent(
    `# ivi Content Roles!\nClick the Media buttons below to receive pings about ivi Content! 🎉\n## Role Info 📡:`
  );
  const liveText = new TextDisplayBuilder().setContent(
    `- 'Live Ping' - get notified when ivi are playing a Live League game!`
  );
  const mediaText = new TextDisplayBuilder().setContent(
    `- 'ivi Media Ping' - get notified when an ivi member uploads some new content!`
  );
  const reactInfo = new TextDisplayBuilder().setContent(
    `-# You can remove this role at any time by pressing on the button you clicked again! 👀`
  );

  const liveRole = mediaRoles.find((role) => role.label.includes("Live"));
  const liveId = liveRole?.id;
  const liveLabel = liveRole?.label;
  if (!liveId || !liveLabel) return;
  const liveButton = new ButtonBuilder()
    .setCustomId(`${liveId}-react`)
    .setLabel(liveLabel)
    .setStyle(ButtonStyle.Success);

  const mediaRole = mediaRoles.find((role) => role.label.includes("Media"));
  const mediaId = mediaRole?.id;
  const mediaLabel = mediaRole?.label;
  if (!mediaId || !mediaLabel) return;
  const mediaButton = new ButtonBuilder()
    .setCustomId(`${mediaId}-react`)
    .setLabel(mediaLabel)
    .setStyle(ButtonStyle.Success);

  const liveSection = new SectionBuilder()
    .addTextDisplayComponents(liveText)
    .setButtonAccessory(liveButton);
  const mediaSection = new SectionBuilder()
    .addTextDisplayComponents(mediaText)
    .setButtonAccessory(mediaButton);

  container.addMediaGalleryComponents(rolesHeader);
  container.addTextDisplayComponents(rolesText);
  container.addSectionComponents(ODSection);
  container.addSectionComponents(BRCSection);
  container.addSectionComponents(BSSection);
  container.addSectionComponents(GTAGSection);
  container.addTextDisplayComponents(pingInfo);
  container.addSeparatorComponents(separator);
  container.addTextDisplayComponents(contentText);
  container.addSectionComponents(liveSection);
  container.addSectionComponents(mediaSection);
  container.addTextDisplayComponents(reactInfo);

  return container;
}
