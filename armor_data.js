// Creates armor set object
const setInfo = new armorSet();

// Loads default information upon page load 
document.onload = [
	document.getElementById('sex').dataset.sex = 'imageMale',
	fetchPartData(1,'head'),
	fetchPartData(2,'torso'),
	fetchPartData(3,'arms'),
	fetchPartData(4,'belt'),
	fetchPartData(5,'legs')
];



// Alternates between male and female armor images
document.getElementById('sex').addEventListener('change', () => {
	const checkbox = document.getElementById('sex');
	if(checkbox.checked) checkbox.dataset.sex = 'imageFemale';
	else checkbox.dataset.sex = 'imageMale';
	
	['head','torso','arms','belt','legs'].forEach(part => 
		fetchPartData(document.getElementsByClassName(part)[0].dataset.id,part)
	);
	
	console.log(checkbox.dataset.sex);
});

// Swaps picture and info for respective armor piece upon button click
['Head','Torso','Arms','Belt','Legs','Charm'].forEach((value, index) => {
	const part = value.toLowerCase();
	// Opens modal box for swaping process
	document.getElementById('swap'+value).addEventListener('click', () => {
		if(value !== 'Charm')
			document.getElementById(part+'SlotMenu').style.display = 'none';
		document.getElementById(part+'Swap').style.display = 'block';
	});

	// Closes modal box
	document.getElementsByClassName('close')[index].onclick = () => {
		document.getElementById(part+'Swap').style.display = 'none';
	};

	// Searches for armor piece starting with user input
	document.getElementById(part+'SearchButton').onclick = () => {
		const armor = document.getElementById(part+'Search').value.toLowerCase();
		fetch('./csv/' + part + '_list.csv')
			.then(response => response.text())
			.then(response => response.split('\r\n'))
			.then(response => response.map(r => r.split(',')))
			.then(nameList => nameList.filter(value => value[1].toLowerCase().startsWith(armor)))
			.then(matches => {
				console.log(matches);
				const options = matches.map(m => {
					return '<button type="button" class="'+part+'Selection">'+m[1]+'</button>';
				}).join('<br>');
				document.getElementById(part+'SearchResults').innerHTML = options;

				const select = document.getElementsByClassName(part+'Selection');
				for(let k = 0; k < select.length; k++) {
					select[k].onclick = () => {
						console.log('click');
						fetchPartData(matches[k][0],part);
						document.getElementById(part+'Swap').style.display = 'none';
						
						document.getElementById(part+'SlotSkills0').innerHTML = '';
						document.getElementById(part+'SlotSkills1').innerHTML = '';
						document.getElementById(part+'SlotSkills2').innerHTML = '';
					}
				}
			})
			.catch((err) => console.error(err));
	};

	// Randomly switches a specific piece of armor
	document.getElementById(part+'Random').onclick = () => {
		fetch('./csv/' + part + '_list.csv')
			.then(response => response.text())
			.then(response => response.split('\r\n'))
			.then(response => response.map((x) => x.split(',')))
			.then(armor => {
				const index = Math.floor(Math.random()*armor.length);
				console.log(armor[index][0]);
				return armor[index][0];
			})
			.then(id => fetchPartData(id,part))
			.then(document.getElementById(part+'Swap').style.display = 'none')
			.then(() => {
				if(part !== 'charm') {
					document.getElementById(part+'SlotSkills0').innerHTML = '';
					document.getElementById(part+'SlotSkills1').innerHTML = '';
					document.getElementById(part+'SlotSkills2').innerHTML = '';
				}
			})
			.catch((err) => console.error(err));
	};
});

// Fetches data for a single armor piece
function fetchPartData(id, part) {
	document.getElementsByClassName(part)[0].dataset.id = id;
	console.log('fetch, id: %i, part:%s',id,part);

	let url;
	if(part === 'charm') url = 'https://mhw-db.com/charms/' + id.toString();
	else url = 'https://mhw-db.com/armor/' + id.toString();

	fetch(url)
		.then(response => response.json())
		.then(async armor => {
			// Displays image
			switch(armor['assets']) {
				case null:
				case undefined:
					document.getElementById(part+'Img').src = './images/' + part + '-icon.png';
					break;
				default:
					document.getElementById(part+'Img').src = armor['assets'][document.getElementById('sex').dataset.sex];
					break;
			}
			
			
			document.getElementById(part+'Name').innerText = armor['name'];

			if(part !== 'charm') {
				// Displays stats
				document.getElementById(part+'R').innerText = armor['rarity'];
				document.getElementById(part+'Def').innerText = armor['defense']['base'];
				document.getElementById(part+'F').innerText = armor['resistances']['fire'];
				document.getElementById(part+'W').innerText = armor['resistances']['water'];
				document.getElementById(part+'I').innerText = armor['resistances']['ice'];
				document.getElementById(part+'T').innerText =  armor['resistances']['thunder'];
				document.getElementById(part+'D').innerText = armor['resistances']['dragon'];

				// Passes stats to set object\
				setInfo.setStat(part, 'defense',armor['defense']['base']);
				setInfo.setStat(part, 'fire', armor['resistances']['fire']);
				setInfo.setStat(part, 'water', armor['resistances']['water']);
				setInfo.setStat(part, 'ice', armor['resistances']['ice']);
				setInfo.setStat(part, 'thunder', armor['resistances']['thunder']);
				setInfo.setStat(part, 'dragon', armor['resistances']['dragon']);

				// Displays empty slots
				const slots = []
				armor['slots'].forEach((element,index) => {
					let slotButton = '<button class="slotButton" id="' + part + 'Slot' + index + '" data-rank="' + element['rank'] + '" type="menu">\n';
					slotButton += '<img src="images/gem_level_' + element['rank'] +'.png" class="slotIcon">\n';
					slots.push(slotButton + '</button>');
				});
				document.getElementById(part+'SlotsInner').innerHTML = slots.join('<br>');

				// Opens modal box for swaping process
				armor['slots'].forEach((element,index) => {
					//console.log(element);
					document.getElementById(part+'Slot'+index).addEventListener('click', () => {
						const modal = document.getElementById(part+'SlotMenu');
						modal.style.display = 'block';
						document.getElementById(part+'SlotButton').dataset.rank = document.getElementById(part+'Slot'+index).dataset.rank;
						document.getElementById(part+'SlotButton').dataset.index = index;
						document.getElementById(part+'SlotSearch').value = '';
						document.getElementById(part+'SlotResults').innerHTML = '';
					});
				});

				// Closes modal box
				document.getElementById(part+'CloseSlot').onclick = () => {
					document.getElementById(part+'SlotResults').innerHTML = '';
					document.getElementById(part+'SlotMenu').style.display = 'none';
				};

				document.getElementById(part+'SlotButton').onclick = () => {
					const deco = document.getElementById(part+'SlotSearch').value.toLowerCase();
					fetch('https://mhw-db.com/decorations?q={"slot":' + document.getElementById(part+'SlotButton').dataset.rank + '}')
						.then(response => response.json())
						.then(gems => gems.filter((value) => value['name'].toLowerCase().includes(deco)))
						.then(matches => {
							const options = matches.map(m => {
								return '<button type="button" class="'+part+'SlotSelection">'+m['name']+'</button>';
							}).join('<br>');
							document.getElementById(part+'SlotResults').innerHTML = options;
			
							const select = document.getElementsByClassName(part+'SlotSelection');
							for(let k = 0; k < select.length; k++) {
								select[k].onclick = () => {
									const skills = document.getElementById(part+'SlotSkills'+document.getElementById(part+'SlotButton').dataset.index);
									skills.innerHTML = '';
									matches[k]['skills'].forEach((val) => {
										skills.innerHTML = '<p>'+val['level']+' &times; '+val['skillName']+'</p>';
									});
									document.getElementById(part+'SlotMenu').style.display = 'none';
								}
							}
						})
						.catch(err => console.error(err));
				};

				// Displays set bonus
				const skills = [];
				try {
					const setRaw = await fetch('https://mhw-db.com/armor/sets/'+armor['armorSet']['id']);
					if(!setRaw.ok) throw new Error('Failed to access armor set data.');
					const set = await setRaw.json();
					if(set['bonus'] != null) {
						console.log(set['bonus']);
						skills.push(set['bonus']['name']);
					}
				} catch(err) {
					console.error(err);
				}

				// Displays armor skills
				armor['skills'].forEach((element) => skills.push('<p>'+element['level']+' &times; '+element['skillName']+'</p>'));
				document.getElementById(part+'Skills').innerHTML = skills.join('');
			} else {
				// Displays charm skills
				const skills = [];
				armor['ranks'].pop()['skills'].forEach((element) => skills.push('<p>'+element['level']+' &times; '+element['skillName']+'</p>'));
				document.getElementById(part+'Skills').innerHTML = skills.join('');
			}
		})
		.then(updateSetInfo)
		.catch((err) => console.error(err));
}

// Updates displayed info for armor set
function updateSetInfo() {
	document.getElementById('setDef').innerText = setInfo.getDefense();
	document.getElementById('setF').innerText = setInfo.getFire();
	document.getElementById('setW').innerText = setInfo.getWater();
	document.getElementById('setI').innerText = setInfo.getIce();
	document.getElementById('setT').innerText =  setInfo.getThunder();
	document.getElementById('setD').innerText = setInfo.getDragon();
}