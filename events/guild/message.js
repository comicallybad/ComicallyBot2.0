const { del, getCommandStatus, hasPermissions } = require("../../functions.js");
const { messageXP } = require("../../dbFunctions.js");
let cooldown = new Set();
let cdseconds = 5;

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.member) return;

    if (!cooldown.has(message.author.id))
        messageXP(message, client);

    cooldown.add(message.author.id);

    setTimeout(() => {
        cooldown.delete(message.author.id);
    }, cdseconds * 1000);

    if (!message.content.startsWith(prefix) && !message.content.replace(/\D/g, '').startsWith(`${client.user.id}`)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message).catch(err => err);

    const args = message.content.startsWith(prefix) ? message.content.slice(prefix.length).trim().split(/ +/g) : message.content.replace(/[^\s]*/, '').trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) {
        const channelPermissions = message.channel.permissionsFor(message.guild.me);

        if (!channelPermissions.has("SEND_MESSAGES"))
            return message.author.send("I am missing permissions to `SEND_MESSAGES`").then(m => del(m, 60000)).catch(err => err);

        if (!channelPermissions.has("MANAGE_MESSAGES") || !channelPermissions.has("ADD_REACTIONS"))
            return message.reply("I am missing permissions to `MANAGE_MESSAGES` for a clean command experience"
                + " and/or permissions for `ADD_REACTIONS` for essential commands.").then(m => del(m, 30000));

        del(message, 0);

        if (command.category !== 'command') {
            getCommandStatus(message, command.name).then(function (res) {
                if (!res) message.reply("Command disabled").then(m => del(m, 7500));
                if (res) hasPermissions(message, command.permissions).then(async function (res) {
                    if (!res) message.reply("You do not have permissions for this command.").then(m => del(m, 7500));
                    if (res) command.run(client, message, args);
                });
            });
        } else {
            hasPermissions(message, command.permissions).then(async function (res) {
                if (!res) message.reply("You do not have permissions for this command.").then(m => del(m, 7500));
                if (res) command.run(client, message, args);
            });
        }
    }
}