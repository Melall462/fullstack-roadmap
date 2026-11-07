import type { Vehicle } from "../types/vehicle"

type props = {
    vehicle: Vehicle,
    onEdit: (rego: string) => void,
    editingRego: string | null,
    onCancel: () => void,
    onDelete: (rego: string) => void
}


function VehicleCard({ vehicle, onEdit, editingRego, onCancel, onDelete }: props) {
    return(
        <div className="vehicle-card">
            <p className="vehicle-info">{vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.rego}{vehicle.color && ` - ${vehicle.color}`}</p>
            <p className="vehicle-last-detail">{vehicle.lastDetail ? `Last detail: ${vehicle.lastDetail}` : "Not detailed yet"}</p>
            <p className="vehicle-notes">{vehicle.notes}</p>
            <button
                className="edit-vehicle"
                onClick={() => editingRego === vehicle.rego ? onCancel() : onEdit(vehicle.rego)}
            >
                {"Edit"}
            </button>
            <button
                className="edit-vehicle"
                onClick={() => onDelete(vehicle.rego)}>
                {"Delete"}
            </button>
        </div>
    )
}

export default VehicleCard