import {
  ContainerBuilder,
  EmbedBuilder,
  MediaGalleryBuilder,
  TextDisplayBuilder,
} from "discord.js";

export function RulesContainer() {
  const container = new ContainerBuilder();

  const rulesHeader = new MediaGalleryBuilder({
    items: [
      {
        media: {
          url: "https://media.discordapp.net/attachments/1337671912314376205/1341191771425734757/ivi_rules_graphic_small_1.png?ex=689b276c&is=6899d5ec&hm=be39e3a18bc0387c05d8ab8ec14f19551d35f85b28da2f4364020d849a66039c&=&format=webp&quality=lossless",
        },
      },
    ],
  });

  const rulesText = new TextDisplayBuilder().setContent(
    "## Rule 1\nThis is an English speaking community that does not permit discrimination or prejudice of any kind.\n## Rule 2\nNo spamming or flooding chat with messages.\n## Rule 3\nRacism, sexism, ageism, or any discriminative comments are a bannable offense.\n## Rule 4\nNo excessive cursing - yet if you are below the age of 18 be aware that you will see examples of bad language.\n## Rule 5\nNo inappropriate or offensive names and do not use other people's identities as your own."
  );

  const rulesFooter = new MediaGalleryBuilder({
    items: [
      {
        media: {
          url: "https://cdn.discordapp.com/attachments/1337671912314376205/1339943735525638214/Discord_Rules_Graphic_v2.png?ex=689a9199&is=68994019&hm=00ce4134f58fbc6f74792c270e00b13ca8fe4b2a6376c8daff5f0da77c1dbe2a&",
        },
      },
    ],
  });

  container.addMediaGalleryComponents(rulesHeader);
  container.addTextDisplayComponents(rulesText);
  container.addMediaGalleryComponents(rulesFooter);

  return container;
}
