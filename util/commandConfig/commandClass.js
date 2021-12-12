//Command class is a template for creating commands
import commands from './commands.js';
import * as globals from '../../index.js';

export default class Command {
    constructor(name, desc, func, passer=this.defaultPasser){
        this.func = func;
        this.passer = passer;
        this.desc = desc;
        commands[name] = this;//add command to commands obj
    }
    async defaultPasser(cmd){
        if(cmd.length == 3){ await this.func(); }
        else{
            let args = cmd.slice(3);
            let arg = cmd[3];
            args.length==1 ? await this.func(arg) : await this.func(args);
        }
    }
    //function for executing the command
    async run(cmd){ await this.passer(cmd) }
}
