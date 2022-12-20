/* global browser */

async function onTabCreated(tab){
	if(!tab.active){
		setTimeout( function() {
			browser.tabs.executeScript(tab.id, {
				runAt: 'document_idle', 
				file: 'show.js'
                	});
		}, 3000);
	}
}

function onTabActivated(info){
	browser.tabs.executeScript(info.tabId, {
		runAt: 'document_idle', 
		file: 'hide.js'
	});
}

browser.tabs.onCreated.addListener(onTabCreated);
browser.tabs.onActivated.addListener(onTabActivated);

