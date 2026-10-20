import { useState } from "react"

function ProductFilterExercise() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [products, setProducts] = useState([
        { id: 1, name: "Nike Shoes", category: "Clothing" },
        { id: 2, name: "Gaming Mouse", category: "Electronics" },
        { id: 3, name: "Nike Hoodie", category: "Clothing" },
        { id: 4, name: "Mechanical Keyboard", category: "Electronics" }
    ])
    const [newProductName, setNewProductName] = useState("")
    const [newProductCategory, setNewProductCategory] = useState("Clothing")
    const [editingId, setEditingId] = useState(null)
    const [editName, setEditName] = useState("")
    const [editCategory, setEditCategory] = useState("Clothing")

    const filteredProducts = products.filter((product) => (
        (selectedCategory === "All" || product.category === selectedCategory) &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ))

    function addProduct() {
        if (newProductName.trim() !== "") {
            const newProduct = {
                id: Date.now(),
                name: newProductName.trim(),
                category: newProductCategory
            }

            setProducts([... products, newProduct])

            setNewProductName("")
            setNewProductCategory("Clothing")
        }
    }

    function deleteProduct(id) {
        setProducts(products.filter((product) => product.id !== id))
    }

    function updateProduct() {
        if (editName.trim() === "") return

        setProducts(products.map((product) =>
            product.id === editingId
                ? {
                    ...product,
                    name: editName.trim(),
                    category: editCategory
                }
                : product
        ))

        setEditingId(null)
    }

    return (
        <div>
            <h1>Product Filter Exercise</h1>

            <div>
                <input type="text" value={searchTerm} placeholder="Search Item" onChange={(event) => setSearchTerm(event.target.value)}/>

                <select name="category" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                    <option value="All">All</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Electronics">Electronics</option>
                </select>

                <button disabled={searchTerm === "" && selectedCategory === "All"} onClick={() => (setSearchTerm(""), setSelectedCategory("All"))}>Reset Search</button>
            </div>

            <div>
                <input type="text" value={newProductName} placeholder="Enter a product name" onChange={(event) => setNewProductName(event.target.value)}/>
                <select name="category" value={newProductCategory} onChange={(event) => setNewProductCategory(event.target.value)}>
                    <option value="Clothing">Clothing</option>
                    <option value="Electronics">Electronics</option>
                </select>
                <button onClick={addProduct}>Add Product</button>
            </div>

            {
                filteredProducts.length === 1 ?
                <p>{filteredProducts.length} product found</p> :
                <p>{filteredProducts.length} products found</p>               
            }

            <ul>

                {
                    filteredProducts.length === 0 ?
                    <li>No products found</li> :
                    filteredProducts.map((product) => (
                        editingId === product.id ?
                        <li key={product.id}>
                            <input type="text" value={editName} onChange={(event) => setEditName(event.target.value)}/> - 
                            <select name="" id="" value={editCategory} onChange={(event) => setEditCategory(event.target.value)}>                    
                                <option value="Clothing">Clothing</option>
                                <option value="Electronics">Electronics</option>
                            </select>
                            <div>
                                <button aria-label={`Delete ${product.name}`} onClick={() => deleteProduct(product.id)}>X</button> 
                                <button onClick={() => updateProduct()}>Submit</button>
                            </div>
                        </li> :
                        <li key={product.id}>{product.name} - {product.category}
                            <div>
                                <button aria-label={`Delete ${product.name}`} onClick={() => deleteProduct(product.id)}>X</button> 
                                <button onClick={() => (setEditingId(product.id), setEditName(product.name), setEditCategory(product.category))}>Edit</button>
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default ProductFilterExercise