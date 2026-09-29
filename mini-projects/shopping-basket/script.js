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
}

function removeItem(name) {
    const index = shopping_basket.findIndex(function (basketItem) {
        return basketItem.name === name
    })
    if (index === -1) {
        console.log(`Item "${name}" not found in the shopping basket.`);
    } else {
        shopping_basket.splice(index, 1);
    }
}

function showBasket() {
    console.log("Shopping Basket Contents:");
    shopping_basket.forEach(function(item) {
        console.log(`- ${item.name} x${item.quantity}, $${(item.quantity * item.price).toFixed(2)}`);
    });

    const totalCount = shopping_basket.reduce(function (total, product) {
        return total + product.quantity
    }, 0);

    const totalPrice = shopping_basket.reduce(function(total, product) {
        return total + product.price * product.quantity;
    }, 0);


    console.log(`Total items: ${totalCount}`);
    console.log(`Total price: $${totalPrice.toFixed(2)}`);
}

function updateQuantity(name, newQuantity) {
    const item = shopping_basket.find(function (item) {
        return item.name === name
    })

    if (item) {
        item.quantity = newQuantity
    } else {
        console.log(`Item "${name}" not found in the shopping basket.`);
    }
}

showBasket()

addItem("Banana", 1.50, 1);

showBasket()

removeItem("Eggs");

removeItem("Coconut");

showBasket()

updateQuantity("Milk", 2)

updateQuantity("Coconut", 2)

showBasket()