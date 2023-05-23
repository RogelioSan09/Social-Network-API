//created a function that will format the date
const dateFormat = (date, format) => {
    //created a variable to store the date object
    const d = date instanceof Date ? date : new Date(date);
    //created a variable to store the options for the format
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    //return the formatted date
    return new Intl.DateTimeFormat(format, options).format(d);
}
//exported the function
module.exports = dateFormat;