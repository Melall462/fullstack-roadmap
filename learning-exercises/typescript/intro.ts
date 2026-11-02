// A variable can be declared with a type.
// TypeScript checks that assigned values are compatible with that type.
let userName: string = "John Doe";

// This causes a type error because userName is declared as a string.
// userName = 92;

// An array type can allow more than one type of value.
// Here, each element can be either a string or a number.
let userIds: (string | number)[] = ["john_doe", 1234];

userIds.push(5678);

// Objects

// A type alias defines a reusable description of a value's type.
// This one describes the properties an object must have.
type Vehicle = {
    make: string;
    model: string;
    year: number;
    rego: string;
};

// A union of string literal types allows only these exact values.
type Positions = "Developer" | "Engineer" | "Intern";

// An interface describes the expected structure of an object.
// Like an object type alias, it can define required and optional properties.
// The question mark means position may be omitted.
// If provided, its value must match one of the Positions.
interface Employee {
    id: number | string;
    name: string;
    position?: Positions;
}

// The variable is typed as Vehicle, so its object must match that structure.
let vehicle: Vehicle = {
    make: "Honda",
    model: "Civic",
    year: 2025,
    rego: "ABC123"
};

const employeeOne: Employee = {
    id: 'EMP-101',
    name: "Alice",
    position: "Developer"
};

const employeeTwo: Employee = {
    id: 102,
    name: "John"
};

// Functions

// Function parameters can have types, and the return value can have a type.
// This function accepts two numbers and returns a number.
function calculateLoan(amount: number, rate: number): number {
    return (amount * rate) / 12;
}

calculateLoan(20000, 0.04);

// Exercises

function employeeDetails(employee: Employee): string {
    return employee.position ?? "Not specified"
}

console.log(employeeDetails(employeeOne))
console.log(employeeDetails(employeeTwo))

function formatEmployeeId(id: string | number): string {
    return (typeof id === "string" ? id : "EMP-" + id)
}

console.log(formatEmployeeId(employeeOne.id))
console.log(formatEmployeeId(employeeTwo.id))

function describeEmployee(employee: Employee): string {
    return (employee.position ? `${employee.name} is a ${employee.position}` : `${employee.name} is currently being processed`)
}

console.log(describeEmployee(employeeOne))
console.log(describeEmployee(employeeTwo))