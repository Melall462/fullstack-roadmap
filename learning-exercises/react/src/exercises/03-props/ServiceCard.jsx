function Greeting({name}) {
    return(
        <div>
            <h1>Hello, {name}</h1>
        </div>
    )
}

function ServiceCard({name, price, duration}) {
    return(
        <div>
            <h2>{name}</h2>
            <h1>${price}</h1>
            <h3>Duration: {duration} Hours</h3>
        </div>
    )
}

export default ServiceCard