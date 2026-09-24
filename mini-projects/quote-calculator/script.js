const quote = document.getElementById("quote");
const services = document.querySelectorAll('input[name="service"]');
const addOns = document.querySelectorAll('input[name="add-on"]');
const dirtiness = document.getElementById("dirtiness");

let serviceTotal = 0;
let addOnTotal = 0;
let dirtinessTotal = 0;
let total = 0;

function calculateQuote() {

    serviceTotal = 0;

    services.forEach(function(service) {
        if (service.checked) {
            serviceTotal = Number(service.value);
        }
    });

    total = serviceTotal + addOnTotal + dirtinessTotal;
    quote.textContent = "$" + total + ".00";
    }

services.forEach(function(service) {
    service.addEventListener("change", function() {
        calculateQuote();
    });
});

addOns.forEach(function(addOn) {

    addOn.addEventListener("change", function() {
        if (addOn.checked) {
            addOnTotal += Number(addOn.value);
        } else {
            addOnTotal -= Number(addOn.value);
        }

        calculateQuote();
    });
});

dirtiness.addEventListener('change', function() {
    if (dirtiness.value <= 2) {
        dirtinessTotal = 0;
    } else if (dirtiness.value <= 5) {
        dirtinessTotal = 10;
    } else if (dirtiness.value <= 8) {
        dirtinessTotal = 20;
    } else if (dirtiness.value <= 11) {
        dirtinessTotal = 30;
    } else {
        dirtinessTotal = 40;
    }

    calculateQuote();
});