import cheerio from 'cheerio';
import fs from 'fs';


function parseData(data){
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
    console.log(arr);
    console.log(keys);

}

function mapObject(keys, arr){
    let newObj = {};
    keys.forEach((key, i)=>{ newObj[key] = arr[i]});
    return newObj;
}
fs.readFile('./data.html', 'utf8', (err, data)=>{
    if(err){console.log(err);}
    else{parseData(data);}
});
