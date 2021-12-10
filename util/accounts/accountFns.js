import got from 'got';

function parseData(data){
    return JSON.parse(data.body)
}

export const getBalance = async (address, _config) => {
    let balanceReq = await got.get(`${_config.baseUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${_config.apiKey}`);
    let balance = parseData(balanceReq).result;
    console.log(balance);
    return balance;
}

