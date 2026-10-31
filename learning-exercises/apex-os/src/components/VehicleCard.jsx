import "./VehicleCard.css"

function VehicleCard({ vehicle, onEdit, editingRego, onCancel }) {
    return(
        <div className="vehicle-card">
            <p className="vehicle-info">{vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.rego} - {vehicle.color}</p>
            <p className="vehicle-last-detail">{vehicle.lastDetail}</p>
            <p className="vehicle-notes">{vehicle.notes}</p>
            <button
                className="edit-vehicle"
                onClick={() => editingRego === vehicle.rego ? onCancel() : onEdit(vehicle.rego)}
            >
                {editingRego === vehicle.rego ? "Cancel" : "Edit"}
            </button>
        </div>
    )
}

export default VehicleCard