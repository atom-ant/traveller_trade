function rollDice(count, modifier = 0) {
    let sum = modifier;
    for (let i = 0; i < count; i++) {
        sum += Math.floor(Math.random() * 6) + 1;
    }
    return sum;
}

function getUwpRegex() {
    return /^[A-EX][0-9A][0-9A-F][0-9A][0-9A-C][0-9A-F]{2}-[0-9A-G]$/;
}

function hexCharToNumber(hex) {
    const values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G"];
    return values.findIndex((e) => e === hex);
}

class WorlProfile {
    constructor(uwp, travelZone) {
        uwp = uwp.replaceAll(" ", "");
        uwp = uwp.trim().toUpperCase();

        const uwpRegex = getUwpRegex();
        if (!(uwpRegex.test(uwp))) {
            throw "invalid UWP";
        }

        if (travelZone === undefined) {
            travelZone = "";
        }
        travelZone = travelZone.trim().toUpperCase();
        const tzRegex = /^[AR]{0,1}$/;
        if (!(tzRegex.test(travelZone))) {
            throw "invalid travel zone";
        }

        this.starport = uwp[0];
        this.size = hexCharToNumber(uwp[1]);
        this.atmosphere = hexCharToNumber(uwp[2]);
        this.hydrographics = hexCharToNumber(uwp[3]);
        this.population = hexCharToNumber(uwp[4]);
        this.government = hexCharToNumber(uwp[5]);
        this.lawLevel = hexCharToNumber(uwp[6]);
        this.techLevel = hexCharToNumber(uwp[8]);    // skip dash

        this.tradeCodes = [];
        if ((this.atmosphere >= 4 && this.atmosphere <= 9) &&
            (this.hydrographics >= 8 && this.hydrographics <= 8) &&
            (this.population >= 5 && this.population <= 7)) {
            this.tradeCodes.push("Ag");
        }
        if (this.size === 0 && this.atmosphere === 0 && this.hydrographics === 0) {
            this.tradeCodes.push("As");
        }
        if ((this.atmosphere >= 2 && this.atmosphere <= 9) && this.hydrographics === 0) {
            this.tradeCodes.push("De");
        }
        if ((this.size >= 6 && this.size <= 8) && 
            (this.atmosphere === 5 || this.atmosphere === 6 || this.atmosphere === 8) &&
            (this.hydrographics >= 5 && this.hydrographics <= 7)) {
            this.tradeCodes.push("Ga");
        }
        if (this.population >= 9) {
            this.tradeCodes.push("Hi")
        }
        if (this.techLevel >= 12) {
            this.tradeCodes.push("Ht")
        }
        if ((this.atmosphere >= 0 && this.atmosphere <= 1) && this.hydrographics >= 1) {
            this.tradeCodes.push("Ic");
        }
        if (((this.atmosphere >= 0 && this.atmosphere <= 2) || (this.atmosphere === 4 || this.atmosphere === 7) || (this.atmosphere >= 9 && this.atmosphere <= 12)) &&
            (this.population >= 9)) {
            this.tradeCodes.push("In");
        }
        if (this.population >= 1 && this.techLevel <= 5) {
            this.tradeCodes.push("Lt")
        }
        if (this.population >= 4 && this.population <= 6) {
            this.tradeCodes.push("Ni");
        }
        if ((this.atmosphere >= 2 && this.atmosphere <= 5) &&
            (this.hydrographics >= 0 && this.hydrographics <= 3)) {
            this.tradeCodes.push("Po");
        }
        if ((this.atmosphere === 6 || this.atmosphere === 8) &&
            (this.population >= 6 && this.population <= 8) &&
            (this.government >= 4 && this.government <= 9)) {
            this.tradeCodes.push("Ri");
        }
        if (this.atmosphere === 0) {
            this.tradeCodes.push("Va")
        }
        if (((this.atmosphere >= 3 && this.atmosphere <= 9) || this.atmosphere >= 13) &&
            this.hydrographics >= 10) {
            this.tradeCodes.push("Wa");
        }

        this.travelZone = travelZone;
    }

    passengerTrafficDiceModifier() {
        let dm = 0;

        if (this.population <= 1) {
            dm -= 4;
        }
        else if (this.population >= 6 && this.population <= 7) {
            dm += 1;
        }
        else if (this.population >= 8) {
            dm += 3;
        }

        switch (this.starport) {
            case "A":
                dm += 2;
                break;
            case "B":
                dm += 1;
                break;
            case "E":
                dm -= 1;
                break;
            case "X":
                dm -= 3;
                break;
        }

        switch (this.travelZone) {
            case "A":
                dm += 1;
                break;
            case "R":
                dm -= 4;
                break;
        }

        return dm;
    }
}
