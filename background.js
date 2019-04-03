 document.addEventListener('DOMContentLoaded', function(){

    chrome.tabs.onActivated.addListener(function(info) {
            chrome.tabs.get(info.tabId, function(tab) {
                    chrome.storage.sync.get(null, (storageStock) => {
 
                        let stateOnOff, colorOnOff;

                            console.log(info.tabId);
                            console.log(storageStock);
                            console.log(storageStock[info.tabId]);

                         
                            if(storageStock[info.tabId] == undefined){
                                    stateOnOff = false;
                                    colorOnOff = false;

                            } else {
                                stateOnOff = storageStock[info.tabId][0];
                                colorOnOff = storageStock[info.tabId][1];
                            }
                           
                            
                            let stateOnOffAll = storageStock.stateAll;

                            let msg = {
                                [info.tabId]: [stateOnOff,  colorOnOff],
                                stateAll: stateOnOffAll
                            }	
                    
                            chrome.tabs.sendMessage(info.tabId, msg);

                    })
            });
    });

    chrome.tabs.onUpdated.addListener((tabId, statusInfo, tabInfo) => {

        if(tabInfo.active == true){

            chrome.storage.sync.get(null, (storageStock) => {

                let stateOnOff, colorOnOff;

                
                    if(storageStock[tabId] == undefined){
                            stateOnOff = false;
                            colorOnOff = false;

                    } else {
                        stateOnOff = storageStock[tabId][0];
                        colorOnOff = storageStock[tabId][1];
                    };
                
                    
                    let stateOnOffAll = storageStock.stateAll;

                    let msg = {
                        [tabId]: [stateOnOff,  colorOnOff],
                        stateAll: stateOnOffAll
                    };	
            
                    chrome.tabs.sendMessage(tabId ,msg);

            });
        };
    });

        
    chrome.tabs.onRemoved.addListener((idTab, removeInfo) => {

        let closedTab = {
            [idTab]: [false, false]
        };

        chrome.storage.sync.set(closedTab);
    }) ;

});
