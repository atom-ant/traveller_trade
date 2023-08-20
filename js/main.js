"use strict";

function addUwpPatternToHtmlElement(id) {
    const element = document.getElementById(id);

    const regexString = WorlProfile.getRegex().source;
    element.setAttribute("pattern", regexString);
}

addUwpPatternToHtmlElement("sourceUwp");
addUwpPatternToHtmlElement("destinationUwp");

function onChange() {
    const passengersResults = document.getElementById("passengersResults")
    passengersResults.innerHTML = "";
    const viewDetailsMessage = document.getElementById("viewDetailsMessage")
    viewDetailsMessage.hidden = true;
    console.clear();
}

document.getElementById("sourceUwp").addEventListener("change", onChange);
document.getElementById("sourceTravelZone").addEventListener("change", onChange);
document.getElementById("destinationUwp").addEventListener("change", onChange);
document.getElementById("destinationTravelZone").addEventListener("change", onChange);
document.getElementById("parsecsTravelled").addEventListener("change", onChange);
document.getElementById("brokerCarouseStreetwiseDm").addEventListener("change", onChange);
document.getElementById("chiefStewardSkill").addEventListener("change", onChange);
document.getElementById("miscHighDm").addEventListener("change", onChange);
document.getElementById("miscMiddleDm").addEventListener("change", onChange);
document.getElementById("miscBasicDm").addEventListener("change", onChange);
document.getElementById("miscLowDm").addEventListener("change", onChange);

document.getElementById("myForm").onsubmit = function (submitEvent) {
    submitEvent.preventDefault(); // don't submit anything
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
            "High Passengers: " + Passengers.availableHighPassengers(brokerCarouseStreetwiseDm, chiefStewardSkill, srcUwp, destUwp, parsecs, miscHighDm) + "<br>" +
            "Middle Passengers: " + Passengers.availableMiddlePassengers(brokerCarouseStreetwiseDm, chiefStewardSkill, srcUwp, destUwp, parsecs, miscMiddleDm) + "<br>" +
            "Basic Passengers: " + Passengers.availableBasicPassengers(brokerCarouseStreetwiseDm, chiefStewardSkill, srcUwp, destUwp, parsecs, miscBasicDm) + "<br>" +
            "Low Passengers: " + Passengers.availableLowPassengers(brokerCarouseStreetwiseDm, chiefStewardSkill, srcUwp, destUwp, parsecs, miscLowDm);

        const viewDetailsMessage = document.getElementById("viewDetailsMessage")
        viewDetailsMessage.hidden = false;
    }
    catch (err) {
        console.error("Error: " + err);
    }
};
