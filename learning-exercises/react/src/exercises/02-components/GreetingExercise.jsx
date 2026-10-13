function Greeting() {
    return (
        <div>
            <h1>Welcome to ApexOS</h1>
        </div>
    )
}

function OwnerInfo() {
    return(
        <div>
            <p>Mehar Lall</p>
        </div>
    )
}

function ComponentsExercise() {
    return(
        <div>
            <Greeting />
            <Greeting />
            <OwnerInfo />
        </div>
    )
}

export default ComponentsExercise;