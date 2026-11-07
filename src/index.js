import fs from 'node:fs'
import path from 'node:path'
import {Client, IntentsBitField, Collection, Events, MessageFlags} from 'discord.js';
import 'dotenv/config'
import {pathToFileURL} from 'node:url'

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
    ]
})

client.on('clientReady',(bot) => {
    console.log(`${bot.user.tag} is online`)
})

client.commands = new Collection();

const foldersPath = path.join(import.meta.dirname, '..', 'utils', 'commands');
const commandFiles = fs.readdirSync(foldersPath);

for (const file of commandFiles){
    const filePath = path.join(foldersPath, file);
    const command = await import(pathToFileURL(filePath).href);
    if('data' in command && 'execute' in command){
        client.commands.set(command.data.name, command);
    }else{
        console.log(`[Warning] The command at ${filePath} is missing a required "data" or "execute" property`)
    }
}

client.on(Events.InteractionCreate,async(interaction) => {
    if(!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if(!command){
        console.log('No Command')
    }

    try{
        await command.execute(interaction);
    }catch(err){
        console.error(err);
        if(interaction.replied || interaction.deferred){
            await interaction.followUp({
                content: 'There was an error while executing this command',
                flags: MessageFlags.Ephemeral,
            });
        }else{
            await interaction.reply({
                content: 'There was an error while executing this command',
                flags: MessageFlags.Ephemeral,
            });
        }
    }
})

client.login(process.env.DISCORD_TOKEN);