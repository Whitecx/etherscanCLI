
import Command from '../commandConfig/commandClass.js';
import commands from '../commandConfig/commands.js';

//help function - lists all commands and their desc
new Command("help", "list all commands and their descriptions",
    function(){
        //loop through and print command names and desc
        let keys = Object.keys(commands);
        keys.forEach(key => console.log(`${key}: ${commands[key].desc}`))
    });

