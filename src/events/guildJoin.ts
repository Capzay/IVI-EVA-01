import { Events, Guild } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();
module.exports = {
	name: Events.GuildCreate,
	once: true,
	execute(guild: Guild) {
		// I use this to leave random servers that it might get added to:
		const GUILD_ID = process.env.GUILD_ID;

		if (
			guild.id !== GUILD_ID
		) {
			console.log(`Left ${guild.name}`);
			guild.leave();
		}
	}
};
