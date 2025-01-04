const Router = require('express').Router;
const productDB = require("../db/productDB.js");

const productRouter = Router();

// POST endpoint to create a product
productRouter.post('/', async (req, res) => {
  if(!productDB.status){
    res.status(500).json({error: "Database not connected"});
    return;
  }

  const {name, description, price} = req.body;
  if(!name || !description || !price){
    res.status(400).json({error: "Missing required fields"});
    return;
  }
  
  try{
    const product = await productDB.addProduct(name, description, price);
    res.status(201).json(product);
  } catch {
    res.status(500).json({error: "Error adding product"});
  }
});

// GET endpoint to get all products
productRouter.get('/', async (req, res) => {
  if(!productDB.status){
    res.status(500).json({error: "Database not connected"});
    return;
  }

  try{
    const products = await productDB.getProducts();
    return res.json({data: products});
  } catch {
    res.status(500).json({error: "Error getting products"});
  }
});


// DELETE endpoint to delete a product
productRouter.delete('/:productId', async (req, res) => {
  if(!productDB.status){
    res.status(500).json({error: "Database not connected"});
    return;
  }

  const productId = req.params.productId;
  if(!productId){
    res.status(400).json({error: "Missing required fields"});
    return;
  }

  try{
    const product = await productDB.deleteProduct(productId);
    if(product){
      res.json(product);
    } else {
      res.status(404).json({error: "Product not found"});
    }
  } catch {
    res.status(500).json({error: "Error deleting product"});
  } 
});

module.exports = productRouter;