class armorSet {
    constructor() {
        this.defense = [0, 0, 0, 0, 0];
        this.fire = [0, 0, 0, 0, 0];
        this.water = [0, 0, 0, 0, 0];
        this.ice = [0, 0, 0, 0, 0];
        this.thunder = [0, 0, 0, 0, 0];
        this.dragon = [0, 0, 0, 0, 0];
        this.bonus = [];
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
        if(/^[0-9]+$/.test(this.bonus[input]))
            this.bonus[input] += 1;
        else if(!(input===undefined || input===null))
            this.bonus[input] = 1;
    }

    removeBonus(input) {
        if(/^[1-9]+$/.test(this.bonus[input]))
            this.bonus[input] -= 1;
    }

    getBonus() {
        const active = [];
        for(let val in this.bonus) {
            if(this.bonus[val] >= 1)
                active[val] = this.bonus[val];
        }
        return active;
    }
}