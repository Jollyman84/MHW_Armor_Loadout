document.onload = fetchDefault();

document.getElementById('swapHead').addEventListener('click', () => fetchPartData(11,'head'));
document.getElementById('swapTorso').addEventListener('click', () => fetchPartData(12,'torso'));
document.getElementById('swapArms').addEventListener('click', () => fetchPartData(13,'arms'));
document.getElementById('swapBelt').addEventListener('click', () => fetchPartData(14,'belt'));
document.getElementById('swapLegs').addEventListener('click', () => fetchPartData(15,'legs'));

function fetchDefault() {
	fetchPartData(1,'head');
	fetchPartData(2,'torso');
	fetchPartData(3,'arms');
	fetchPartData(4,'belt');
	fetchPartData(5,'legs');
}

// fetches data for a single armor piece
function fetchPartData(id, part) {
	console.log('fetch');
	fetch('https://mhw-db.com/armor/' + id.toString())
		.then(response => response.json())
		.then(armor => {
			document.getElementById(part+'Img').src = armor['assets']['imageMale'];
			document.getElementById(part+'Def').innerHTML = 'Defense: ' + armor['defense']['base'];
			document.getElementById(part+'F').innerHTML = 'Fire: ' + armor['resistances']['fire'];
			document.getElementById(part+'W').innerHTML = 'Water: ' + armor['resistances']['water'];
			document.getElementById(part+'I').innerHTML = 'Ice: ' + armor['resistances']['ice'];
			document.getElementById(part+'T').innerHTML = 'Thunder: ' + armor['resistances']['thunder'];
			document.getElementById(part+'D').innerHTML = 'Dragon: ' + armor['resistances']['dragon'];
		})
		.catch((err) => console.error(err));
}