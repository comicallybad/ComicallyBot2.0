const { del } = require("../../functions.js");

module.exports = {
    name: "shuffle",
    aliases: ["shuf", "shuff"],
    category: "music",
    description: "Shuffles the music queue.",
    permissions: "member",
    run: (client, message, args) => {
        const player = client.music.players.get(message.guild.id);
        if (!player || !player.queue.current)
            return message.reply("No song currently playing in this guild").then(m => del(m, 7500));

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel || voiceChannel.id !== player.voiceChannel)
            return message.reply("You need to be in the voice channel to play music.").then(m => del(m, 7500));

        player.queue.shuffle();
        return message.reply("The queue has been shuffled").then(m => del(m, 7500));
    }
}