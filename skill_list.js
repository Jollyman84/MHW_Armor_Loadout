class skillList {
	constructor() {
		fetch('./csv/skill_list.csv')
			.then(text => text.text())
			.then(text => text.split(/(?:\r\n|\n|\\n)/i).slice(1))
			.then(skills => skills.forEach(element => {
				const line = element.split(',');
				this[line.shift()] = line.map(x => parseInt(x));
			}));
	}
}