const fruits = ["apple", "banana", "orange"];

// // Add a new fruit to the end of the array
// fruits.push("coconut");

// // Remove the last fruit from the array
// fruits.pop(); 

// // Add a new fruit to the beginning of the array
// fruits.unshift("mango");

// // Remove the first fruit from the array
// fruits.shift();

console.log(fruits.length);

console.log(fruits.includes("banana"));

fruits.push("watermelon");

fruits.shift();

for (let i = 0; i < fruits.length; i++) {
    console.log(`Fruit ${i + 1}: ${fruits[i]}`);
}