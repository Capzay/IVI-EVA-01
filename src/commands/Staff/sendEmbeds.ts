import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  TextChannel,
  MessageFlags,
} from "discord.js";
import { get } from "http";
import { getEnvVariable } from "../../util/getEnvVar";
import { ReactionRolesContainer } from "../../containers/ReactionRoles";
import { RulesContainer } from "../../containers/Rules";
import { ResourcesContainer } from "../../containers/Resources";
import { logoAttachment } from "../../util/logo";
import { bannerAttachment, BANNERS } from "../../util/banners";

async function clearChannel(channel: TextChannel) {
  let fetched;

  // Step 1: Bulk Delete Recent Messages (Ignores the 14-day limit by not using bulkDelete)
  do {
    fetched = await channel.messages.fetch({ limit: 100 });
    for (const message of fetched.values()) {
      await message.delete();
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Prevents rate limiting
    }
  } while (fetched.size > 0);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("send-embeds")
    .setDescription(
      "Resends the embeds for rules,resources, and reaction roles"
    )
    .setDefaultMemberPermissions(0),

  async execute(
    interaction: ChatInputCommandInteraction,
    client: Client<true>
  ) {
    await interaction.deferReply({ ephemeral: true });
    const reactionRolesChannel = client.channels.cache.get(
      getEnvVariable("REACTION_ROLES")
    ) as TextChannel;
    await clearChannel(reactionRolesChannel);
    const resourcesChannel = client.channels.cache.get(
      getEnvVariable("RESOURCES")
    ) as TextChannel;
    await clearChannel(resourcesChannel);
    const rulesChannel = client.channels.cache.get(
      getEnvVariable("RULES")
    ) as TextChannel;
    await clearChannel(rulesChannel);

    const rolesContainer = ReactionRolesContainer();
    if (!rolesContainer) return;
    await reactionRolesChannel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [rolesContainer],
      files: [logoAttachment(), bannerAttachment(BANNERS.roles)],
    });

    const rulesContainer = RulesContainer();
    await rulesChannel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [rulesContainer],
      files: [logoAttachment(), bannerAttachment(BANNERS.rules)],
    });

    const resourcesContainer = ResourcesContainer();
    await resourcesChannel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [resourcesContainer],
      files: [logoAttachment(), bannerAttachment(BANNERS.socials)],
    });

    return interaction.editReply("Done!");
  },
};
