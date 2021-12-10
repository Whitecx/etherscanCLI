import Command from '../commandConfig/commandClass.js';
import globals from '../../index.js';
import * as accountFns from '../accounts/accountFns.js';
import ethers from 'ethers'

//scan - show some general info about a given address
new Command("scan", "show some general info about an address",
    async (address)=>{
        try{
        let data = {"address": address};
        data.balance = await accountFns.getBalance(address, globals._config); 
        data.balance_eth = ethers.utils.formatUnits(data.balance, "ether");
        console.log(data);
        }catch(err){console.log(err)}
    });
         
