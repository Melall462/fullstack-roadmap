import type { Vehicle } from "../types/vehicle"
import { daysSince, formatDate } from "../utils/date"

type Props = {
    vehicle: Vehicle,
    ownerName: string,
    jobCount: number,
    onEdit: (vehicleId: number) => void,
    onDelete: (vehicleId: number) => void
}

function VehicleCard({ vehicle, ownerName, jobCount, onEdit, onDelete }: Props) {
    return(
        <div className="vehicle-card">
            <p className="vehicle-info">{vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.rego}{vehicle.color && ` - ${vehicle.color}`}</p>
            <p className="muted">Owner: {ownerName || "None"}</p>
            <p className="vehicle-last-detail">
                {vehicle.lastDetail ?
                    `Last detail: ${formatDate(vehicle.lastDetail)} (${daysSince(vehicle.lastDetail)} days ago)` :
                    "Not detailed yet"}
            </p>
            <p className="muted">{jobCount} job{jobCount === 1 ? "" : "s"}</p>
            {vehicle.notes && <p className="vehicle-notes">{vehicle.notes}</p>}
            <button className="edit-vehicle" onClick={() => onEdit(vehicle.id)}>Edit</button>
            <button className="edit-vehicle" onClick={() => onDelete(vehicle.id)}>Delete</button>
        </div>
    )
}

export default VehicleCard
