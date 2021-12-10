import Command from '../commandConfig/commandClass.js';
import globals from '../../index.js';

//getConfig - show the current configuration for aws
new Command("getConfig", "show the current configuration for the cli",
    ()=>{console.log(JSON.stringify(globals._config))});

