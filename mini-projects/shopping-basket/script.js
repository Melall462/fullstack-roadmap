const shopping_basket = 
    [
        {
            name: "Chicken",
            price: 5.99,
            quantity: 1
        },
        {
            name: "Rice",
            price: 2.49,
            quantity: 2
        },
        {
            name: "Eggs",
            price: 3.99,
            quantity: 1
        },
        {
            name: "Milk",
            price: 4.99,
            quantity: 1
        }
    ];

function addItem(name, price, quantity) {
    shopping_basket.push({
        name: name,
        price: price,
        quantity: quantity
    })
};

function removeItem(name) {
    let found = false
    shopping_basket.forEach(function(item, index) {
        if (item.name === name) {
            shopping_basket.splice(index, 1);
            found = true
        } 

    });
    if (found === false) {
        console.log(`Item "${name}" not found in the shopping basket.`);
    };
};

function showBasket() {
    let count = 0;
    let totalPrice = 0;
    console.log("Shopping Basket Contents:");
    shopping_basket.forEach(function(item) {
        console.log(`- ${item.name} x${item.quantity}, $${(item.quantity * item.price).toFixed(2)}`);
        count += item.quantity
        totalPrice += item.quantity * item.price
    });
    console.log(`Total items: ${count}`);
    console.log(`Total price: $${totalPrice.toFixed(2)}`);
}

function updateQuantity(name, newQuantity) {
    let found = false
    shopping_basket.forEach(function(item) {
        if (item.name === name) {
            item.quantity = newQuantity
            found = true
        } 

    });
    if (found === false) {
        console.log(`Item "${name}" not found in the shopping basket.`);
    };
}

showBasket()

addItem("Banana", 1.50, 1);

showBasket()

removeItem("Eggs");

showBasket()

updateQuantity("Milk", 2)

showBasket()