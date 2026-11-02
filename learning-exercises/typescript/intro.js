"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// A variable can be declared with a type.
// TypeScript checks that assigned values are compatible with that type.
let userName = "John Doe";
// This causes a type error because userName is declared as a string.
// userName = 92;
// An array type can allow more than one type of value.
// Here, each element can be either a string or a number.
let userIds = ["john_doe", 1234];
userIds.push(5678);
// The variable is typed as Vehicle, so its object must match that structure.
let vehicle = {
    make: "Honda",
    model: "Civic",
    year: 2025,
    rego: "ABC123"
};
const employeeOne = {
    id: 'EMP-101',
    name: "Alice",
    position: "Developer"
};
const employeeTwo = {
    id: 102,
    name: "John"
};
// Functions
// Function parameters can have types, and the return value can have a type.
// This function accepts two numbers and returns a number.
function calculateLoan(amount, rate) {
    return (amount * rate) / 12;
}
calculateLoan(20000, 0.04);
// Exercises
function employeeDetails(employee) {
    return employee.position ?? "Not specified";
}
console.log(employeeDetails(employeeOne));
console.log(employeeDetails(employeeTwo));
function formatEmployeeId(id) {
    return (typeof id === "string" ? id : "EMP-" + id);
}
console.log(formatEmployeeId(employeeOne.id));
console.log(formatEmployeeId(employeeTwo.id));
function describeEmployee(employee) {
    return (employee.position ? `${employee.name} is a ${employee.position}` : `${employee.name} is currently being processed`);
}
console.log(describeEmployee(employeeOne));
console.log(describeEmployee(employeeTwo));
//# sourceMappingURL=intro.js.map