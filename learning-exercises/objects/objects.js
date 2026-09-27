//Creating an object

const car = {
    make: "Toyota",
    model: "Camry",
    year: 2020
};

//Accessing object properties

console.log(car)

console.log(car.make);
console.log(car["model"]);
console.log(car.year);  

//Modifying object properties

//Changing the value of an existing property
car.year = 2021;

//Adding a new property to the object
car.color = "blue";

//Deleting a property from the object
delete car.model;

//Methods in objects

const person = {
    firstName: "John",
    lastName: "Doe",
    fullName: function() {
        return this.firstName + " " + this.lastName;
    }
};

//Objects as function parameters

function showCar(car) {
    console.log(`Car Make: ${car.make}`);
    console.log(`Car Model: ${car.model}`);
    console.log(`Car Year: ${car.year}`);
    console.log(`Car Color: ${car.color}`);
}

//Arrays of objects

const cars = [
    {
        make: "Honda",
        model: "Civic",
        year: 2019
    },
    {
        make: "Ford",
        model: "Mustang",
        year: 2021
    },
    {
        make: "Chevrolet",
        model: "Camaro",
        year: 2020
    }
];

//Looping through an array of objects

for (let i = 0; i < cars.length; i++) {
    console.log(`Car ${i + 1}: ${cars[i].make} ${cars[i].model} (${cars[i].year})`);
}

//Destructuring objects

const { make, model, year } = car;
console.log(`Destructured Car: ${make} ${model} (${year})`);



showCar(car);

console.log(person.fullName());