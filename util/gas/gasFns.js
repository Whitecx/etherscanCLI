import { ethers } from "ethers"

//returns gas paid in ETH
//Note: gasPrice is a string representing WEI
export const calcGasPaid = (gasUsed, gasPrice)=>{
    gasPrice = ethers.utils.formatEther(gasPrice);
    return gasPrice * gasUsed;
}
