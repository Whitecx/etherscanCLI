# Table of Contents:
+ [etherscanCLI](#etherscancli)
+ [Usage](#usage)
+ [Creating a Command](#creating-a-new-command)
    - [Step 1: Create .js File](#step-1)
    - [Step 2: Import Command Class](#step-2)
    - [Step 3: Instance of Command Class](#step-3)
    - [Step 4: Import your Command](#step-4)
    - [Step 5: Test](#step-5)




# etherscanCLI
CLI Wrapper for the Etherscan API.


The purpose of this application is to make it easier to write and share composable custom scripts that leverage the etherscan cli. Use existing cli commands, or create your own (from scratch or on top of existing commands).
# Usage
1. run npm install -g in the project's root directory. This makes the command available globally
2. run: ```escan <command>``` in the terminal. ex ```escan help```
3. The first time you run the command, you'll be prompted to enter your etherscan API key. If you enter incorrectly, the key can be changed manually by editing the apiKey property in etherscanCLI/config.json (note this file gets created upon using the CLI). 
***
***


# Creating a new command

## Step 1
All commands are .js files in the etherscanCLI/util/commands directory.
Start by creating a .js file for your command in etherscanCLI/util/commands.


For example (from root etherscanCLI):
```
cd util/commands
touch myCommand.js
```
***


## Step 2
All commands are instances of the Command class. To create an instance of this class, import the Command class from commandClass.js by adding the line below to the top of your .js file.
 ```javascript 
 import Command from '../commandConfig/commandClass.js';
 ```
***


## Step 3
### Overview:
Create an instance of the Command class. This class takes 4 arguments (3 required, and 1 optional)

| Param        | Type           | Desc |Required  |
| ------------- |:-------------:|:-------- |:-----:|
| name      | string | name of the command | yes |
| desc     | string      | description of the command |  yes |
| func | function | code to execute when command is called |   yes |
| passer | function | how arguments in cli are passed to the function |   no |

### Example:
```javascript 
 import Command from '../commandConfig/commandClass.js';
 
 new Command( "hello", //name
              "says hi to the user", //desc
              (userName) => { console.log(`Hi ${username}, welcome to EtherscanCLI`) } //func
 );
```
***


### What the heck is passer (optional)?


**tldr**; passer can be used to map CLI inputs for a command (ex. ``` escan horiscope <myName> <myBirthday> ```) to its func 
```javascript
new Command( "horiscope", "what's in store for you today?", (birthday, name) => { /*do stuff*/});
```
By default ```passer``` assumes: 
1) that the order of args entered by the user follows the order of params defined in the func
2) The command doesn't need to know the first two values in the process.argv array (node path, and cli path respectively)

If for whatever reason these assumptions are wrong, then you can define a customer passer function to map the CLI args differently, or utilize the first two values in the process.argv array
/end



In most cases, the default passer function will correctly route CLI input, but a custom one can be provided as a 4th argument in the event that it doesn't.
The default passer function hanldes the following scenarios where # Args are any elements in the process.argv array w/ an index greater than 2:
| # Args | Action |
| :--------: | ------ |
| 0 | call func |
| 1 | call func(arg1)|
| >1| call func([arg1,...argN))|

***


## Step 4
Your new .js file code is only executed if it's imported into etherscanCLI/util/commandConfig/commandImports.js. 
To do so, edit commandImports.js, and import your .js file.

For example:
```javascript
import '../commands/myCommand.js';
```
***


## Step 5
Now that you've imported your .js file, you can run your new command by calling escan.
```
$> escan <myCommand> <arg1> <arg2> ... <argN>
```
***


## Full Example
Here's an example of a simple command called "scan", that uses the etherscan API and ethers to return a given addresses wallet balance in WEI and in ETH. 

Note: To use etherscan, an API Key is required. The CLI asks for the API Key if there's no etherscanCLI/config.json file, and then creates the config file. To access the users API Key, import globals from '../../index.js'. Then access the API key via globals._config.api. _config refers to an object created by parsing the config.json file. 

Note: This command follows a pattern using helper functions for code that might be repeatable. In this case it uses, the getBalance function in etherscanCLI/util/accounts/accountFns.js. 

```javascript
//Import the Commnad class required to create a new command
import Command from '../commandConfig/commandClass.js';
//globals is an object that holds global variables. Namely, the _config object which holds important data like a user's etherscan API Key
import globals from '../../index.js';
//The accountFns.js is a file for adding helpful reusable functions related to etherscan API commands that retrieve account data
import * as accountFns from '../accounts/accountFns.js';
import ethers from 'ethers'

//scan - show some general info about a given address
new Command("scan", "show some general info about an address",
    async (address)=>{
        try{
        let data = {"address": address};
        data.balance = await accountFns.getBalance(address, globals._config); //getBalance requires globals._config to get the API Key
        data.balance_eth = ethers.utils.formatUnits(data.balance, "ether");
        console.log(data);
        }catch(err){console.log(err)}
    });

```
