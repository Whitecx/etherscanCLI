#!/usr/bin/env node
import process from 'process'
import ethers from 'ethers'
console.log("Sample CLI");
//local imports
import * as accountFns from './util/accounts/accountFns.js';
import * as configFns from './util/config/configFns.js';
import * as defaultConfigs from './util/config/defaultConfigs.js';
const defaultConfig = defaultConfigs.defaultConfig;

const commands = {};//object holds all commands as attribtues

//Command class is a template for creating commands
class Command {
    constructor(name, desc, func, passer=this.defaultPasser){
        this.func = func;
        this.passer = passer;
        this.desc = desc;
        commands[name] = this;//add command to commands obj
    }
    async defaultPasser(cmd){
        if(cmd.length == 2){ await this.func(); }
        else{
            let args = cmd.slice(3);
            let arg = cmd[3];
            args.length==1 ? await this.func(arg) : await this.func(args);
        }
    }
    //function for executing the command
    async run(cmd){ await this.passer(cmd) }
}

//Primary function to kick off this script
async function runCommand(cmd){
    try{
        await commands[cmd[2]].run(cmd);
    }catch(err){
        if(err.message == 'Cannot read property \'run\' of undefined')        {
            console.log(`No such command \'${cmd[2]}\'. Try help for options`);
        console.log(err.message);
        }
    }
}

//help function - lists all commands and their desc
new Command("help", "list all commands and their descriptions",
    function(){
        //loop through and print command names and desc
        let keys = Object.keys(commands);
        keys.forEach(key => console.log(`${key}: ${commands[key].desc}`))
    });

//getConfig - show the current configuration for aws
new Command("getConfig", "show the current configuration for the cli",
    ()=>{console.log(JSON.stringify(_config))});

//scan - show some general info about a given address
new Command("scan", "show some general info about an address",
    async (address)=>{
        try{
        let data = {"address": address};
        /*
        let balanceReq = await got.get(`${_config.baseUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${_config.apiKey}`);
        data.balance = parseData(balanceReq).result;
        */
        data.balance = await accountFns.getBalance(address, _config); 
        data.balance_eth = ethers.utils.formatUnits(data.balance, "ether");
        console.log(data);
        }catch(err){console.log(err)}
    });
         

/*
//setConfig - Set config to one of the hardcoded defaults to fill AWS params
new Command("setConfig", "Set config to one of hardcoded defaults",
    function(){
        //Show existing defaults
        console.log("Choose a config..");
        configDefaults.forEach((config,i) => {console.log(`${i}: ${config.name}`)});
        
        //User enters number for desired config to set
        prompt.start();
        prompt.get(['config'], (err, choice)=>{
            if(configDefaults.length > choice && choice >= 0){
                let configString = JSON.Stringify(configDefaults[choice].value);
                writeConfigFile(configString);
            }
        });
    });
 */               
var _config;
(async function startScript(){
    //Look for existing config file and load it. If none, create one using defaultConfig const and load it
    _config = await configFns.loadConfig(JSON.stringify(defaultConfig));
    await runCommand(process.argv);
})();
