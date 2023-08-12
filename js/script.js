"use strict";

function rollDice(count, modifier = 0) {
    let sum = modifier;
    for (let i = 0; i < count; i++) {
        sum += Math.floor(Math.random() * 6) + 1;
    }
    return sum;
}

class WorlProfile {
    static getRegex() {
        return /^[A-EX][0-9A][0-9A-F][0-9A][0-9A-C][0-9A-F]{2}-[0-9A-G]$/;
    }

    static #hexCharToNumber(hex) {
        const values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G"];
        return values.findIndex((e) => e === hex);
    }

    constructor(uwp, travelZone) {
        uwp = uwp.replaceAll(" ", "");
        uwp = uwp.trim().toUpperCase();

        const uwpRegex = WorlProfile.getRegex();
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

        this.uwp = uwp;
        this.starport = uwp[0];
        this.size = WorlProfile.#hexCharToNumber(uwp[1]);
        this.atmosphere = WorlProfile.#hexCharToNumber(uwp[2]);
        this.hydrographics = WorlProfile.#hexCharToNumber(uwp[3]);
        this.population = WorlProfile.#hexCharToNumber(uwp[4]);
        this.government = WorlProfile.#hexCharToNumber(uwp[5]);
        this.lawLevel = WorlProfile.#hexCharToNumber(uwp[6]);
        this.techLevel = WorlProfile.#hexCharToNumber(uwp[8]);    // skip the hyphen

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
}

class Passengers {
    
    static #highPassengerDm = -4;
    static #middlePassengerDm = 0;
    static #basicPassengerDm = 0;
    static #lowPassengerDm = 1;

    static #effectBrokerCarouseStreetwiseCheck(brokerCarouseStreetwiseSkillLevel) {
        const skillCheck = rollDice(2, Number(brokerCarouseStreetwiseSkillLevel));
        const effect = (skillCheck - 8);    // Average (8+) 

        console.group("The Effect of an Average (8+) Broker, Carouse, or Streetwise check");
        console.log("Skill check (skill level " + brokerCarouseStreetwiseSkillLevel + "): " + skillCheck);
        console.log("Effect: " + effect);
        console.groupEnd();

        return effect;
    }

    static #chiefStewardSkill(chiefStewardSkillLevel) {
        console.log("Chief Steward skill on ship: " + chiefStewardSkillLevel);

        return chiefStewardSkillLevel;
    }

    static #passengerTypeDm(passengerTypeDm) {
        console.log("Passenger type DM: " + passengerTypeDm);

        return passengerTypeDm;
    }

    static #worldPopulationDm(worldProfile) {
        let populationDm = 0;
        if (worldProfile.population <= 1) {
            populationDm = -4;
        }
        else if (worldProfile.population >= 6 && worldProfile.population <= 7) {
            populationDm = 1;
        }
        else if (worldProfile.population >= 8) {
            populationDm = 3;
        }

        console.log("World population (" + worldProfile.population + ") DM: " + populationDm);

        return populationDm;
    }

    static #worldStarportDm(worldProfile) {
        let starportDm = 0;
        switch (worldProfile.starport) {
            case "A":
                starportDm = 2;
                break;
            case "B":
                starportDm = 1;
                break;
            case "E":
                starportDm = -1;
                break;
            case "X":
                starportDm = -3;
                break;
        }

        console.log("Starport (" + worldProfile.starport + ") DM: " + starportDm);

        return starportDm;
    }

    static #worldTravelZoneDm(worldProfile) {
        let travelZoneDm = 0;
        switch (worldProfile.travelZone) {
            case "A":
                travelZoneDm = 1;
                break;
            case "R":
                travelZoneDm = -4;
                break;
        }

        let travelZoneString = "Green";
        if (worldProfile.travelZone === "A") {
            travelZoneString = "Amber";
        } else if (worldProfile.travelZone === "R") {
            travelZoneString = "Red";
        }
        console.log("Travel Zone (" + travelZoneString + ") DM: " + travelZoneDm);

        return travelZoneDm;
    }

    static #sourceWorldDm(sourceWorldProfile) {
        console.group("Source world (" + sourceWorldProfile.uwp + ")");

        let sourceWorldDm =
            Passengers.#worldPopulationDm(sourceWorldProfile) +
            Passengers.#worldStarportDm(sourceWorldProfile) +
            Passengers.#worldTravelZoneDm(sourceWorldProfile);

        console.groupEnd();

        return sourceWorldDm;
    }

    static #destinationWorldDm(destinationWorldProfile) {
        console.group("Destination world (" + destinationWorldProfile.uwp + ")");

        let destinationWorldDm =
            Passengers.#worldPopulationDm(destinationWorldProfile) +
            Passengers.#worldStarportDm(destinationWorldProfile) +
            Passengers.#worldTravelZoneDm(destinationWorldProfile);

        console.groupEnd();

        return destinationWorldDm;
    }

    static #parsecsDm(parecsTravelled) {
        let parsecsDm = 1 - parecsTravelled;

        console.log("Parsecs travelled (" + parecsTravelled + ") DM: " + parsecsDm);

        return parsecsDm;
    }

    static #passengerTrafficDice(trafficTableRoll) {
        if (trafficTableRoll <= 1) {
            return 0;
        }
        else {
            let passengersDice;
            switch (trafficTableRoll) {
                case 2:
                case 3:
                    passengersDice = 1;
                    break;
                case 4:
                case 5:
                case 6:
                    passengersDice = 2;
                    break;
                case 7:
                case 8:
                case 9:
                case 10:
                    passengersDice = 3;
                    break;
                case 11:
                case 12:
                case 13:
                    passengersDice = 4;
                    break;
                case 14:
                case 15:
                    passengersDice = 5;
                    break;
                case 16:
                    passengersDice = 6;
                    break;
                case 17:
                    passengersDice = 7;
                    break;
                case 18:
                    passengersDice = 8;
                    break;
                case 19:
                    passengersDice = 9;
                    break;
                case 20:
                default:
                    passengersDice = 10;
                    break;
            }

            return passengersDice;
        }
    }

    static #availablePassengers(brokerCarouseStreetwiseSkillLevel, chiefStewardSkillLevel, passengerTypeDm, sourceWorldProfile, destinationWorldProfile, parsecsTravelled, miscDm) {
        let passengerTrafficDm =
            Passengers.#effectBrokerCarouseStreetwiseCheck(brokerCarouseStreetwiseSkillLevel) +
            Passengers.#chiefStewardSkill(chiefStewardSkillLevel) +
            Passengers.#passengerTypeDm(passengerTypeDm) +
            Passengers.#sourceWorldDm(sourceWorldProfile) +
            Passengers.#destinationWorldDm(destinationWorldProfile) +
            Passengers.#parsecsDm(parsecsTravelled) +
            miscDm;

        console.log("Misc DM: " + miscDm);

        const passengerTrafficRoll = rollDice(2, passengerTrafficDm);
        console.log("Passenger Traffic roll (with DM " + passengerTrafficDm + "): " + passengerTrafficRoll);

        const passengerTrafficDice = Passengers.#passengerTrafficDice(passengerTrafficRoll);
        console.log("Passenger Traffic table result: " + passengerTrafficDice + (passengerTrafficDice === 0 ? "" : "D"));

        let passengers = 0;
        if (passengerTrafficDice > 0) {
            passengers = rollDice(passengerTrafficDice);
        }

        console.log("Passengers: " + passengers);

        return passengers;
    }

    static availableHighPassengers(brokerCarouseStreetwiseSkillLevel, chiefStewardSkillLevel, sourceWorldProfile, destinationWorldProfile, parsecsTravelled, miscDm) {
        console.group("Seeking High Passengers")

        const passengers = Passengers.#availablePassengers(
            brokerCarouseStreetwiseSkillLevel,
            chiefStewardSkillLevel,
            Passengers.#highPassengerDm,
            sourceWorldProfile,
            destinationWorldProfile,
            parsecsTravelled,
            miscDm);

        console.groupEnd();

        return passengers;
    }

    static availableMiddlePassengers(brokerCarouseStreetwiseSkillLevel, chiefStewardSkillLevel, sourceWorldProfile, destinationWorldProfile, parsecsTravelled, miscDm) {
        console.group("Seeking Middle Passengers")

        const passengers = Passengers.#availablePassengers(
            brokerCarouseStreetwiseSkillLevel,
            chiefStewardSkillLevel,
            Passengers.#middlePassengerDm,
            sourceWorldProfile,
            destinationWorldProfile,
            parsecsTravelled,
            miscDm);

        console.groupEnd();

        return passengers;
    }

    static availableBasicPassengers(brokerCarouseStreetwiseSkillLevel, chiefStewardSkillLevel, sourceWorldProfile, destinationWorldProfile, parsecsTravelled, miscDm) {
        console.group("Seeking Basic Passengers")

        const passengers = Passengers.#availablePassengers(
            brokerCarouseStreetwiseSkillLevel,
            chiefStewardSkillLevel,
            Passengers.#basicPassengerDm,
            sourceWorldProfile,
            destinationWorldProfile,
            parsecsTravelled,
            miscDm);

        console.groupEnd();

        return passengers;
    }

    static availableLowPassengers(brokerCarouseStreetwiseSkillLevel, chiefStewardSkillLevel, sourceWorldProfile, destinationWorldProfile, parsecsTravelled, miscDm) {
        console.group("Seeking Low Passengers")

        const passengers = Passengers.#availablePassengers(
            brokerCarouseStreetwiseSkillLevel,
            chiefStewardSkillLevel,
            Passengers.#lowPassengerDm,
            sourceWorldProfile,
            destinationWorldProfile,
            parsecsTravelled,
            miscDm);

        console.groupEnd();

        return passengers;
    }
}
