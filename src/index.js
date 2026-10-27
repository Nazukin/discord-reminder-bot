import {Client, IntentsBitField} from 'discord.js';
import 'dotenv/config'

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
    ]
})

client.on('clientReady',(bot) => {
    console.log(`${bot.user.tag} is online`)
})

client.login(process.env.DISCORD_TOKEN);