import * as productServices from "../services/product.services.js";

export const createProduct = async (req, res) => {
    try{
        const data = req.body;
        const files = req.files;
        const sellerId = req.user?.id || req.user?._id
        if(!sellerId){
            res.status(404).json({message: "could not get sellerID"})
        }

        const product = await productServices.createProduct(data, files, sellerId);
        if(!product){
            return res.status(400).json({message: "please input all fields"})
        };
        res.status(201).json({message: "product created successfully", product})

    }catch(error){
        res.status(500).json({message: error.message})
    }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const sellerId = req.user.id; // from protect middleware
    const data = req.body;
    const files = req.files;

    const updatedProduct = await productServices.updateProduct(
      productId,
      files,
      data,
      sellerId
    );

    if (!updatedProduct) {
      return res.status(400).json({ message: "Could not update product" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllProducts = async (req, res) => {
    try{
        const product = await productServices.getAllProducts();
        if(!product){
            return res.status(400).json({message: "could not get all products"})
        }
        res.status(200).json(product)

    }catch(error){
        res.status(500).json({message: error.message})
    }
};

export const getProductById = async (req, res) => {
  try{
    const { id } = req.params;

    const product = await productServices.getProductById(id);
    if(!product){
      return res.status(400).json({message: "could not find product"})
    }
    res.status(200).json({success: true, product})

  }catch(error){
    res.status(500).json({message: error.message})
  }
};

export const deleteProduct = async (req, res) => {
  try{
    const productId = req.params.id;
    const sellerId = req.user?.id

    const product = await productServices.deleteProduct(productId, sellerId)
    if(!product){
      return res.status(400).json({message: "could not delete this product"})
    }
    res.status(200).json({success: true, message: "Successfully deleted product"});
    
  }catch(error){
    res.status(500).json({message: error.message})
  }
};

export const deleteAllProduct = async (req, res) => {
  try{
    const sellerId = req.user?.id || req.user?._id;
    if (!sellerId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const result = await productServices.deleteAllProduct(sellerId);
    
    res.status(200).json({ success: true, message: result.message });

  }catch(error){
    res.status(500).json({message: error.message})
  }
};

export const searchProduct = async (req, res) => {
    try {
        const { name, farmer, location } = req.query;

        const products = await productServices.searchProduct(name, farmer, location);

        if (!products.length) {
            return res.status(404).json({ message: "No search results found" });
        }

        res.status(200).json({ products });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
