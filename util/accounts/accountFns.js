import got from 'got'

function parseData(data){
    return JSON.parse(data.body)
}

export const getBalance = async (address, _config) => {
    let balanceReq = await got.get(`${_config.baseUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${_config.apiKey}`);
    let balance = parseData(balanceReq).result;
    return balance;
}

export const getHistory = async (address, _config, options={}) => {
    let historyReq = await got.get(`${_config.baseUrl}?module=account&action=txlist&address=${address}&startblock=${options?.startblock || 0}&endblock=${options?.endblock || 99999999}&sort=asc&apikey=${_config.apiKey}`);
    let history = parseData(historyReq).result;
    return history;
}
