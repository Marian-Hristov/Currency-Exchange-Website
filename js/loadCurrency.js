'use strict';
/**
 * This function loads the currencies from the currency.json
 * file into the datalist elements in the page
 */
function loadCurrenciesFromJSON() {
    getValidCurrenices()
                .then(data => {
                    const listOne = document.querySelector("#base_currency_selection");
                    const listTwo = document.querySelector("#to_currency_select");
                    for(let currency of Object.entries(data)){
                        listOne.appendChild(createOption(currency[1].code, currency[1].name));
                        listTwo.appendChild(createOption(currency[1].code, currency[1].name));
                    }
                })
                .catch(e => {
                    console.log(e);
                })
}
/**
 * This function fetches the currencies from the currency.json
 * file, parses the JSON data and returns the parsed data 
 * @return {Promises} promise of the fetch because the function is async
 */
async function getValidCurrenices(){
    const data = await fetch("../json/currency.json");
    return await data.json();
}