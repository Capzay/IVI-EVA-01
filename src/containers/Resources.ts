import {
  ContainerBuilder,
  EmbedBuilder,
  MediaGalleryBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
} from "discord.js";

export function ResourcesContainer() {
  const container = new ContainerBuilder();
  const socialMediaHeader = new MediaGalleryBuilder({
    items: [
      {
        media: {
          url: "https://media.discordapp.net/attachments/1337671912314376205/1339005963767648266/ivi_social_media_graphic_small.png?ex=689b1cbb&is=6899cb3b&hm=ca8a110f04cd9460fa4bc81556935047b6f1c6835d44d30729500d0651dec6c9&=&format=webp&quality=lossless",
        },
      },
    ],
  });
  const socialMediaText = new TextDisplayBuilder().setContent(
    `X (Formerly Twitter): https://x.com/ivi_team\n\nYoutube: https://www.youtube.com/@ivivr\n\nInstagram: https://www.instagram.com/iviteamvr/>`
  );

  const resourcesHeader = new MediaGalleryBuilder({
    items: [
      {
        media: {
          url: "https://cdn.discordapp.com/attachments/1337671912314376205/1339006135499493407/ivi_resources_graphic_small.png?ex=689b1ce4&is=6899cb64&hm=a4a6599c806c126175941df7d313eb6679fa220e65455456598f7d08e4bf46de&=&format=webp&quality=lossless",
        },
      },
    ],
  });
  const resourcesText = new TextDisplayBuilder().setContent(
    `Website: **Coming Soon...** 👀`
  );

  const largeSeparator = new SeparatorBuilder({
    spacing: SeparatorSpacingSize.Large,
  });

  container.addMediaGalleryComponents(socialMediaHeader);
  container.addSeparatorComponents(largeSeparator);
  container.addTextDisplayComponents(socialMediaText);
  container.addSeparatorComponents(largeSeparator);
  container.addMediaGalleryComponents(resourcesHeader);
  container.addSeparatorComponents(largeSeparator);
  container.addTextDisplayComponents(resourcesText);

  return container;
}
