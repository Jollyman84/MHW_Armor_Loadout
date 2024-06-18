// Loads default information upon page load 
document.onload = [
	fetchPartData(1,'head'),
	fetchPartData(2,'torso'),
	fetchPartData(3,'arms'),
	fetchPartData(4,'belt'),
	fetchPartData(5,'legs')
];

// Swaps picture and info for respective armor piece upon button click
['Head','Torso','Arms','Belt','Legs'].forEach((value, index) => {
	const part = value.toLowerCase();
	// Opens modal box for swaping process
	document.getElementById('swap'+value).addEventListener('click', () => {
		//swapArmor(part);
		const modal = document.getElementById(part+'Swap');
		modal.style.display = 'block';
	});

	// Closes madal box
	document.getElementsByClassName('close')[index].onclick = () => {
		document.getElementById(part+'Swap').style.display = 'none';
	};

	document.getElementById(part+'SearchButton').onclick = () => {
		const armor = document.getElementById(part+'Search').value.toLowerCase();
		fetch('./csv/'+part+'_list.csv')
			.then(response => response.text())
			.then(response => response.split('\n'))
			.then(response => response.map((r) => r.split(',')))
			.then((nameList) => {
				let pointer = Math.floor(nameList.length/2);
				for(let hit = true, div = 4, i = 0; hit && i < 15; i++) {
					const focus = nameList[pointer][1].toLowerCase();
					if(focus.startsWith(armor)) hit = false;
					else if(armor > focus) {
						pointer += Math.floor(nameList.length/div);
						div = Math.min(256, div*2);
					} else if(armor < focus) {
						pointer -= Math.floor(nameList.length/div);
						div = Math.min(256, div*2);
					}
					//console.log(focus+' '+pointer);
				}

				while(nameList[Math.max(pointer,0)][1].toLowerCase().startsWith(armor) && pointer >= 0)
					pointer--;
				pointer++;

				const matches = [];
				while(nameList[Math.min(pointer,nameList.length-1)][1].toLowerCase().startsWith(armor) && pointer < nameList.length) {
					matches.push([...nameList[pointer]]);
					pointer++;
				}
				return matches;
			})
			.then((matches) => {
				console.log(matches);
				let options = matches.map((m) => {
					return '<button type="button" class="searchSelection">'+m[1]+'</button>';
				}).join('<br>');
				document.getElementById(part+'SearchResults').innerHTML = options;

				const select = document.getElementsByClassName('searchSelection');
				//console.log(select);
				//console.log(matches);
				for(let k = 0; k < select.length; k++) {
					select[k].onclick = () => {
						console.log('click'); //Cannot read properties of undefined (reading '0') at select.<computed>.onclick (armor_data.js:70:37)
						fetchPartData(matches[k][0],part);
						document.getElementById(part+'Swap').style.display = 'none';
					}
				}
			})
			.catch((err) => console.error(err));
	};
});

// Fetches data for a single armor piece
function fetchPartData(id, part) {
	console.log('fetch, id: %i, part:%s',id,part);
	fetch('https://mhw-db.com/armor/' + id.toString())
		.then(response => response.json())
		.then(armor => {
			switch(armor['assets']) {
				case null:
				case undefined:
					document.getElementById(part+'Img').src = './images/' + part + '-icon.png';
					break;
				default:
					document.getElementById(part+'Img').src = armor['assets']['imageMale'];
					break;
			}
			
			document.getElementById(part+'Name').innerText = armor['name'];
			document.getElementById(part+'Def').innerText = armor['defense']['base'];
			document.getElementById(part+'F').innerText = armor['resistances']['fire'];
			document.getElementById(part+'W').innerText = armor['resistances']['water'];
			document.getElementById(part+'I').innerText = armor['resistances']['ice'];
			document.getElementById(part+'T').innerText =  armor['resistances']['thunder'];
			document.getElementById(part+'D').innerText = armor['resistances']['dragon'];

			let slots = []
			armor['slots'].forEach((element) => {
				slots.push('<img src="images/gem_level_' + element['rank'] +'.png" class="slotIcon">')
			});
			document.getElementById(part+'SlotsInner').innerHTML = slots.join('<br>');
		})
		.catch((err) => console.error(err));
}

// Randomly switches a specific piece of armor
function swapArmor(piece) {
	fetch('./csv/' + piece + '_list.csv')
		.then(response => response.text())
		.then(response => response.split('\n'))
		.then(response => response.map((x) => x.split(',')))
		.then(armor => {
			const index = Math.floor(Math.random()*armor.length);
			console.log(armor[index][0]);
			return armor[index][0];
		})
		.then(id => fetchPartData(id,piece))
		.catch((err) => {
			console.error(err);
			return 1;
		});
}