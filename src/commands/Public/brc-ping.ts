import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  TextChannel,
  EmbedBuilder,
} from "discord.js";
import { readFileSync } from "fs";

const serverCooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping-brc")
    .setDescription("Pings 'Looking to Play - BRC`")
    .setDefaultMemberPermissions(0)
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Your message to ping 'Looking to Play - BRC'")
        .setRequired(true)
    ),

  async execute(
    interaction: ChatInputCommandInteraction,
    client: Client<true>
  ) {
    await interaction.deferReply({ ephemeral: true });

    const channel_to_be_used_in = "1343720230081400963"; // CHANNEL_ID: BRC ping command channel

    if (!interaction.channel) return;
    if (!interaction.guild) return;

    if (interaction.channel.id != channel_to_be_used_in) {
      return interaction.editReply({
        content: `Must be used in <#${channel_to_be_used_in}> `,
      });
    }
    const guildId = interaction.guild.id; // Get the server ID
    const cooldownTime = 30 * 60 * 1000; // 30 minutes in milliseconds

    // Check if the server is in cooldown
    if (serverCooldowns.has(guildId)) {
      const expirationTime = serverCooldowns.get(guildId) + cooldownTime;
      const remainingTime = (expirationTime - Date.now()) / 1000;

      if (Date.now() < expirationTime) {
        return interaction.editReply({
          content: `ivi Man doesn't like being pestered... Please wait for another **${Math.ceil(
            remainingTime / 60
          )} minutes** ⌛`,
        });
      }
    }

    // Add server to cooldown
    serverCooldowns.set(guildId, Date.now());

    // Remove cooldown after 30 minutes
    setTimeout(() => serverCooldowns.delete(guildId), cooldownTime);

    const message = interaction.options.getString("message");

    const roleName = "Looking to Play - BRC";

    const role = interaction.guild.roles.cache.find((r) => r.name === roleName);

    if (!role) {
      return interaction.editReply({
        content: `❌ Role **${roleName}** not found!`,
      });
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({}),
      })
      .setTitle(roleName)
      .setDescription(message)
      .setColor(0x9628a3)
      .setTimestamp();

    embed.setThumbnail(
      "https://cdn.discordapp.com/attachments/1337782204075343933/1341128422113411142/IVI_OD_LOGO.png?ex=67b4deac&is=67b38d2c&hm=f1b80a85a2998a6ad6307a3da020106f6dedf61211faea561705809b67e78bee&"
    );
    const channel = interaction.channel as TextChannel;
    await channel.send({ content: `${role}`, embeds: [embed] });

    return interaction.editReply({
      content: `Done!`,
    });
  },
};
