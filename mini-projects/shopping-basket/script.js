const shopping_basket = ["Chicken", "Rice", "Eggs", "Milk"];

function addItem(item) {
    shopping_basket.push(item);
}

function removeItem(item) {
    const index = shopping_basket.indexOf(item);
    if (index > -1) {
        shopping_basket.splice(index, 1);
    } else {
        console.log(`Item "${item}" not found in the shopping basket.`);
    }
}

function showBasket() {
    console.log("Shopping Basket Contents:");
    shopping_basket.forEach(function(item) {
        console.log("- " + item);
    });
    console.log(`Total items: ${shopping_basket.length}`);
}

showBasket();

addItem("Bread");

showBasket();

removeItem("Eggs");

showBasket();

removeItem("Bananas");

showBasket();