
export const unixToDateString = (unixDate, format="en-US")=>{
    return new Date(unixDate * 1000).toLocaleDateString(format);
}
