/* global browser */

const unseenTabIds = new Set();
const manifest = browser.runtime.getManifest();
const extname = manifest.name;


function onBAClicked(tab){

}

async function onTabCreated(tab){
	console.debug('onTabCreated', tab.active, Date.now(), tab.lastAccessed, tab.openerTabId);
	if(!tab.active && tab.openerTabId){
		unseenTabIds.add(tab.id);
		// enable icon
		setTimeout( async function() {
			console.debug('executeScript');
		try {
			  await browser.tabs.executeScript(tab.id, {
				  runAt: 'document_idle', 
                    file: 'show.js'
                    });
		}catch(e){
			console.error(e);
		}
		}, 1000);
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
