const Product = require('../models/Product');

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
    const products = await Product.find();
    res.json(products);
};

// GET SINGLE PRODUCT
const getProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
};

// CREATE PRODUCT
const createProduct = async (req, res) => {
    const { name, price, description, image } = req.body;

    if (!name || !price) {
        return res.status(400).json({ message: 'Name and Price are required' });
    }

    const product = await Product.create({
        name,
        price,
        description,
        image
    });

    res.status(201).json(product);
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.image = req.body.image || product.image;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();

    res.json({ message: 'Product deleted' });
};

module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};