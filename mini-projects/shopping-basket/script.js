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

const addItemForm = document.getElementById("addItemForm")

const nameInput = document.getElementById("name")
const priceInput = document.getElementById("price")
const quantityInput = document.getElementById("quantity")
const addItemButton = document.getElementById("addItem")
const list = document.getElementById("list")
const totalItems = document.getElementById("totalItems")
const totalPriceElement = document.getElementById("totalPrice")

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
                removeItem(item.name);
            }

            renderList();
        });

        const quantity = document.createElement("span");
        quantity.textContent = `× ${item.quantity}`;

        const increase = document.createElement("button");
        increase.textContent = `+`;

        increase.addEventListener("click", function() {
            item.quantity++;
            renderList();
        });

        const price = document.createElement("span");
        price.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

        const remove = document.createElement("button");
        remove.textContent = "Remove";

        remove.addEventListener("click", function() {
            removeItem(item.name);
            renderList();
        });

        newItem.append(name, decrease, quantity, increase, price, remove);
        list.append(newItem);

    });

    const totalCount = shoppingBasket.reduce(function (total, item) {
        return total + item.quantity
    }, 0);

    totalItems.textContent = `Total Items: ${totalCount}`

    const totalPrice = shoppingBasket.reduce(function (total, item) {
        return total + item.quantity * item.price
    }, 0);

    totalPriceElement.textContent = `Total Price: $${totalPrice.toFixed(2)}`
};

addItemForm.addEventListener("submit", function(event) {
    event.preventDefault()

    let hasErrors = false;
    let itemQuantity = 1;

    if (nameInput.value === "") {
        console.log("Item error")
        hasErrors = true
    }
    if (priceInput.value === "" || priceInput.value <= 0 || !Number(priceInput.value)) {
        console.log("Price error")
        hasErrors = true
    }
    if (quantityInput.value !== "") {
        itemQuantity = quantityInput.value
    }

    if (!hasErrors) {
        addItem(nameInput.value, Number(priceInput.value), Number(itemQuantity))
        nameInput.value = ""
        priceInput.value = ""
        quantityInput.value = ""
        console.log(shoppingBasket)
    }
})


function addItem(name, price, quantity) {
    shoppingBasket.push({
        name: name,
        price: price,
        quantity: quantity
    });
    renderList()
};


function removeItem(name) {
    const index = shoppingBasket.findIndex(function (basketItem) {
        return basketItem.name === name
    })
    if (index === -1) {
        console.log(`Item "${name}" not found in the shopping basket.`);
    } else {
        shoppingBasket.splice(index, 1);
    }
};

renderList();