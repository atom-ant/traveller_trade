"use strict";

function addUwpPatternToHtmlElement(id) {
    const element = document.getElementById(id);

    // allow string from "Traveller Map" with spaces and Unicode dash
    const regexString = /^[A-EX]\s?[0-9A]\s?[0-9A-F]\s?[0-9A]\s?[0-9A-C]\s?[0-9A-F]\s?[0-9A-F]\s?[\-\u2013]\s?[0-9A-G]$/.source;
    element.setAttribute("pattern", regexString);
}

addUwpPatternToHtmlElement("sourceUwp");
addUwpPatternToHtmlElement("destinationUwp");

function onPassengerChange() {
    const passengersResults = document.getElementById("passengersResults")
    passengersResults.innerHTML = "";
    const viewDetailsMessage = document.getElementById("viewDetailsMessage")
    viewDetailsMessage.hidden = true;
    console.clear();
}

function onFreightChange() {
    const freightResults = document.getElementById("freightResults")
    freightResults.innerHTML = "";
    const freightViewDetailsMessage = document.getElementById("freightViewDetailsMessage")
    freightViewDetailsMessage.hidden = true;
    console.clear();
}

function onMailChange() {
    const mailResults = document.getElementById("mailResults")
    mailResults.innerHTML = "";
    const mailViewDetailsMessage = document.getElementById("mailViewDetailsMessage")
    mailViewDetailsMessage.hidden = true;
    console.clear();
}

function onCommonChange() {
    onPassengerChange();
    onFreightChange();
    onMailChange();
}

function onUwpChange(event) {
    let value = event.target.value;
    value = value.replace(/\s/g, "");       // remove spaces
    value = value.replace(/\u2013/g, "-");  // replace Unicode dash by regular hyphen
    event.target.value = value;
    onCommonChange();
}

document.getElementById("sourceUwp").addEventListener("change", onUwpChange);
document.getElementById("sourceTravelZone").addEventListener("change", onCommonChange);
document.getElementById("destinationUwp").addEventListener("change", onUwpChange);
document.getElementById("destinationTravelZone").addEventListener("change", onCommonChange);
document.getElementById("parsecsTravelled").addEventListener("change", onCommonChange);

document.getElementById("brokerCarouseStreetwiseDm").addEventListener("change", onPassengerChange);
document.getElementById("chiefStewardSkill").addEventListener("change", onPassengerChange);
document.getElementById("miscHighDm").addEventListener("change", onPassengerChange);
document.getElementById("miscMiddleDm").addEventListener("change", onPassengerChange);
document.getElementById("miscBasicDm").addEventListener("change", onPassengerChange);
document.getElementById("miscLowDm").addEventListener("change", onPassengerChange);

document.getElementById("freightBrokerStreetwiseDm").addEventListener("change", onFreightChange);
document.getElementById("freightMiscMajorDm").addEventListener("change", onFreightChange);
document.getElementById("freightMiscMinorDm").addEventListener("change", onFreightChange);
document.getElementById("freightMiscIncidentalDm").addEventListener("change", onFreightChange);

document.getElementById("mailBrokerStreetwiseDm").addEventListener("change", onMailChange);
document.getElementById("mailHighestNavalOrScoutRank").addEventListener("change", onMailChange);
document.getElementById("mailHighestSocDm").addEventListener("change", onMailChange);
document.getElementById("mailShipArmed").addEventListener("change", onMailChange);
document.getElementById("mailMisc").addEventListener("change", onMailChange);

function rollForPassengers() {
    const passengersResults = document.getElementById("passengersResults")
    passengersResults.innerHTML = "";
    console.clear();
    try {
        const srcUwp = new WorlProfile(document.getElementById("sourceUwp").value, document.getElementById("sourceTravelZone").value);
        const destUwp = new WorlProfile(document.getElementById("destinationUwp").value, document.getElementById("destinationTravelZone").value);

        const brokerCarouseStreetwiseDm = Number(document.getElementById("brokerCarouseStreetwiseDm").value);
        const chiefStewardSkill = Number(document.getElementById("chiefStewardSkill").value);
        const parsecs = Number(document.getElementById("parsecsTravelled").value);

        const miscHighDm = Number(document.getElementById("miscHighDm").value);
        const miscMiddleDm = Number(document.getElementById("miscMiddleDm").value);
        const miscBasicDm = Number(document.getElementById("miscBasicDm").value);
        const miscLowDm = Number(document.getElementById("miscLowDm").value);

        passengersResults.innerHTML =
            "High Passengers: " + Passengers.availableHighPassengers(brokerCarouseStreetwiseDm, chiefStewardSkill, srcUwp, destUwp, parsecs, miscHighDm) + "<br />" +
            "Middle Passengers: " + Passengers.availableMiddlePassengers(brokerCarouseStreetwiseDm, chiefStewardSkill, srcUwp, destUwp, parsecs, miscMiddleDm) + "<br />" +
            "Basic Passengers: " + Passengers.availableBasicPassengers(brokerCarouseStreetwiseDm, chiefStewardSkill, srcUwp, destUwp, parsecs, miscBasicDm) + "<br />" +
            "Low Passengers: " + Passengers.availableLowPassengers(brokerCarouseStreetwiseDm, chiefStewardSkill, srcUwp, destUwp, parsecs, miscLowDm);

        const viewDetailsMessage = document.getElementById("viewDetailsMessage")
        viewDetailsMessage.hidden = false;
    }
    catch (err) {
        console.error("Error: " + err);
    }
}

function rollForFreight() {
    const freightResults = document.getElementById("freightResults")
    freightResults.innerHTML = "";
    console.clear();
    try {
        const srcUwp = new WorlProfile(document.getElementById("sourceUwp").value, document.getElementById("sourceTravelZone").value);
        const destUwp = new WorlProfile(document.getElementById("destinationUwp").value, document.getElementById("destinationTravelZone").value);

        const brokerStreetwiseDm = Number(document.getElementById("freightBrokerStreetwiseDm").value);
        const parsecs = Number(document.getElementById("parsecsTravelled").value);

        const miscMajorDm = Number(document.getElementById("freightMiscMajorDm").value);
        const miscMinorDm = Number(document.getElementById("freightMiscMinorDm").value);
        const miscIncidentalDm = Number(document.getElementById("freightMiscIncidentalDm").value);

        freightResults.innerHTML =
            "Major Cargo: " + Freight.availableMajorCargoLots(brokerStreetwiseDm, srcUwp, destUwp, parsecs, miscMajorDm) + " lots of size " + Freight.majorCargoLotSize() + " tons<br />" +
            "Minor Cargo: " + Freight.availableMinorCargoLots(brokerStreetwiseDm, srcUwp, destUwp, parsecs, miscMinorDm) + " lots of size " + Freight.minorCargoLotSize() + " tons<br />" +
            "Incidental Cargo: " + Freight.availableIncidentalCargoLots(brokerStreetwiseDm, srcUwp, destUwp, parsecs, miscIncidentalDm) + " lots of size " + Freight.incidentalCargoLotSize() + " tons";

        const freightViewDetailsMessage = document.getElementById("freightViewDetailsMessage")
        freightViewDetailsMessage.hidden = false;
    }
    catch (err) {
        console.error("Error: " + err);
    }
}

function rollForMail() {
    const mailResults = document.getElementById("mailResults")
    mailResults.innerHTML = "";
    console.clear();
    try {
        const srcUwp = new WorlProfile(document.getElementById("sourceUwp").value, document.getElementById("sourceTravelZone").value);
        const destUwp = new WorlProfile(document.getElementById("destinationUwp").value, document.getElementById("destinationTravelZone").value);

        const brokerStreetwiseSkillLevel = Number(document.getElementById("mailBrokerStreetwiseDm").value);
        const parsecs = Number(document.getElementById("parsecsTravelled").value);

        const miscDm = Number(document.getElementById("mailMisc").value);
        const shipArmed = document.getElementById("mailShipArmed").checked;
        const highestNavalScoutRank = Number(document.getElementById("mailHighestNavalOrScoutRank").value);
        const highestSocDm = Number(document.getElementById("mailHighestSocDm").value);

        const containers = Mail.availableMailContainers(brokerStreetwiseSkillLevel, srcUwp, destUwp, parsecs, miscDm, shipArmed, highestNavalScoutRank, highestSocDm);

        mailResults.innerHTML =
            "Mail containers available: " + containers + (containers > 0 ? " of up to five tons each" : "");

        const mailViewDetailsMessage = document.getElementById("mailViewDetailsMessage")
        mailViewDetailsMessage.hidden = false;
    }
    catch (err) {
        console.error("Error: " + err);
    }
}

document.getElementById("myForm").onsubmit = function (submitEvent) {
    submitEvent.preventDefault(); // don't submit anything

    if (submitEvent.submitter.id === "rollForPassengers") {
        rollForPassengers();
    } else if (submitEvent.submitter.id === "rollForFreight") {
        rollForFreight();
    } else if (submitEvent.submitter.id === "rollForMail") {
        rollForMail();
    } else {
        console.error("Error: Unexpected form submit");
    }
};
