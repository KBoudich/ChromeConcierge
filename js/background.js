chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	if ( request.message === "closetab" ) {  
		chrome.tabs.query({}, function(tabs) { 
			for (var i = 0; i < tabs.length; i++) {				
				if (tabs[i].url === request.tabUrl) {										
					// close tab
					chrome.tabs.remove(tabs[i].id);					
				}			
			}
		} );		
	}
});
