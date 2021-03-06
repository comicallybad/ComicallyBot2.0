const { del } = require("../../functions.js");

module.exports = {
    name: "suicidehotline",
    aliases: ["suicide", "helphotline", "helpline", "mentalsupport"],
    category: "helpful",
    description: "Sends a link to a list of suicide hotline numbers.",
    permissions: "member",
    run: (client, message, args) => {
        message.channel.send("http://www.suicide.org/international-suicide-hotlines.html").then(m => del(m, 30000));
        return message.reply("Thank you for taking this step, these people are professional and are here to help. Don't be afraid, it's a good thing you are considering reaching out.").then(m => del(m, 15000));
    }
}