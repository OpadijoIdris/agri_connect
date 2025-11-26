import Product from "../model/productModel.js";
import cloudinary from "../config/cloudinary.js";
import User from "../model/usermodel.js";

export const createProduct = async (data, files, sellerId) => {
    try{
        let { name, description, category, price, quantity, location } = data;
        
        name = name?.trim();
        description = description?.trim();
        category = category?.trim();
        price = price?.trim();
        location = location?.trim();


        if(!name || !description || !category ||!price ||!location ||!quantity){
            throw new Error("all fields are required");

        }

        let imageUrls = [];
        if (files && files.length > 0) {
        for (const file of files) {
            imageUrls.push(file.path); 
        }
        }

        const product = new Product({
        name, 
        description,
        category,
        price,
        quantity,
        images: imageUrls,
        location,
        seller: sellerId
    })
    await product.save();

    const populatedProduct = await product.populate("seller", "name email");
    return populatedProduct;

    }catch(error){
        console.log("error creating product", error);
        throw new Error ("could not create product");
    }
};

export const updateProduct = async (productId, files, data, sellerId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    if (product.seller.toString() !== sellerId.toString()) {
      throw new Error("Unauthorized: you can't edit this product");
    }

    let { name, description, category, price, quantity, location } = data;

    if (name) product.name = name.trim();
    if (description) product.description = description.trim();
    if (category) product.category = category.trim();
    if (price) product.price = price;
    if (quantity) product.quantity = quantity;
    if (location) product.location = location.trim();

    if (files && files.length > 0) {
      const imageUrls = [];

      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "AGRICONNECT/products",
        });
        imageUrls.push(result.secure_url);
      }

      product.images = imageUrls;
    }

    const updatedProduct = await product.save();

    const populatedProduct = await updatedProduct.populate("seller", "name email");

    return populatedProduct;
  } catch (error) {
    console.error("error updating product", error);
    throw new Error("Could not update product");
  }
};

export const getAllProducts = async () => {
    const product = await Product.find();
    return product;
};

export const getProductById = async (id) => {
  const product = await Product.findById(id);
  return product;
};

export const deleteProduct = async (productId, sellerId) => {
  try{
    const product = await Product.findById(productId);
    if(!product){
    throw new Error ("product not found")
    }

  if(product.seller.toString() !== sellerId.toString()){
    throw new Error ("not authorized: you cant delete the product")
  }
  if(product.images && product.images.length > 0){
    for(const imageUrl of product.images){
      try{
        const part = imageUrl.split("/");
        const publicId = part.slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);

      }catch(error){
        console.warn("failed to delete image from cloudinary", error.message)
      }
    }
  }

  await Product.findByIdAndDelete(productId);
  return {message: "product successfully deleted"}


  }catch(error){
    console.log("error deleting product", error);
    throw new Error ("could not delete product")
  }

};

export const deleteAllProduct = async (sellerId) => {
  try{
    const products = await Product.find({ seller: sellerId });

    if (!products || products.length === 0) {
      return { message: "No products found to delete." };
    }

    for (const product of products) {
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          try {
            const part = imageUrl.split("/");
            const publicId = part.slice(-2).join("/").split(".")[0];
            await cloudinary.uploader.destroy(publicId);
          } catch (error) {
            console.warn("failed to delete image from cloudinary", error.message);
          }
        }
      }
    }

    const deleteResult = await Product.deleteMany({ seller: sellerId });
    
    return { message: `Successfully deleted ${deleteResult.deletedCount} products.` };
  }catch(error){
    console.log("error deleting all products", error.message);
    throw new Error ("Could not delete products");
  }
};

export const searchProduct = async (name, farmer, location) => {
    try {
        const query = {};

        if (name) {
            query.name = { $regex: name, $options: "i" };
        }

        if (location) {
            query.location = { $regex: location, $options: "i" }; // FIXED BUG: using location, not name
        }

        if (farmer) {
            const farmers = await User.find({
                role: "Farmer",
                name: { $regex: farmer, $options: "i" }
            }).select("_id");

            const farmerIds = farmers.map(f => f._id);

            query.seller = { $in: farmerIds };
        }

        const products = await Product.find(query)
            .populate("seller", "name email location");

        return products;

    } catch (error) {
        console.log("Error in search product:", error.message);
        throw new Error("Could not search product");
    }
};

