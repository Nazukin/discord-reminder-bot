import {REST,Routes} from 'discord.js';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url'

const commands = [];

const foldersPath = path.join(import.meta.dirname,'commands');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('js'))

for(const file of commandFiles){
    const filePath = path.join(foldersPath, file);
    const command = await import(pathToFileURL(filePath).href);
    if('data' in command && 'execute' in command){
        commands.push(command.data.toJSON());
    }else{
        console.log('Error')
    }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
    try{
        console.log(`Started refreshing ${commands.length} application`);
        const data = await rest.put(Routes.applicationGuildCommands(process.env.BOT_ID,process.env.SERVER_ID),{body: commands});
        console.log(`Sucessfully reloaded ${data.length} commands`);
    }catch(err){
        console.error(err);
    }
})();