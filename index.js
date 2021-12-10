#!/usr/bin/env node
import process from 'process'
console.log("Etherscan CLI");
//Imports functions needed to load config file
import * as configFns from './util/config/configFns.js';
//Imports the default config file
import * as defaultConfigs from './util/config/defaultConfigs.js';
const defaultConfig = defaultConfigs.defaultConfig;
//Imports object referencing all of the commands
import commands from './util/commandConfig/commands.js';
//Creates all the commands that and looads them into the commands object
import commandImports from './util/commandConfig/commandImports.js';

//Primary function to kick off this script - maps cmd to a command in the commands object
async function runCommand(cmd){
    try{
        await commands[cmd[2]].run(cmd);
    }catch(err){
        if(err.message == 'Cannot read property \'run\' of undefined'){        
            console.log(`No such command \'${cmd[2]}\'. Try help for options`);
        }else{ console.log(err);}
    }
}

//Globals that can be included in other files in this project
const globals = {
    _config: null,//contains important vars like the users API Key
}
export default globals;

(async function startScript(){
    //Look for existing config file and load it. If none, create one using defaultConfig const and load it
    globals._config = await configFns.loadConfig(JSON.stringify(defaultConfig));
    await runCommand(process.argv);
})();
