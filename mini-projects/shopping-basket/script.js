const shoppingBasket = 
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

const input = document.getElementById("input")
const addItemButton = document.getElementById("addItem")
const list = document.getElementById("list")

function renderList() {
    list.innerHTML = "";
    shoppingBasket.forEach(function(item) {
        const newItem = document.createElement("li");

        const name = document.createElement("span");
        name.textContent = item.name;

        const decrease = document.createElement("button");
        decrease.textContent = `-`;

        decrease.addEventListener("click", function() {
            item.quantity--;

            if (item.quantity <= 0) {
                removeItem(item.name)
            }

            renderList()
        })

        const quantity = document.createElement("span");
        quantity.textContent = `× ${item.quantity}`;

        const increase = document.createElement("button");
        increase.textContent = `+`;

        increase.addEventListener("click", function() {
            item.quantity++;
            renderList()
        })

        const price = document.createElement("span");
        price.textContent = `$${item.price}`;

        const remove = document.createElement("button");
        remove.textContent = "Remove";

        remove.addEventListener("click", function() {
            removeItem(item.name)
            renderList()
        });

        newItem.append(name, decrease, quantity, increase, price, remove);
        list.append(newItem);
    });
}

function addItem(name, price, quantity) {
    shoppingBasket.push({
        name: name,
        price: price,
        quantity: quantity
    })
}


function removeItem(name) {
    const index = shoppingBasket.findIndex(function (basketItem) {
        return basketItem.name === name
    })
    if (index === -1) {
        console.log(`Item "${name}" not found in the shopping basket.`);
    } else {
        shoppingBasket.splice(index, 1);
    }
}

function showBasket() {
    console.log("Shopping Basket Contents:");
    shoppingBasket.forEach(function(item) {
        console.log(`- ${item.name} x${item.quantity}, $${(item.quantity * item.price).toFixed(2)}`);
    });

    const totalCount = shoppingBasket.reduce(function (total, product) {
        return total + product.quantity
    }, 0);

    const totalPrice = shoppingBasket.reduce(function(total, product) {
        return total + product.price * product.quantity;
    }, 0);


    console.log(`Total items: ${totalCount}`);
    console.log(`Total price: $${totalPrice.toFixed(2)}`);
}

function updateQuantity(name, newQuantity) {
    const item = shoppingBasket.find(function (item) {
        return item.name === name
    })

    if (item) {
        item.quantity = newQuantity
    } else {
        console.log(`Item "${name}" not found in the shopping basket.`);
    }
}

renderList()

// showBasket()

// addItem("Banana", 1.50, 1);

// showBasket()

// removeItem("Eggs");

// removeItem("Coconut");

// showBasket()

// updateQuantity("Milk", 2)

// updateQuantity("Coconut", 2)

// showBasket()