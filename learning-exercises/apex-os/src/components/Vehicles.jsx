import { useState, useEffect } from "react"
import VehicleCard from "./VehicleCard"
import "./Vehicles.css"

function Vehicles() {

    const [searchTerm, setSearchTerm] = useState("")
    const [vehicles, setVehicles] = useState(() => {
        const savedVehicles = JSON.parse(localStorage.getItem("vehicles"));
        if (savedVehicles !== null) {
            return savedVehicles
        } else {
            return [
                {make: "Toyota", model: "Corolla", year: 2018, rego: "ABC123", customerId: "1", color: "White", lastDetail: "2026-10-15", notes: "None"},
                {make: "Honda", model: "Civic", year: 2024, rego: "DEF456", customerId: "2", color: "Red", lastDetail: "2026-8-22", notes: "Pet hair on back seat"}
            ]
        }
    })

    useEffect(() => {
        localStorage.setItem("vehicles", JSON.stringify(vehicles))
    }, [vehicles])

    const [make, setMake] = useState("")
    const [model, setModel] = useState("")
    const [year, setYear] = useState("")
    const [rego, setRego] = useState("")
    const [error, setError] = useState("")
    const [editingRego, setEditingRego] = useState(null)

    const normalizedSearch = searchTerm.toLowerCase().trim()

    const filteredVehicles = vehicles.filter((vehicle) => (
        vehicle.rego.toLowerCase().includes(normalizedSearch) ||
        vehicle.make.toLowerCase().includes(normalizedSearch) ||
        vehicle.model.toLowerCase().includes(normalizedSearch)
    ))

    function addVehicle(event) {
        event.preventDefault()
        setError("")
        if (make.trim() === "" || model.trim() === "" || year === "" || rego.trim() === "") {
            setError("Please fill in all required fields")
            return
        }

        const formattedMake = make.charAt(0).toUpperCase() + make.slice(1).toLowerCase()
        const formattedModel = model.charAt(0).toUpperCase() + model.slice(1).toLowerCase()
        const formattedRego = rego.toUpperCase()

        if (vehicles.some((vehicle) => (
            vehicle.rego === formattedRego && vehicle.rego !== editingRego
        ))) {
            setError("Vehicle already added")
            return
        }

        if (editingRego) {
            setVehicles(vehicles.map((vehicle) => {
                if (vehicle.rego === editingRego) {
                    const newVehicle = {...vehicle, 
                        make: formattedMake, 
                        model: formattedModel, 
                        year,
                        rego: formattedRego}
                    return (
                        newVehicle
                    )
                }
                return vehicle
            }
        ))
        } else {
            const newVehicle = {make: formattedMake, model: formattedModel, year, rego: formattedRego, customerId: "", color: "Black", lastDetail: "2026-10-29", notes: "None"}
            setVehicles([...vehicles, newVehicle])
        }
        setMake("")
        setModel("")
        setYear("")
        setRego("")
        setEditingRego(null)
    }

    function handleEditVehicle(rego) {
        const vehicle = vehicles.find((vehicle) => vehicle.rego === rego)

        if (vehicle) {
            setMake(vehicle.make)
            setModel(vehicle.model)
            setYear(vehicle.year)
            setRego(vehicle.rego)
            setEditingRego(rego)
        }
    }

    function handleCancelEdit() {
        setMake("")
        setModel("")
        setYear("")
        setRego("")
        setEditingRego(null)
        setError("")
    }

    return(
        <div>
            <h1>Vehicles</h1>
            <input className="vehicle-search" placeholder="Search Vehicle..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}></input>
            <form className="add-vehicle" onSubmit={addVehicle}>
                <input className="vehilce-input" placeholder="Make" value={make} onChange={(event) => setMake(event.target.value)}></input>
                <input className="vehilce-input" placeholder="Model" value={model} onChange={(event) => setModel(event.target.value)}></input>
                <input className="vehilce-input" placeholder="Year" value={year} onChange={(event) => setYear(event.target.value)}></input>
                <input className="vehilce-input" placeholder="Rego" value={rego} onChange={(event) => setRego(event.target.value)}></input>
                {!editingRego ?
                <button className="add-vehicle-button" type="submit">Add Vehicle</button> :
                <button className="vehilce-input" type="submit">Update</button>
                }
            </form>
            {error !== "" && <p>{error}</p>}
            {
                filteredVehicles.length === 0 ?
                <p>No vehicles found</p> :    
                <div>
                    {filteredVehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.rego} vehicle={vehicle} onEdit={handleEditVehicle} editingRego={editingRego} onCancel={handleCancelEdit}/>
                    ))}
                </div>
            }
        </div>
    )
}

export default Vehicles