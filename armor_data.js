// Loads default information upon page load 
document.onload = [
	fetchPartData(1,'head'),
	fetchPartData(2,'torso'),
	fetchPartData(3,'arms'),
	fetchPartData(4,'belt'),
	fetchPartData(5,'legs')
];

// Swaps picture and info for respective armor piece upon button click
document.getElementById('swapHead').addEventListener('click', () => swapArmor('head'));
document.getElementById('swapTorso').addEventListener('click', () => swapArmor('torso'));
document.getElementById('swapArms').addEventListener('click', () => swapArmor('arms'));
document.getElementById('swapBelt').addEventListener('click', () => swapArmor('belt'));
document.getElementById('swapLegs').addEventListener('click', () => swapArmor('legs'));

// Fetches data for a single armor piece
function fetchPartData(id, part) {
	console.log('fetch');
	fetch('https://mhw-db.com/armor/' + id.toString())
		.then(response => response.json())
		.then(armor => {
			switch(armor['assets']) {
				case null:
				case undefined:
					document.getElementById(part+'Img').src = './images/missing-image.png';
					break;
				default:
					document.getElementById(part+'Img').src = armor['assets']['imageMale'];
					break;
			}
			
			document.getElementById(part+'Def').innerText = 'Defense: ' + armor['defense']['base'];
			document.getElementById(part+'F').innerText = 'Fire: ' + armor['resistances']['fire'];
			document.getElementById(part+'W').innerText = 'Water: ' + armor['resistances']['water'];
			document.getElementById(part+'I').innerText = 'Ice: ' + armor['resistances']['ice'];
			document.getElementById(part+'T').innerText = 'Thunder: ' + armor['resistances']['thunder'];
			document.getElementById(part+'D').innerText = 'Dragon: ' + armor['resistances']['dragon'];
		})
		.catch((err) => console.error(err));
}

// TODO: Currently switches randomly, find an alternative
// Switches a specific piece of armor
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