module.exports = {
    name: "say",
    aliases: ["speak", "echo"],
    description: "Make the bot say a message in the channel",
    category: "Utility",
    ownerOnly: true,
    run: async (client, message, args) => {
        // Check if the user has provided a message
        if (!args.length) {
            return message.reply("Please provide a message for me to say.");
        }

        // Delete the user's message
        await message.delete().catch(err => console.error("Failed to delete message:", err));

        // Join the arguments to form the message
        const sayMessage = args.join(" ");

        // Send the message in the channel
        await message.channel.send(sayMessage);
    }
};
