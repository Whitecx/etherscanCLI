import request from 'request';
import cheerio from 'cheerio';


//Returns an array of objects containing Date, Price, Open, High, and Low
export const getHistoricalETH = (start, end) => {
    try{
        var headers = {
            'authority': 'www.investing.com',
            'pragma': 'no-cache',
            'cache-control': 'no-cache',
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            'accept': 'text/plain, */*; q=0.01',
            'content-type': 'application/x-www-form-urlencoded',
            'x-requested-with': 'XMLHttpRequest',
            'sec-ch-ua-mobile': '?0',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36',
            'sec-ch-ua-platform': '"macOS"',
            'origin': 'https://www.investing.com',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://www.investing.com/crypto/ethereum/historical-data',
            'accept-language': 'en-US,en;q=0.9'
        };
        var dataString = `curr_id=1061443&smlID=25674078&header=null&st_date=${start}&end_date=${end}&interval_sec=Daily&sort_col=date&sort_ord=DESC&action=historical_data`;

        var options = {
            url: 'https://www.investing.com/instruments/HistoricalDataAjax',
            method: 'POST',
            headers: headers,
            body: dataString
        };
        
        let p = new Promise((resolve, reject)=>{
            request(options, (err, res, body)=>{
                if(err){reject(err)}
                body = formatHistData(body);
                resolve(body);
            });
        }).catch(err=>{console.log(err)});
        
        return p;
    }catch(err){console.log(err);}
}

function formatHistData(data){
    const $ = cheerio.load(data);
    let parsed = ($('table tr').text());
    let split = parsed.split(/\n\n|\n \n/g);
    let arr = [];
    split.forEach(elem=>{
        let newElem = elem.split('\n');
        arr.push(newElem);
    });
    let keys = arr[0];
    keys.shift();
    arr.shift();
    arr = arr.map((elem)=>{return mapObject(keys, elem);});
    return arr;

}

function mapObject(keys, arr){
    let newObj = {};
    keys.forEach((key, i)=>{ newObj[key] = arr[i]});
    return newObj;
}


export const getHistIndex = (date, startDate)=>{
    date = new Date(date);
    startDate = new Date(startDate);
    console.log(`StartDate: ${startDate} - Date:${date}`);
    let index = (startDate - date)/(24*3600*1000);
    return index;
}
