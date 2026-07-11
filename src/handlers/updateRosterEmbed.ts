import { Client, MessageFlags, TextChannel } from "discord.js";
import { readRoster, writeRoster } from "../util/roster";
import { RostersContainer } from "../containers/Rosters";
import { logoAttachment } from "../util/logo";
import { bannerAttachment, BANNERS } from "../util/banners";
import { getEnvVariable } from "../util/getEnvVar";

// Rebuilds the rosters embed from roster.json and (re)posts it to the rosters
// channel. The previous message is deleted and a fresh one sent — simplest and
// most robust for a channel dedicated to this single embed. The new message id
// is persisted so the next update can find it.
export async function updateRosterEmbed(client: Client) {
  const data = readRoster();

  const channelId = data.channelId ?? getEnvVariable("ROSTERS");
  const channel = (await client.channels.fetch(channelId)) as TextChannel | null;
  if (!channel || !channel.isTextBased()) return;

  if (data.messageId) {
    try {
      const old = await channel.messages.fetch(data.messageId);
      await old.delete();
    } catch {
      // Already gone — nothing to clean up.
    }
  }

  const message = await channel.send({
    flags: MessageFlags.IsComponentsV2,
    components: [RostersContainer(data)],
    files: [logoAttachment(), bannerAttachment(BANNERS.rosters)],
  });

  data.channelId = channel.id;
  data.messageId = message.id;
  writeRoster(data);
}
