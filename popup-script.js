document.addEventListener('DOMContentLoaded', function(){


let turnOnOffAll = document.querySelector('.menuFW__switchAll--turnOnOff'),
	turnOnOff = document.querySelector('.menuFW__switch--turnOnOff'),
	color = document.querySelector('.menuFW__change--changeColor'),
	conteinerWords	= document.querySelector('.menuFW__stock--listContainer'),
	switchLabel = document.querySelectorAll('.switch--label'),
	arrPairsWords;


chrome.storage.sync.get(null, (storageStock) => {

	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {

		let arrOneAndColor = []

		arrOneAndColor[tabs[0].id] = [turnOnOff.checked, color.checked]

		if(storageStock[tabs[0].id] == undefined){
			turnOnOff.checked = false;
			color.checked = false;
		} else {
			turnOnOff.checked = storageStock[tabs[0].id][0];
			color.checked = storageStock[tabs[0].id][1];
		}

		if(color.checked === true){
			document.body.classList.add('body--dark');

			for(let i=0; i < switchLabel.length; i++){
				switchLabel[i].classList.add('switch--label-dark');	
			}
		} else {
			document.body.classList.remove('body--dark');
			
			for(let i=0; i < switchLabel.length; i++){
				switchLabel[i].classList.remove('switch--label-dark');
			}	
		}

	});

	if(storageStock.stateAll == true){
		turnOnOffAll.checked = true;
	} else {
		turnOnOffAll.checked = false;
	};

	if(storageStock.pairWords != undefined){
		for(let i=0; i<storageStock.pairWords.length; i++){
			const englishWord = document.createElement("li"),
						polishWord = document.createElement("li"),
						ulPairsWords = document.createElement('ul');

			englishWord.classList.add('menuFW__stock--listItems');
			polishWord.classList.add('menuFW__stock--listItems');
			ulPairsWords.classList.add('menuFW__stock--listPair');
			
			englishWord.innerHTML = storageStock.pairWords[i][0];
			polishWord.innerHTML = storageStock.pairWords[i][1];
			ulPairsWords.appendChild(englishWord);
			ulPairsWords.appendChild(polishWord);

			conteinerWords.appendChild(ulPairsWords);
		};
	};
});


turnOnOff.addEventListener('click', (e) => {

	let params = {
		active: true,
		currentWindow: true
	}

	chrome.tabs.query(params, gotTabs)
	
	function gotTabs(tabs){
		console.log('z funkcji')
		console.log(tabs)

		let stateOnOff = turnOnOff.checked,
		stateOnOffAll = turnOnOffAll.checked,
		tabId = tabs[0].id,
		colorOnOff = color.checked;

		let msg = {
			[tabId]: [stateOnOff, colorOnOff],
			stateAll: stateOnOffAll,
		}	

		chrome.storage.sync.set(msg);
		
		chrome.tabs.sendMessage(tabId, msg);

	}
		
})

	color.addEventListener('click', (e) => {

		let params = {
			active: true,
			currentWindow: true
		}

		chrome.tabs.query(params, gotTabs);
	
		function gotTabs(tabs){

			let stateOnOffAll = turnOnOffAll.checked,
				stateOnOff = turnOnOff.checked,
				colorOnOff = color.checked,
				tabId = tabs[0].id;

			const msg = {
				[tabId]: [stateOnOff, colorOnOff],
				stateAll: stateOnOffAll
			}
			
			if(color.checked === true){
				document.body.classList.add('body--dark');
	
				for(let i=0; i < switchLabel.length; i++){
					switchLabel[i].classList.add('switch--label-dark');	
				}
			} else {
				document.body.classList.remove('body--dark');
				
				for(let i=0; i < switchLabel.length; i++){
					switchLabel[i].classList.remove('switch--label-dark');
				}	
			}

			chrome.storage.sync.set(msg);

			chrome.tabs.sendMessage(tabs[0].id, msg)
		}
	
	});

	turnOnOffAll.addEventListener('click', (e) => {

		let params = {
			active: true,
			currentWindow: true
		}

		chrome.tabs.query(params, gotTabs)

		function gotTabs(tabs){

			let stateOnOffAll = turnOnOffAll.checked,
				stateOnOff = turnOnOff.checked,
				colorOnOff = color.checked;

			const msg = {
				[tabs[0].id]: [stateOnOff, colorOnOff],
				stateAll: stateOnOffAll
			}	

			chrome.tabs.sendMessage(tabs[0].id, msg);

			chrome.storage.sync.set(msg);
		}
	});

	chrome.runtime.onMessage.addListener(fromScript);

	const params = {
		active: true,
		currentWindow: true
	}

	chrome.tabs.query(params, fromScript)

	function fromScript(message, sender, sendResponse) {

		let	pairWords
		
		if(message.msg != undefined){
			console.log(message.msg.length)
			console.log(message.msg)

			arrPairsWords = message.msg

			console.log(arrPairsWords)

			for(let i=0; i < arrPairsWords.length; i++){

				pairWords = document.createElement('li');
				pairWords.innerHTML = arrPairsWords[i][0];
	
			};					
		};
	};
});
