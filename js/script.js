// SPDX-FileCopyrightText: © 2023 atom-ant
// SPDX-License-Identifier: MIT

"use strict";

function rollDice(count, modifier = 0) {
    let sum = modifier;
    for (let i = 0; i < count; i++) {
        sum += Math.floor(Math.random() * 6) + 1;
    }
    return sum;
}

class WorldProfile {
    constructor(uwp, travelZone) {
        uwp = uwp.replaceAll(" ", "");
        uwp = uwp.trim().toUpperCase();

        const uwpRegex = /^[A-EX][0-9A][0-9A-F][0-9A][0-9A-C][0-9A-F]{2}-[0-9A-G]$/;
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
        this.size = WorldProfile.#hexCharToNumber(uwp[1]);
        this.atmosphere = WorldProfile.#hexCharToNumber(uwp[2]);
        this.hydrographics = WorldProfile.#hexCharToNumber(uwp[3]);
        this.population = WorldProfile.#hexCharToNumber(uwp[4]);
        this.government = WorldProfile.#hexCharToNumber(uwp[5]);
        this.lawLevel = WorldProfile.#hexCharToNumber(uwp[6]);
        this.techLevel = WorldProfile.#hexCharToNumber(uwp[8]);    // skip the hyphen

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

    static #hexCharToNumber(hex) {
        const values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G"];
        return values.findIndex((e) => e === hex);
    }
}

class Passengers {
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
    
    static creditsPerHighPassenger(parsecsTravelled) {
        let credits = 0;
        switch (parsecsTravelled) {
            case 1:
                credits = 9000;
                break;
            case 2:
                credits = 14000;
                break;
            case 3:
                credits = 21000;
                break;
            case 4:
                credits = 34000;
                break;
            case 5:
                credits = 60000;
                break;
            case 6:
                credits = 210000;
                break;
        }
        
        return credits;
    }

    static creditsPerMiddlePassenger(parsecsTravelled) {
        let credits = 0;
        switch (parsecsTravelled) {
            case 1:
                credits = 6500;
                break;
            case 2:
                credits = 10000;
                break;
            case 3:
                credits = 14000;
                break;
            case 4:
                credits = 23000;
                break;
            case 5:
                credits = 40000;
                break;
            case 6:
                credits = 130000;
                break;
        }
        
        return credits;
    }

    static creditsPerBasicPassenger(parsecsTravelled) {
        let credits = 0;
        switch (parsecsTravelled) {
            case 1:
                credits = 2000;
                break;
            case 2:
                credits = 3000;
                break;
            case 3:
                credits = 5000;
                break;
            case 4:
                credits = 8000;
                break;
            case 5:
                credits = 14000;
                break;
            case 6:
                credits = 55000;
                break;
        }
        
        return credits;
    }

    static creditsPerLowPassenger(parsecsTravelled) {
        let credits = 0;
        switch (parsecsTravelled) {
            case 1:
                credits = 700;
                break;
            case 2:
                credits = 1300;
                break;
            case 3:
                credits = 2200;
                break;
            case 4:
                credits = 3900;
                break;
            case 5:
                credits = 7200;
                break;
            case 6:
                credits = 27000;
                break;
        }
        
        return credits;
    }

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

        const sourceWorldDm =
            Passengers.#worldPopulationDm(sourceWorldProfile) +
            Passengers.#worldStarportDm(sourceWorldProfile) +
            Passengers.#worldTravelZoneDm(sourceWorldProfile);

        console.groupEnd();

        return sourceWorldDm;
    }

    static #destinationWorldDm(destinationWorldProfile) {
        console.group("Destination world (" + destinationWorldProfile.uwp + ")");

        const destinationWorldDm =
            Passengers.#worldPopulationDm(destinationWorldProfile) +
            Passengers.#worldStarportDm(destinationWorldProfile) +
            Passengers.#worldTravelZoneDm(destinationWorldProfile);

        console.groupEnd();

        return destinationWorldDm;
    }

    static #parsecsDm(parecsTravelled) {
        const parsecsDm = 1 - parecsTravelled;

        console.log("Parsecs (" + parecsTravelled + ") DM: " + parsecsDm);

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
        const passengerTrafficDm =
            Passengers.#effectBrokerCarouseStreetwiseCheck(brokerCarouseStreetwiseSkillLevel) +
            Passengers.#chiefStewardSkill(chiefStewardSkillLevel) +
            Passengers.#passengerTypeDm(passengerTypeDm) +
            Passengers.#sourceWorldDm(sourceWorldProfile) +
            Passengers.#destinationWorldDm(destinationWorldProfile) +
            Passengers.#parsecsDm(parsecsTravelled) +
            miscDm;

        console.log("Misc DM: " + miscDm);
        console.log("Passenger Traffic DM: " + passengerTrafficDm);

        const passengerTrafficRoll = rollDice(2, passengerTrafficDm);
        console.log("Passenger Traffic roll (DM " + passengerTrafficDm + "): " + passengerTrafficRoll);

        const passengerTrafficDice = Passengers.#passengerTrafficDice(passengerTrafficRoll);
        console.log("Passenger Traffic Table result: " + passengerTrafficDice + (passengerTrafficDice === 0 ? "" : "D"));

        let passengers = 0;
        if (passengerTrafficDice > 0) {
            passengers = rollDice(passengerTrafficDice);
        }

        console.log("Passengers: " + passengers);

        return passengers;
    }

    static #highPassengerDm = -4;
    static #middlePassengerDm = 0;
    static #basicPassengerDm = 0;
    static #lowPassengerDm = 1;
}

class Freight {
    static availableMajorCargoLots(brokerStreetwiseSkillLevel, sourceWorldProfile, destinationWorldProfile, parsecsTravelled, miscDm) {
        console.group("Major Cargo Lots")

        const lots = Freight.#availableCargoLots(
            brokerStreetwiseSkillLevel,
            Freight.#majorCargoDm,
            sourceWorldProfile,
            destinationWorldProfile,
            parsecsTravelled,
            miscDm);

        console.groupEnd();

        return lots;
    }

    static availableMinorCargoLots(brokerStreetwiseSkillLevel, sourceWorldProfile, destinationWorldProfile, parsecsTravelled, miscDm) {
        console.group("Minor Cargo Lots")

        const lots = Freight.#availableCargoLots(
            brokerStreetwiseSkillLevel,
            Freight.#minorCargoDm,
            sourceWorldProfile,
            destinationWorldProfile,
            parsecsTravelled,
            miscDm);

        console.groupEnd();

        return lots;
    }

    static availableIncidentalCargoLots(brokerStreetwiseSkillLevel, sourceWorldProfile, destinationWorldProfile, parsecsTravelled, miscDm) {
        console.group("Incidental Cargo Lots")

        const lots = Freight.#availableCargoLots(
            brokerStreetwiseSkillLevel,
            Freight.#incidentalCargoDm,
            sourceWorldProfile,
            destinationWorldProfile,
            parsecsTravelled,
            miscDm);

        console.groupEnd();

        return lots;
    }

    static majorCargoLotSize() {
        const size = rollDice(1) * 10;
        console.log("Major Cargo Lot Size (tons): " + size);
        return size;
    }

    static minorCargoLotSize() {
        const size = rollDice(1) * 5;
        console.log("Minor Cargo Lot Size (tons): " + size);
        return size;
    }

    static incidentalCargoLotSize() {
        const size = rollDice(1);
        console.log("Incidental Cargo Lot Size (tons): " + size);
        return size;
    }

    static freightTrafficDm(brokerStreetwiseSkillLevel, cargoTypeDm, sourceWorldProfile, destinationWorldProfile, parsecsTravelled, miscDm) {
        const freightTrafficDm =
            Freight.#effectBrokerStreetwiseCheck(brokerStreetwiseSkillLevel) +
            Freight.#cargoTypeDm(cargoTypeDm) +
            Freight.#sourceWorldDm(sourceWorldProfile) +
            Freight.#destinationWorldDm(destinationWorldProfile) +
            Freight.#parsecsDm(parsecsTravelled) +
            miscDm;

        console.log("Misc DM: " + miscDm);
        console.log("Freight Traffic DM: " + freightTrafficDm);

        return freightTrafficDm;
    }

    static creditsPerTon(parsecsTravelled) {
        let credits = 0;
        switch (parsecsTravelled) {
            case 1:
                credits = 1000;
                break;
            case 2:
                credits = 1600;
                break;
            case 3:
                credits = 2600;
                break;
            case 4:
                credits = 4400;
                break;
            case 5:
                credits = 8500;
                break;
            case 6:
                credits = 32000;
                break;
        }

        return credits;
    }

    static #effectBrokerStreetwiseCheck(brokerStreetwiseSkillLevel) {
        const skillCheck = rollDice(2, Number(brokerStreetwiseSkillLevel));
        const effect = (skillCheck - 8);    // Average (8+) 

        console.group("The Effect of an Average (8+) Broker or Streetwise check");
        console.log("Skill check (skill level " + brokerStreetwiseSkillLevel + "): " + skillCheck);
        console.log("Effect: " + effect);
        console.groupEnd();

        return effect;
    }

    static #cargoTypeDm(cargoTypeDm) {
        console.log("Cargo type DM: " + cargoTypeDm);

        return cargoTypeDm;
    }

    static #worldPopulationDm(worldProfile) {
        let populationDm = 0;
        if (worldProfile.population <= 1) {
            populationDm = -4;
        }
        else if (worldProfile.population >= 6 && worldProfile.population <= 7) {
            populationDm = 2;
        }
        else if (worldProfile.population >= 8) {
            populationDm = 4;
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

    static #worldTechLevelDm(worldProfile) {
        let techLevelDm = 0;
        if (worldProfile.techLevel <= 6) {
            techLevelDm = -1;
        }
        else if (worldProfile.techLevel >= 9) {
            techLevelDm = 2;
        }

        console.log("World Tech Level (" + worldProfile.techLevel + ") DM: " + techLevelDm);

        return techLevelDm;
    }

    static #worldTravelZoneDm(worldProfile) {
        let travelZoneDm = 0;
        switch (worldProfile.travelZone) {
            case "A":
                travelZoneDm = -2;
                break;
            case "R":
                travelZoneDm = -6;
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

        const sourceWorldDm =
            Freight.#worldPopulationDm(sourceWorldProfile) +
            Freight.#worldStarportDm(sourceWorldProfile) +
            Freight.#worldTechLevelDm(sourceWorldProfile) +
            Freight.#worldTravelZoneDm(sourceWorldProfile);

        console.groupEnd();

        return sourceWorldDm;
    }

    static #destinationWorldDm(destinationWorldProfile) {
        console.group("Destination world (" + destinationWorldProfile.uwp + ")");

        const destinationWorldDm =
            Freight.#worldPopulationDm(destinationWorldProfile) +
            Freight.#worldStarportDm(destinationWorldProfile) +
            Freight.#worldTechLevelDm(destinationWorldProfile) +
            Freight.#worldTravelZoneDm(destinationWorldProfile);

        console.groupEnd();

        return destinationWorldDm;
    }

    static #parsecsDm(parecsTravelled) {
        const parsecsDm = 1 - parecsTravelled;

        console.log("Parsecs (" + parecsTravelled + ") DM: " + parsecsDm);

        return parsecsDm;
    }

    static #freightTrafficDice(trafficTableRoll) {
        if (trafficTableRoll <= 1) {
            return 0;
        }
        else {
            let freightDice;
            switch (trafficTableRoll) {
                case 2:
                case 3:
                    freightDice = 1;
                    break;
                case 4:
                case 5:
                    freightDice = 2;
                    break;
                case 6:
                case 7:
                case 8:
                    freightDice = 3;
                    break;
                case 9:
                case 10:
                case 11:
                    freightDice = 4;
                    break;
                case 12:
                case 13:
                case 14:
                    freightDice = 5;
                    break;
                case 15:
                case 16:
                    freightDice = 6;
                    break;
                case 17:
                    freightDice = 7;
                    break;
                case 18:
                    freightDice = 8;
                    break;
                case 19:
                    freightDice = 9;
                    break;
                case 20:
                default:
                    freightDice = 10;
                    break;
            }

            return freightDice;
        }
    }

    static #availableCargoLots(brokerStreetwiseSkillLevel, cargoTypeDm, sourceWorldProfile, destinationWorldProfile, parsecsTravelled, miscDm) {
        const freightTrafficDm = Freight.freightTrafficDm(brokerStreetwiseSkillLevel, cargoTypeDm, sourceWorldProfile, destinationWorldProfile, parsecsTravelled, miscDm);

        const freightTrafficRoll = rollDice(2, freightTrafficDm);
        console.log("Freight Traffic roll (DM " + freightTrafficDm + "): " + freightTrafficRoll);

        const freightTrafficDice = Freight.#freightTrafficDice(freightTrafficRoll);
        console.log("Freight Traffic Table result: " + freightTrafficDice + (freightTrafficDice === 0 ? "" : "D"));

        let cargoLots = 0;
        if (freightTrafficDice > 0) {
            cargoLots = rollDice(freightTrafficDice);
        }

        console.log("Cargo Lots: " + cargoLots);

        return cargoLots;
    }

    static #majorCargoDm = -4;
    static #minorCargoDm = 0;
    static #incidentalCargoDm = 2;
}

class Mail {
    static availableMailContainers(brokerStreetwiseSkillLevel, sourceWorldProfile, destinationWorldProfile, parsecsTravelled, miscDm, shipArmed, highestNavalScoutRank, highestSocDm) {
        console.group("Mail")

        console.group("Freight Traffic DM")
        const freightTrafficDm = Freight.freightTrafficDm(brokerStreetwiseSkillLevel, 0, sourceWorldProfile, destinationWorldProfile, parsecsTravelled, miscDm);
        console.groupEnd();

        const mailDm = 
            Mail.#mailDmfreightTrafficDm(freightTrafficDm) +
            Mail.#shipArmed(shipArmed) +
            Mail.#worldTechLevel(sourceWorldProfile) +
            Mail.#highestNavalScoutRank(highestNavalScoutRank) +
            Mail.#highestSocDm(highestSocDm);

        const mailRoll = rollDice(2, mailDm);

        console.log("Mail roll (DM " + mailDm + "): " + mailRoll);

        let mailAvailable = false;
        if (mailRoll >= 12) {
            mailAvailable = true;
        }

        let containers = 0;
        if (mailAvailable) {
            containers = rollDice(1);
        }

        console.log("Mail containers available: " + containers);

        console.groupEnd();

        return containers;
    }

    static creditsPerContainer() {
        return 25000;
    }

    static #mailDmfreightTrafficDm(freightTrafficDm) {
        let mailDm = 0;
        if (freightTrafficDm <= -10) {
            mailDm = -2;
        } else if (freightTrafficDm >= -9 && freightTrafficDm <= -5) {
            mailDm = -1;
        } else if (freightTrafficDm >= -4 && freightTrafficDm <= 4) {
            mailDm = 0;
        } else if (freightTrafficDm >= 5 && freightTrafficDm <= 9) {
            mailDm = 1;
        } else if (freightTrafficDm >= 10) {
            mailDm = 2;
        }

        console.log("Mail Freight Traffic (" + freightTrafficDm + ") DM: " + mailDm);

        return mailDm;
    }

    static #shipArmed(armed) {
        let mailDm = 0;
        if (!!armed) {
            mailDm = 2;
        }

        console.log("Ship Armed (" + !!armed + ") DM: " + mailDm);

        return mailDm;
    }

    static #worldTechLevel(sourceWorldProfile) {
        let mailDm = 0
        if (sourceWorldProfile.techLevel <= 5) {
            mailDm = -4;
        }

        console.log("World TL (" + sourceWorldProfile.techLevel + ") DM: " + mailDm);

        return mailDm;
    }

    static #highestNavalScoutRank(highestNavalScoutRank) {
        console.log("Highest Naval or Scout rank: " + highestNavalScoutRank);

        return highestNavalScoutRank;
    }

    static #highestSocDm(highestSocDm) {
        console.log("Highest SOC DM: " + highestSocDm);

        return highestSocDm;
    }
}
