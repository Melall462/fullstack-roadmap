const form = document.getElementById("trackerForm");

const customerCheck = document.getElementById("customerCheck")
const vehicleCheck = document.getElementById("vehicleCheck")
const serviceCheck = document.getElementById("serviceCheck")
const priceCheck = document.getElementById("priceCheck")
const jobList = document.getElementById("jobList")
const totalJobs = document.getElementById("totalJobs")
const totalRevenue = document.getElementById("totalRevenue")

const jobs = 
    [

    ]

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const newJob = getFormData()

    const hasError = validateForm(newJob)

    if (!hasError) {
        addJob(newJob)
        clearForm()
        renderJobs()
    }
});

function getFormData () {
    const customer = form.elements.customer.value;
    const vehicle = form.elements.vehicle.value;
    const service = form.elements.service.value;
    const price = Number(form.elements.price.value);

    return {
        customer,
        vehicle,
        service,
        price
    };
}

function validateForm(newJob) {
    let hasError = false;

    if (newJob.customer === "") {
        customerCheck.textContent = "Please enter a customer"
        hasError = true
    } else {
        customerCheck.textContent = ""
    }

    if (newJob.vehicle === "") {
        vehicleCheck.textContent = "Please enter a vehicle"
        hasError = true
    } else {
        vehicleCheck.textContent = ""
    }

    if (newJob.service === "") {
        serviceCheck.textContent = "Please select a service"
        hasError = true
    } else {
        serviceCheck.textContent = ""
    } 

    if (newJob.price <= 0) {
        priceCheck.textContent = "Please enter a price"
        hasError = true
    } else {
        priceCheck.textContent = ""
    }
    
    return hasError
}

function addJob(job) {
    jobs.push(job)
}

function clearForm() {
    form.reset()
}

function renderJobs() {
    jobList.innerHTML = ""

    let totalJobsCount = 0

    jobs.forEach(function(job) {
        totalJobsCount += 1

        const newJob = document.createElement("li")

        const customer = document.createElement("span")
        customer.textContent = job.customer

        const vehicle = document.createElement("span")
        vehicle.textContent = job.vehicle

        const service = document.createElement("span")
        
        if (job.service === "exteriorDetail") {
            service.textContent = "Exterior Detail"
        } else if (job.service === "interiorDetail") {
            service.textContent = "Interior Detail"
        } else if (job.service === "fullDetail") {
            service.textContent = "Full Detail"
        }

        const price = document.createElement("span")
        price.textContent = `$${(job.price).toFixed(2)}`

        const deleteItem = document.createElement("button")
        deleteItem.textContent = "Delete"

        deleteItem.addEventListener("click", function() {
            deleteJob(job)
            renderJobs()
        })

        newJob.append(customer, vehicle, service, price, deleteItem)

        jobList.append(newJob)
    })

    totalJobs.textContent = `Total Jobs: ${jobs.length}`

    const totalRevenueCount = jobs.reduce(function(total, job) {
        return total + job.price;
    }, 0);

    totalRevenue.textContent = `Total Revenue: $${totalRevenueCount.toFixed(2)}`;
}

function deleteJob(jobToDelete) {
    const index = jobs.findIndex(function (job) {
        return job === jobToDelete
    })

    jobs.splice(index, 1)
}

function totals() {

}