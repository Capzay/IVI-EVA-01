import fs from "node:fs";
import path from "node:path";
import {
  Client as DiscordClient,
  Partials,
  Collection,
  IntentsBitField,
} from "discord.js";
import { deployCommands } from "./deploy";
import dotenv from "dotenv";
import { getEnvVariable } from "./util/getEnvVar";

dotenv.config();

const token = getEnvVariable("TOKEN");

// Extend the DiscordClient with a commands property
interface IClient extends DiscordClient {
  commands?: Collection<string, any>;
}

// Create the client instance with the required intents
const client: IClient = new DiscordClient({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
  ],
  partials: [Partials.Channel],
});

// Initialize the commands collection
client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

// Registering Commands
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or  "execute" property.`
      );
    }
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

// Registering Events
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args: any) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args: any) => event.execute(...args, client));
  }
}

// Deploying Commands & Logging In
async function init() {
  try {
    await deployCommands();
  } catch (error) {
    console.log("Error deploying commands:", error);
  }
  await client.login(token);
}

init();

export { client };
