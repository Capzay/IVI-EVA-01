import { Events, Message, TextChannel } from "discord.js";
import * as fs from "fs";

function getRandomXp(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function viewUserXp() {
  let scrimrawData = fs.readFileSync("src/data/levels.json");
  let scrimjsonData = JSON.parse(scrimrawData.toString());
  return scrimjsonData;
}

async function changeLevel(
  user: any,
  levels: any,
  message: Message,
  levelNum: number
) {
  user.level++;
  user.xp = 0;

  const guild = message.guild;
  if (!guild) return;

  const member = await guild.members.fetch(message.author.id);

  const currentLevelRoleId = message.guild.roles.cache.get(
    levels["roles"][`Level ${levelNum}`]
  );
  if (!currentLevelRoleId) return;

  await member.roles.add(currentLevelRoleId);

  // Loop through all level roles
  for (const roleName in levels.roles) {
    const roleId = levels.roles[roleName]; // Get role ID

    if (member.roles.cache.has(roleId) && roleId !== currentLevelRoleId.id) {
      let roleToRemove = message.guild.roles.cache.get(roleId);
      if (roleToRemove) {
        await member.roles.remove(roleToRemove);
        console.log(`Removed role: ${roleToRemove.name}`);
      }
    }
  }
  for (const roleName in levels.roles) {
    const roleId = levels.roles[roleName]; // Get role ID
    if (member.roles.cache.has(roleId)) {
      if (message.channel instanceof TextChannel) {
        message.channel.send(
          `${message.member} ivi Man has noticed your loyalty... Here's a promotion for your service! <:ivilogo:1314905850292342784>` // EMOJI_ID: ivi logo custom emoji
        );
      }
    }
  }
}

module.exports = {
  name: Events.MessageCreate,
  execute(message: Message) {
    if (!message.inGuild || message.author.bot) return;

    const xpToGive = getRandomXp(1, 2);
    const levels = viewUserXp();

    if (!levels[message.author.id]) {
      levels[message.author.id] = {
        xp: 0,
        level: 0,
      };
      console.log(`${message.author.id} is not in the levels`);

      fs.writeFileSync("src/data/levels.json", JSON.stringify(levels, null, 2));
    } else {
      if (levels[message.author.id].level == 5) {
        return;
      }
      levels[message.author.id].xp += xpToGive;
      const user = levels[message.author.id];

      switch (true) {
        case user.xp >= 100 && user.level == 0:
          changeLevel(user, levels, message, 1);
          break;
        case user.xp >= 250 && user.level == 1:
          changeLevel(user, levels, message, 2);
          break;
        case user.xp >= 400 && user.level == 2:
          changeLevel(user, levels, message, 3);
          break;
        case user.xp >= 750 && user.level == 3:
          changeLevel(user, levels, message, 4);
          break;
        case user.xp >= 1000 && user.level == 4:
          changeLevel(user, levels, message, 5);
          break;
      }

      fs.writeFileSync("src/data/levels.json", JSON.stringify(levels, null, 2));
    }
  },
};
