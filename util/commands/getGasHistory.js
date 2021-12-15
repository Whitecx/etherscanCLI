import Command from '../commandConfig/commandClass.js';
import globals from '../../index.js';
import {evaluate} from 'mathjs';
import * as accountFns from '../accounts/accountFns.js';
import * as dateFns from '../dates/dateFns.js';
import * as gasFns from '../gas/gasFns.js';
import * as ethPriceFns from '../marketPrices/ethPriceFns.js';

new Command("getGasUsed",
            `Returns a sum of gas spent on transactions \n
            Usage: escan getGasHistory <address> \n
            Options:
                From a start date
                -start=<start-date>
                \n

                To an end date
                -end=<end-date>,
                \n

                Exclude gas from failed transactions
                -excludeFailed,
                \n

                Only use gas from failed transactions
                -failedOnly
                \n

                Only return outgoing transactions
                -outgoing`
                ,

            async (address, options)=>{
                //Get a list of address transaction history
                let history = await accountFns.getHistory(address, globals._config);
                let gasHistory = history.map((item)=> {
                        return {
                            gasPaid: gasFns.calcGasPaid(item.gasUsed, item.gasPrice), //in ETH
                            date: dateFns.unixToDateString(item.timeStamp),
                            isError: item.isError,
                        }
                    });

                let startDate = gasHistory[0].date;
                let endDate = gasHistory[gasHistory.length-1].date;
                //For date range, get eth prices for each date
                let pastPrices = await ethPriceFns.getHistoricalETH(startDate, endDate);
                //Convert ETH to USD using each price
                gasHistory = gasHistory.map(row=>{
                    console.log(row);
                    let histIndex = Math.floor(ethPriceFns.getHistIndex(row.date, endDate));
                    let price = parseFloat(pastPrices[histIndex].Price.replace(",",""));
                    //console.log(`Calc: ${parseFloat(row.gasPaid)} * ${price}`);
                    row.gasPaid = "$" + evaluate((row.gasPaid) * price).toFixed(2);
                    return row;
                });

                console.log("Gas History (based on value of ETH on day of each txn)");
                console.log(gasHistory);
                console.log("Totals: ");

                //Sum and return gas used in USD
                let totalFees = 0;
                for(let i = 0; i < gasHistory.length; i++){
                    let decimalFee = parseFloat(gasHistory[i].gasPaid.replace("$",""));
                    totalFees += decimalFee;
                }
                totalFees = totalFees.toFixed(2);
                console.log("$" + totalFees);
            });

    
