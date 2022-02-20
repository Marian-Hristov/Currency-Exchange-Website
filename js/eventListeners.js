'use strict';
/**
 * This function adds the eventListener for the "Convert" button
 */
function convertEvent(){
    document.querySelector("#get_data_btn").addEventListener("click", ()=>{ 
        convert();
    })
}
/**
 * This function adsd the eventListeners for the "Show History" and "Clear History" buttons
 */
function historyEvents(){
    document.querySelector("#read_storge_btn").addEventListener("click", ()=>{
        loadHistory();
    });
    document.querySelector("#clear_storge_btn").addEventListener("click", ()=>{ 
        localStorage.clear();
        console.log("History cleared");
    })
}