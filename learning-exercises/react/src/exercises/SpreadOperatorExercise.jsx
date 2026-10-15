function SpreadOperatorExercise() {
    const fruits = ["Apple", "Banana", "Orange"]

    const updatedFruits = [...fruits, "Mango"]

    return (
        <div>
            <div>
                {updatedFruits.map((fruit) => (
                    <div key={fruit}>{fruit}</div>
                ))}
            </div>
        </div>
    )
}

export default SpreadOperatorExercise