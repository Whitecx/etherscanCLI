import fs from 'fs'
import util from 'util'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import prompt from 'prompt'
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const getPrompt = util.promisify(prompt.get);
const configLocation = '../../config.json';


//Configuration Loading
async function writeConfigFile(data){
    //create new file
    try{
        await writeFile(path.join(__dirname, configLocation), data);
        return true;
    }catch(err){
        if(err){console.log(err); return false;}
    }
}

export async function loadConfig(defaultConfig){
    //look for exsting config file
    try{
        let res = await readFile(path.join(__dirname, configLocation));
        return JSON.parse(res);
    }catch(err){
        if(err.code == "ENOENT"){
            console.log("No config found..");
            try{
                defaultConfig = await setupConfig(defaultConfig)
                await writeConfigFile(defaultConfig);
                let freshConfig = await loadConfig(defaultConfig);
                return freshConfig;
            }catch(err){console.log(err)}
        }else{console.log(err);}
    }
} 

async function setupConfig(defaultConfig){
    console.log("Setting up config..");
    prompt.start();
    try{
        defaultConfig = JSON.parse(defaultConfig);
        console.log("Please enter your Etherscan APIKey");
        let result = await getPrompt(['APIKey']);
        defaultConfig.apiKey = result.APIKey;
        defaultConfig = JSON.stringify(defaultConfig);
        return defaultConfig;
    }catch(err){console.log(err)} 
}
