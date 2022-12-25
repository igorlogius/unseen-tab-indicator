/* global browser */

const is_complete = new Set();
const tabUpdatedFilter = { properties: ["status"] };
const UNSEENICON = "✨";

async function doShow(tabId){
		let tab = await browser.tabs.get(tabId);
		if(!tab.active){
			browser.tabs.executeScript(tabId, { 
code: `(function() {
	if (!document.title.startsWith("${UNSEENICON}")) {
		document.title = "${UNSEENICON}" + document.title;
	}
})();`
});
		}
}

function onTabUpdated(tabId, changeInfo, tab){
	if(changeInfo.status === 'complete'){
		if(!is_complete.has(tabId)){
			is_complete.add(tabId);
			if(!tab.active){
				setTimeout(async () => {
					await doShow(tabId);
				},3500);
			}
		}
	}
}

function doHide(tabId){
		browser.tabs.executeScript(tabId, { 
code: `(function() {
    if (document.title.startsWith("${UNSEENICON}")) {
        document.title = document.title.replace("${UNSEENICON}", "");
    }
})();`
		});
}

function onTabActivated(info){
	if(is_complete.has(info.tabId)){
		doHide(info.tabId);
	}
}

function onTabRemoved(tabId){
	if(is_complete.has(tabId)){
		is_complete.delete(tabId);
	}
}

browser.tabs.onUpdated.addListener(onTabUpdated, tabUpdatedFilter); 
browser.tabs.onActivated.addListener(onTabActivated);
browser.tabs.onRemoved.addListener(onTabRemoved);

