const quote = document.getElementById("quote");
const services = document.querySelectorAll('input[name="service"]');
const addOns = document.querySelectorAll('input[name="add-on"]');

let serviceTotal = 0;
let addOnTotal = 0;
let total = 0;

function calculateQuote() {

    serviceTotal = 0;

    services.forEach(function(service) {
        if (service.checked) {
            serviceTotal = Number(service.value);
        }
    });

    total = serviceTotal + addOnTotal;
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