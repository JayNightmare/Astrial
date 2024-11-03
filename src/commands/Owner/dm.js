module.exports = {
    name: "dm",
    aliases: ["directmessage", "message"],
    description: "Send a direct message to a user",
    category: "Utility",
    ownerOnly: true,

    run: async (client, message, args) => {
        // Check if the user has mentioned someone and provided a message
        const user = message.mentions.users.first();
        if (!user || !args.slice(1).length) {
            return message.reply("Please mention a user and provide a message.");
        }

        // Delete the user's message
        await message.delete().catch(err => console.error("Failed to delete message:", err));

        // Join the arguments to form the DM message
        const dmMessage = args.slice(1).join(" ");

        // Send the DM
        try {
            await user.send(dmMessage);
            message.channel.send(`Message sent to ${user.tag}`);
        } catch (error) {
            console.error("Could not send DM:", error);
            message.channel.send(`Failed to send DM to ${user.tag}.`);
        }
    }
};
