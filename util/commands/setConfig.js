import * as commandClass from './commandClass.js';
const Command = commandClass.Command;

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
