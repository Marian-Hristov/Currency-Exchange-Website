'use strict';
/**
 * This function calls the loading of the currencies from currency.json file
 * and initiates the eventListeners for the convertion buttons
 */
function init(){
    loadCurrenciesFromJSON();
    convertEvent();
    historyEvents();
}

init();