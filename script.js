let mainContainer = document.body,
	containerOnText = document.createElement('div'),
	menuFWContainer = document.querySelector('.menuFW'),
	font = document.createElement('link'),
	arrOnWords = [],
	textFromClipboard,
	markText;
			
font.setAttribute('href', 'https://fonts.googleapis.com/css?family=Ubuntu:300');
font.setAttribute('rel', 'stylesheet');

document.head.appendChild(font);
			

containerOnText.setAttribute("id", "containerTranslateText");
mainContainer.addEventListener('click', takeText);
mainContainer.addEventListener('dbclick', takeText);

// Translated text
		
function takeText(e){
	
	markText = window.getSelection().toString();

	if(markText !== ' ' && (markText.split(' ').length < 6) && (markText.length !== 40) && (containerOnText.getAttribute('style') == 'display: block;' || containerOnText.hasAttribute('style') == false)){
		
		fetch('https://translation.googleapis.com/language/translate/v2?key=AIzaSyC0gnQL4NyD6r1eBmg_ngvrY128jWPygAk&target=pl&source=en&q='+markText)
			.then(resp => {
				resp.json()
			})
			.then(resp => { 
				containerOnText.innerText = resp.data.translations[0].translatedText;
				const translatedText = resp.data.translations[0].translatedText;
					
				if(markText != '') {
					if(arrOnWords.length > 4){
						arrOnWords.shift();
						arrOnWords.push([markText, translatedText])
					} else {
						arrOnWords.push([markText, translatedText])
					}
				} 

				let message = {pairWords: arrOnWords};

				if(message.length !== 0){
					chrome.storage.sync.set(message);
				}			
			}), function(error) {
				console.log(error.message)
			}	  
	}
};

function onOff(message, sender, sendResponse) {

	const tabId = Object.keys(message)[0];

	chrome.storage.sync.get(null, function(storageStock) {

		if(message[tabId][0] == true && storageStock.stateAll != true){
			let paragra = document.getElementById('containerTranslateText');
			paragra.style.setProperty("display", "block");

				if(message[tabId][1] == true){
					paragra.classList.remove("darkBackground");
					paragra.classList.add("brightBackground");
				} else if(message[tabId][1] == false){
					paragra.classList.remove("brightBackground");;
					paragra.classList.add("darkBackground");
				}
		} else if (message[tabId][0] == true && storageStock.stateAll == true) {
			let paragra = document.getElementById('containerTranslateText');
			paragra.style.setProperty("display", "block");
				if(message[tabId][1] == true){
					paragra.classList.remove("darkBackground");
					paragra.classList.add("brightBackground");;
				} else if(message[tabId][1] == false){
					paragra.classList.remove("brightBackground");;
					paragra.classList.add("darkBackground");
				}
		} else if(message[tabId][0] != true && storageStock.stateAll == true){
			let paragra = document.getElementById('containerTranslateText');
			paragra.style.setProperty("display", "block");	
				if(message[tabId][1] == true){
					paragra.classList.remove("darkBackground");
					paragra.classList.add("brightBackground");;
				} else if(message[tabId][1] == false){
					paragra.classList.remove("brightBackground");;
					paragra.classList.add("darkBackground");
				}
		} else {
			let paragra = document.getElementById('containerTranslateText');
			paragra.style.setProperty("display", "none");	
		}

	});

	mainContainer.appendChild(containerOnText)

 };

chrome.runtime.onMessage.addListener(onOff);
