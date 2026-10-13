function handleClick() {
    alert ("Job Added")
}

function Button() {
    return(
        <button onClick={handleClick}>Add Job</button>
    )
}

export default Button