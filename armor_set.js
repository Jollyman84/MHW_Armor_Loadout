class armorSet {
	constructor() {
		this.api = 'https://mhw-armor-loadout-api.onrender.com';
		this.defense = [0, 0, 0, 0, 0];
		this.fire = [0, 0, 0, 0, 0];
		this.water = [0, 0, 0, 0, 0];
		this.ice = [0, 0, 0, 0, 0];
		this.thunder = [0, 0, 0, 0, 0];
		this.dragon = [0, 0, 0, 0, 0];
		this.bonus = [];
		this.skills = new skillList();
	}

	getDefense() {return this.defense.reduce((prev, curr) => prev+curr);}

	getFire() {return this.fire.reduce((prev, curr) => prev+curr);}

	getWater() {return this.water.reduce((prev, curr) => prev+curr);}

	getIce() {return this.ice.reduce((prev, curr) => prev+curr);}

	getThunder() {return this.thunder.reduce((prev, curr) => prev+curr);}

	getDragon() {return this.dragon.reduce((prev, curr) => prev+curr);}

	setStat(part, stat, value) {
		let index;

		switch(part) {
			case 'head':
				index = 0;
				break;
			case 'torso':
				index = 1;
				break;
			case 'arms':
				index = 2;
				break;
			case 'belt':
				index = 3;
				break;
			case 'legs':
				index = 4;
				break;
		}

		switch(stat) {
			case 'defense':
				this.defense[index] = value;
				break;
			case 'fire':
				this.fire[index] = value;
				break;
			case 'water':
				this.water[index] = value;
				break;
			case 'ice':
				this.ice[index] = value;
				break;
			case 'thunder':
				this.thunder[index] = value;
				break;
			case 'dragon':
				this.dragon[index] = value;
				break;
		}
	}

	addBonus(input) {
		if(this.bonus[input['name']] == undefined)
			this.bonus[input['name']] = input;
		
		if(/^[0-9]+$/.test(this.bonus[input['name']]['count']))
			this.bonus[input['name']]['count'] += 1;
		else
			this.bonus[input['name']]['count'] = 1;
	}

	removeBonus(input) {
		if(this.bonus[input] == undefined);
		else if(/^[1-9]+$/.test(this.bonus[input]['count']))
			this.bonus[input]['count'] -= 1;
	}

	getBonus() {
		return Object.entries(this.bonus).filter(x => x[1]['count'] >= 1);
	}

	addSkill(name, level) {
		this.skills[name][2] += level;
	}

	removeSkill(name, level) {
		this.skills[name][2] = Math.max(this.skills[name][2]-level,0);
	}

	getSkills() {
		return Object
			.entries(this.skills)
			.filter(x => x[1][2] >= 1)
			.map(x => [x[0], [x[1][0], x[1][1], Math.min(x[1][2], x[1][1])]])
			.map(x => fetch(`${this.api}/skills?q={"id":${x[1][0]}}&p={"ranks":true,"description":true}`)
				.then(raw => raw.json())
				.then(data => {
					// console.log(data[0]['ranks']);
					return [...x, data[0]['ranks'][x[1][2] - 1]['description']];
				})
				.catch(err => {
					console.error(err);
					return [...x, 'Failed to retrieve description'];
				})
			);
	}
}