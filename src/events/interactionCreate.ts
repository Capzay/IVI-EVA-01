import { ButtonInteraction, Events, Interaction } from "discord.js";
import { CustomClient } from "../CustomClient"; // Import your extended client class
import { HandleError } from "../handlers/handleError";

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction, client: CustomClient) {
    if (interaction.isButton()) {
      const i = interaction as ButtonInteraction;
      // Handle button interaction here, and use the client if needed
    } else if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);

      if (!command || !command.autocomplete) return;

      try {
        await command.autocomplete(interaction);
      } catch (error) {
        console.error(error);
      }
      return;
    }
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        if (error instanceof Error) {
          await HandleError(error, client);

          return interaction.followUp({
            content: "An error occurred while processing your request.",
          });
        }
      } else {
        await interaction
          .reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          })
          .catch(() => {});
      }
    }
  },
};
