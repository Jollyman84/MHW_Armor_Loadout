// Creates armor set object
const setInfo = new armorSet();
let head, torso, arms, belt, legs, charm;

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
	
	//console.log(checkbox.dataset.sex);
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
			.then(response => response.split(/(?:\r\n|\n|\\n)/i))
			.then(response => response.map(r => r.split(',')))
			.then(nameList => nameList.filter(value => value[1].toLowerCase().startsWith(armor)))
			.then(matches => {
				//console.log(matches);
				document.getElementById(part+'SearchResults').innerHTML = matches.map(m => {
					return `<button type="button" class="partSelection" data-id="${m[0]}">${m[1]}</button>`;
				}).join('<br>');

				document.getElementById(part+'SearchResults').addEventListener('click', element => {
					if(element.target.matches('.partSelection')) {
						//console.log('click');
						fetchPartData(element.target.dataset.id,part);
						document.getElementById(part+'Swap').style.display = 'none';
					}
				});
			})
			.catch(err => console.error(err));
	};

	// Randomly switches a specific piece of armor
	document.getElementById(part+'Random').onclick = () => {
		fetch('./csv/' + part + '_list.csv')
			.then(response => response.text())
			.then(response => response.split(/(?:\r\n|\n|\\n)/i))
			.then(response => response.map(x => x.split(',')))
			.then(armor => {
				const index = Math.floor(Math.random()*armor.length);
				//console.log(armor[index][0]);
				return armor[index][0];
			})
			.then(id => fetchPartData(id,part))
			.then(document.getElementById(part+'Swap').style.display = 'none')
			.catch(err => console.error(err));
	};
});

// Fetches data for a single armor piece
function fetchPartData(id, part) {
	document.getElementsByClassName(part)[0].dataset.id = id;
	//console.log('fetch, id: %i, part:%s',id,part);

	let url;
	if(part === 'charm') url = 'https://mhw-db.com/charms/' + id.toString();
	else url = 'https://mhw-db.com/armor/' + id.toString();

	fetch(url)
		.then(response => response.json())
		.then(async armor => {
			if(part != 'charm') {
				await fetch('https://mhw-db.com/armor/sets/'+armor['armorSet']['id'])
				.then(set => set.json())
				.then(set => {
					if(set['bonus'] != null) {
						//console.log(set['bonus']);
						armor['bonus'] = set['bonus'];
					} else {
						armor['bonus'] = new Object;
						armor['bonus']['id'] = -1;
						armor['bonus']['name'] = 'Empty';
					}
				})
				.catch(err => console.error('Failed to access armor set data.\n' + err));
			}

			function removeSlotSkill(part) {
				let  skills = document.getElementById(part+'SlotSkills0').innerText.split('\n\n');
				skills.push(...document.getElementById(part+'SlotSkills1').innerText.split('\n\n'));
				skills.push(...document.getElementById(part+'SlotSkills2').innerText.split('\n\n'));
				skills = skills.filter(x => x != '');

				//console.log(skills);
				if(skills[0] != '') {
					skills.forEach(x => {
						const t = x.split(' \u00D7 ');
						setInfo.removeSkill(t[1],t[0]);
					});
				}
			}

			switch(part) {
				case 'head':
					if(head != undefined) {
						setInfo.removeBonus(head['bonus']['name']);
						head['skills'].forEach(x => setInfo.removeSkill(x['skillName'], x['level']));
						removeSlotSkill('head');
					}
					head = armor;
					break;
				case 'torso':
					if(torso != undefined) {
						setInfo.removeBonus(torso['bonus']['name']);
						torso['skills'].forEach(x => setInfo.removeSkill(x['skillName'], x['level']));
						removeSlotSkill('torso');
					}
					torso = armor;
					break;
				case 'arms':
					if(arms != undefined) {
						setInfo.removeBonus(arms['bonus']['name']);
						arms['skills'].forEach(x => setInfo.removeSkill(x['skillName'], x['level']));
						removeSlotSkill('arms');
					}
					arms = armor;
					break;
				case 'belt':
					if(belt != undefined) {
						setInfo.removeBonus(belt['bonus']['name']);
						belt['skills'].forEach(x => setInfo.removeSkill(x['skillName'], x['level']));
						removeSlotSkill('belt');
					}
					belt = armor;
					break;
				case 'legs':
					if(legs != undefined) {
						setInfo.removeBonus(legs['bonus']['name']);
						legs['skills'].forEach(x => setInfo.removeSkill(x['skillName'], x['level']));
						removeSlotSkill('legs');
					}
					legs = armor;
					break;
				case 'charm':
					if(charm != undefined) {
						const r = charm['ranks'].length - 1;
						//console.log(charm); 
						charm['ranks'][r]['skills'].forEach(x => setInfo.removeSkill(x['skillName'], x['level']));
					}
					charm = armor;
					break;
			}

			return armor;
		})
		.then(armor => {
			if(part !== 'charm') {
				document.getElementById(part+'SlotSkills0').innerHTML = '';
				document.getElementById(part+'SlotSkills1').innerHTML = '';
				document.getElementById(part+'SlotSkills2').innerHTML = '';
			}
			return armor;
		})
		.then(armor => {
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

				// Passes stats to set object
				setInfo.setStat(part, 'defense',armor['defense']['base']);
				setInfo.setStat(part, 'fire', armor['resistances']['fire']);
				setInfo.setStat(part, 'water', armor['resistances']['water']);
				setInfo.setStat(part, 'ice', armor['resistances']['ice']);
				setInfo.setStat(part, 'thunder', armor['resistances']['thunder']);
				setInfo.setStat(part, 'dragon', armor['resistances']['dragon']);

				// Displays empty slots
				const slots = []
				armor['slots'].forEach((element,index) => {
					let slotButton = `<button class="slotButton" id="${part}Slot${index}" data-rank="${element['rank']}" type="menu">\n`;
					slotButton += `<img src="images/gem_level_${element['rank']}.png" class="slotIcon">\n</button>`;
					slots.push(slotButton);
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

				// Searches database for decorations which contains input string
				document.getElementById(part+'SlotButton').onclick = () => {
					const deco = document.getElementById(part+'SlotSearch').value.toLowerCase();
					fetch('https://mhw-db.com/decorations?q={"slot":' + document.getElementById(part+'SlotButton').dataset.rank + '}')
						.then(response => response.json())
						.then(gems => gems.filter(value => value['name'].toLowerCase().includes(deco)))
						.then(matches => {
							// Displays decorations matching string as buttons
							document.getElementById(part+'SlotResults').innerHTML = matches.map((m,i) => {
								return `<button type="button" class="partSlotSelection" data-index="${i}">${m['name']}</button>`;
							}).join('<br>');
			
							// Onclick respective decorations' info will be injected into armor part and set 
							document.getElementById(`${part}SlotResults`).addEventListener('click', element => {
								if(element.target.matches('.partSlotSelection')) {
									const skills = document.getElementById(part+'SlotSkills'+document.getElementById(part+'SlotButton').dataset.index);
									if(skills.innerHTML != '') {
										skills.innerText.split('\n\n').forEach(x => {
											const t = x.split(' \u00D7 ');
											setInfo.removeSkill(t[1],t[0]);
										});
									}

									skills.innerHTML = '';
									matches[element.target.dataset.index]['skills'].forEach(val => {
										skills.innerHTML += `<p>${val['level']} &times; ${val['skillName']}</p>\n`;
										setInfo.addSkill(val['skillName'],val['level']);
									});

									document.getElementById(part+'SlotMenu').style.display = 'none';
									updateSetInfo();
								}
							});
						})
						.catch(err => console.error(err));
				};

				// Displays set bonus
				const skills = [];
				if(armor['bonus']['name'] !== 'Empty') {
					skills.push(armor['bonus']['name']);
					setInfo.addBonus(armor['bonus']);
				}

				// Displays armor skills
				armor['skills'].forEach(element => {
					skills.push(`<p>${element['level']} &times; ${element['skillName']}</p>`);
					setInfo.addSkill(element['skillName'],element['level']);
				});
				document.getElementById(part+'Skills').innerHTML = skills.join('');
			} else {
				// Displays charm skills
				const skills = [];
				armor['ranks'][armor['ranks'].length-1]['skills'].forEach(element => {
					skills.push(`<p>${element['level']} &times; ${element['skillName']}</p>`);
					setInfo.addSkill(element['skillName'],element['level']);
				});
				document.getElementById(part+'Skills').innerHTML = skills.join('');
			}
		})
		.then(updateSetInfo)
		.catch(err => console.error(err));
}

// Updates displayed info for armor set
async function updateSetInfo() {
	document.getElementById('setDef').innerText = setInfo.getDefense();
	document.getElementById('setF').innerText = setInfo.getFire();
	document.getElementById('setW').innerText = setInfo.getWater();
	document.getElementById('setI').innerText = setInfo.getIce();
	document.getElementById('setT').innerText =  setInfo.getThunder();
	document.getElementById('setD').innerText = setInfo.getDragon();

	document.getElementById('bonus').innerHTML = setInfo.getBonus().map(val => {
		let bonusText = `<p>${val[1]['count']} &times; ${val[0]}<br><span class="description">`;
		bonusText += val[1]['ranks'].map(r => `[${r['pieces']}] ${r['description']}`).join('<br>');
		bonusText += '</span></p>';
		return bonusText
	})
	.join('');

	const setSkills = await setInfo.getSkills();
	const skillText = await Promise.all(setSkills);
	document.getElementById('skillList').innerHTML = skillText
		.map(val => `<p>${val[1][2]} &times; ${val[0]}<br><span class="description">${val[2]}</span></p>`)
		.join('');
}