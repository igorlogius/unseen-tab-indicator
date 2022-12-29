/* global browser */

const is_complete = new Set();
const tabUpdatedFilter = { properties: ["status"] };
const UNSEENICON = "✨";
let multipleTabsHighlighted = false;

async function doShow(tabId){
		let tab = await browser.tabs.get(tabId);
		if(!tab.active){
			doShowForce(tabId);
		}
}


async function doShowForce(tabId){
		browser.tabs.executeScript(tabId, { 
code: `(function() {
	if (!document.title.startsWith("${UNSEENICON}")) {
		document.title = "${UNSEENICON}" + document.title;
	}
})();`
});
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


function doToggle(tab){
	if(tab.title.startsWith(UNSEENICON)){
		doHide(tab.id);
	}else{
		doShowForce(tab.id);
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

browser.menus.create({
	title: 'Toggle Seen Flag',
	contexts: ["tab"],
	onclick: async (info, tab) => {
		if(multipleTabsHighlighted){
			let query = {
				highlighted: true,
				hidden: false,
				currentWindow: true,
				url: '<all_urls>'
			};
			(await browser.tabs.query(query)).map( t => doToggle(t) );
		}else{
			doToggle(tab);
		}
	}
});

function onTabsHighlighted(highlightInfo) {
    multipleTabsHighlighted = (highlightInfo.tabIds.length > 1);
}

browser.tabs.onHighlighted.addListener(onTabsHighlighted);

