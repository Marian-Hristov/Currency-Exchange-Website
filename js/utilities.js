'use strict';

const baseURL = "https://api.exchangerate.host/";
/**
 * This function creates and returns an option element
 * holding the given value and text
 * @param {String} value value of the option
 * @param {String} text text in the option
 * @return {HTMLElement} 
 */
function createOption(value, text){
    let option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    return option;
}
/**
 * This function retuns the absolute url for the exchange API
 * based on the given base currency, to currency and amount to
 * be converted
 * @param {String} base the base currency of the convertion
 * @param {String} to the currency to convert to
 * @param {Number} amount the amount of base currency that we want to convert
 * @return {String} the url of the request for the exchange API
 */
function getAbsoluteRequestURL(base, to, amount){
    return `${baseURL}convert?from=${base}&to=${to}&amount=${amount}`;
}

/**
 * This function validates the currency inputs and does the call to the exchange
 * API for the convertion of the currencies and sends the result to the display
 * method
 * @return {Promise} return the fetch promise of the exchange API (never used)
 */
async function convert(){
    let base = document.querySelector("#base_currency_select_input").value;
    let to = document.querySelector("#to_currency_select_input").value;
    let amount = document.querySelector("#amount").value;
    let inputs = [base, to];
    if(base == '' || to == '' || amount == ''){
        alert("Please fill in all required fields");
        return;
    }
    let result = await validateInputs(inputs);
    if(!result){
         alert("Please insert valid currencies");
        return;
    };
    let url = getAbsoluteRequestURL(base, to, amount);
    fetch(url)
        .then(res => res.json())
        .then(data =>{
            addToHistory(makeConvertionObject(data));
            displayResults(makeConvertionObject(data));
        })
        .catch(e => {
            console.log(e);
        });
}
/**
 * This function validates if the value of the given inputs 
 * is an accepted currency from the currency.json file
 * @param {Array<HTMLElement>} inputs the inputs to be validated
 * @return {Promise} resolved promise of the validation of the inputs
 */
function validateInputs(inputs){
    return new Promise(resolve => {
        getValidCurrenices()
            .then(data => {
                inputs.forEach(element => {
                if(!Object.keys(data).includes(element)){
                    resolve(false);
                }
            });
            resolve(true);
            })
    })
}

/**
 * This function creates and returns an element only containing the data
 * used for the displaying of the convertion
 * @param {Object} data the data of the fetch from the exchange API
 * @return {Object} object containing all the data used in the displaying of the convertion
 */
function makeConvertionObject (data){
    let date = getCurrentTime();
    return {
        from: data.query.from,
        to: data.query.to,
        rate: data.info.rate,
        amount: data.query.amount,
        pay: data.result,
        date: date
    }
}
/**
 * This function displays the given data into the convertion table
 * It creates the tbody for display purposes
 * @param {Object} data object containing the information to be displayed
 */
function displayResults(data){
    // ? Creating tbody element and selecting it to not have a hanging white space
    // ? under the thead when the page is tall enough
    let tbody = document.createElement("tbody");
    document.querySelector("table").append(tbody);
    tbody = document.querySelector("tbody");
    createRow(tbody, data);
}
/**
 * This function creates a row and appends it to the given body
 * @param {HTMLElement} body the body in which the row should be
 * @param {Object} data the data to be displayed
 */
function createRow(body, data){
    let row = document.createElement("tr");
    createCell(row, data.from);
    createCell(row, data.to);
    createCell(row, data.rate);
    createCell(row, data.amount);
    createCell(row, data.pay);
    createCell(row, data.date);
    body.append(row);
}
/**
 * This function returns a formatted version of the current time
 * @return {String} formatted time 
 */
function getCurrentTime(){
    let date = new Date();
    return date.toLocaleString('en-US', {hour12: false}).replaceAll("/", "-").replace(",", " -");

}
/**
 * This function creates a cell with a value inside of it and 
 * adds it to the given row
 * @param {HTMLElement} row row in which the cell should be
 * @param {String} value the value which the cell should hold
 */
function createCell(row, value){
    let cell = document.createElement("td");
    cell.textContent = value;
    row.append(cell);
}
/**
 * This function adds a convertion object to the localStorage and 
 * creates a the storage if needed
 * @param {Object} obj convertion object to be added to the localStorage
 */
function addToHistory(obj){
    let history = JSON.parse(localStorage.getItem("currency_exchange_history"));
    // Creating the history array if it is not in the storage alreadys
    if(history != null){
        history.push(obj);
        localStorage.setItem("currency_exchange_history", JSON.stringify(history));
    } else {
        let arr = [];
        arr.push(obj);
        localStorage.setItem("currency_exchange_history", JSON.stringify(arr));
    }
}
/**
 * This function loads the history of convertions form the localStorage
 * and displays it in the table
 */
function loadHistory(){
    let history = JSON.parse(localStorage.getItem("currency_exchange_history"));
    let body = document.querySelector("tbody");
        if(body != null) {
            document.querySelector("tbody").remove();
        }
    if(history != null){
        for (let i = history.length - 1; i >= 0; i--) {
            displayResults(history[i]);
        }
    }
}
