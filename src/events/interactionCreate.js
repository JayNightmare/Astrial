module.exports = async (client) => {
    client.on("interactionCreate", async (interaction) => {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            // Check if the command has a cooldown
            if (command.cooldown) {
                const now = Date.now();
                const timestamps =
                    client.cooldowns.get(interaction.commandName) || new Map();
                const cooldownAmount = (command.cooldown || 0) * 1000;

                if (timestamps.has(interaction.user.id)) {
                    const expirationTime =
                        timestamps.get(interaction.user.id) + cooldownAmount;

                    if (now < expirationTime) {
                        const timeLeft = (
                            (expirationTime - now) /
                            1000
                        ).toFixed(1);
                        return interaction.reply({
                            content: `Please wait ${timeLeft} more second(s) before reusing the \`${interaction.commandName}\` command.`,
                            ephemeral: true,
                        });
                    }
                }

                timestamps.set(interaction.user.id, now);
                client.cooldowns.set(interaction.commandName, timestamps);
                setTimeout(
                    () => timestamps.delete(interaction.user.id),
                    cooldownAmount
                );
            }

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: "There was an error executing this command!",
                    ephemeral: true,
                });
            }
        } else if (interaction.isButton()) {
            // Handle button interactions (if needed)
            console.log(`Button interaction: ${interaction.customId}`);
        } else if (interaction.isSelectMenu()) {
            // Handle select menu interactions (if needed)
            console.log(`Select menu interaction: ${interaction.customId}`);
        } else if (interaction.isModalSubmit()) {
            // Handle modal submissions (if needed)
            console.log(`Modal submit interaction: ${interaction.customId}`);
        }
    });
};
