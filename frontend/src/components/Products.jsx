import React, {useState, useEffect} from "react";
import { FaTrashAlt } from 'react-icons/fa';
export default function Products() {
  const [products, setProducts] = useState([]);
  const [ name, setName ] = useState('');
  const [ price, setPrice ] = useState('');
  const [ description, setDescription ] = useState('');

  const fetchProducts = async () => {
    const response = await fetch('http://localhost:5000/api/products');
    const data = await response.json();
    setProducts([...data.data]);
  }

  useEffect(() => {
    fetchProducts();
  }, [])

  const addProduct = async () => {
    await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name, price, description})
    });
    fetchProducts();
  };

  const deleteProduct = async (productId) => {
    await fetch(`http://localhost:5000/api/products/${productId}`, {
      method: 'DELETE'
    });
    fetchProducts();
  }

  return(
    <div className="flex flex-col">
      <div className="text-3xl text-center font-bold w-full mt-10">
        Products
      </div>
      <div className="flex justify-center">
        <input type="text" 
            className="p-2 border-2 border-gray-200 rounded-l-lg" 
            placeholder="Product Name" 
            value = {name}
            onChange={(e)=>{setName(e.target.value)}}/>
        <input type="number" className="p-2 border-2 border-gray-200" 
          placeholder="Price" 
          value = {price}
          onChange={(e)=>{setPrice(e.target.value)}}/>
        <input type="text" className="p-2 border-2 border-gray-200" 
          placeholder="Description" 
          value = {description}
          onChange={(e)=>{setDescription(e.target.value)}}/>
        <button className="bg-blue-500 text-white p-2 rounded-r-lg" onClick={addProduct}>
          Add Product
        </button>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5">
        {products.map((product, index) => (
          <div key={index} className="p-4 bg-white shadow-lg rounded-lg relative">
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-700 mb-2">{product.description}</p>
            <p className="text-gray-700 mb-4">${product.price.toFixed(2)}</p>
            <button
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              onClick={() => deleteProduct(product.id)}
            >
              <FaTrashAlt />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}