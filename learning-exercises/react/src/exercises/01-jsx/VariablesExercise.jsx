function VariablesExercise() {
    const businessName = "Apex Mobile Detailing"
    const owner = "Mehar Lall"
    const totalJobs = 12
    const servicePrice = 110
    const completedJobs = 4
    const firstName = "Angee"
    const lastName = "Ah Loe"
    const regularPrice = 150
    const discount = 25

    return (
        <div>
            <h1>{businessName}</h1>
            <h2>{owner}</h2>
            <h3>{totalJobs}</h3>
            <p>Total Revenue: ${servicePrice * completedJobs}</p>
            <p>{`${firstName + " " + lastName}`}</p>
            <p>Regular Price: ${regularPrice}</p>
            <p>Discount: ${discount}</p>
            <p>Discounted Price: ${regularPrice - discount}</p>
        </div>
    );
}

export default VariablesExercise;