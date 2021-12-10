# etherscanCLI
CLI Wrapper for the Etherscan API

#Use
1. run npm install -g in the root directory
2. run escan <command>

#Adding a new command
1. Create a .js file for your command in ./util/commands
2. add the following: import Command from '../commandConfig/commandClass.js';
3. When you're done, import your .js file in /util/commandConfig/commandImports.js, then it will be accessible when running escan <command>
