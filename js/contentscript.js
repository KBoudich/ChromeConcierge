// detect the protocol
const PROTOCOL = window.location.protocol;

// countdown seconds default
var countdown = 1000 * 10

// create timer objects
var closeTimer;
var notifyTimer;

init();

function setUserActivity(countdownLevel) {

	// set countdown
	countdown = countdownLevel;

	document.onclick = function() {
		startCloseTimer(countdown);
	};
	document.onmousemove = function() {
		startCloseTimer(countdown);
	};
	document.onkeypress = function() {
		startCloseTimer(countdown);
	};
	document.touchstart = function() {
		startCloseTimer(countdown);
	};
	document.onscroll = function() {
		startCloseTimer(countdown);
	};

	startCloseTimer(countdown);
}

function init(){
	self = this;
    var xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://raw.githubusercontent.com/KBoudich/raz-al-ghul/master/settings.json?_' + new Date().getTime(), true);
	//xhr.open('GET', 'http://127.0.0.1:9100/ccsettings.json?_' + new Date().getTime(), true);
    xhr.timeout = 4000;
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.responseText) {
        var resp;
        try {
		  resp = JSON.parse(xhr.responseText);
			for (let i = 0; i < resp.whitelist.length; i++) {
				const url = getRootUrl(resp.whitelist[i]);
				if(url === getRootUrl(window.location.href))
					{
						console.log(window.location.href + " is whitelisted.")
						return}
						;
			}	
		  setTabBehaviour(resp);
        } catch (e) {
          console.error('Failed to parse settings response : ' + xhr.responseText);
          return "";
        }

        if (!resp) {
          return;
        }
      }
    };
    xhr.send();
}

function getRootUrl(url) {
    var prefix = /^https?:\/\//;
    var domain = /^[^\/:]+/;
    // remove any prefix
    url = url.replace(prefix, "");
    // assume any URL that starts with a / is on the current page's domain
    if (url.charAt(0) === "/") {
        url = window.location.hostname + url;
    }
    // now extract just the domain
    var match = url.match(domain);
    if (match) {
        return(match[0]);
    }
    return(null);
  };

function setTabBehaviour(settings)
{
	if (settings.timeToClose) {
	 
		// set the value
		let countdownLevel = settings.timeToClose;			
		
		// convert the storage string to an int
		countdownLevel = parseInt(countdownLevel);
					
		// check the value type
		if (countdownLevel > 0) {
						
			// start the timer
			setUserActivity(1000 * countdownLevel);
			
		} else {
		
			// timer not set, default to 60 minutes
			let countdownLevel = 1000 * 60 * 60;
			setUserActivity(countdownLevel);
		
		}								
		
	} else {
		
		// timer not set, default to 60 minutes
		let countdownLevel = 1000 * 60 * 60;
		setUserActivity(countdownLevel);
							
	}
}

// function to start the timer
function startCloseTimer(countdownVal) {
	
	console.log('setting close timer to: ' + countdownVal);
	console.log ('current url : ' + window.location);

	// clear any existing timers
	window.clearTimeout(notifyTimer);
	window.clearTimeout(closeTimer);					
	
	// set the default notify
	let notifyVal = 50;
	
	// set the notify count
	if (countdownVal > 120000) {
		notifyVal = countdownVal - 120000; 
		
		// start notify countdown
		notifyTimer = setTimeout(function(){		
				chrome.runtime.sendMessage({"message": "notify", "tabUrl": window.location.href.toString(),});							
			},notifyVal);
	
	} 
			
	// start close countdown
	closeTimer = setTimeout(function(){		
				chrome.runtime.sendMessage({"message": "closetab", "tabUrl": window.location.href.toString(),});							
			},countdownVal);
}
