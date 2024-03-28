const ProductServices = require('../services/ProductsServices');

exports.getAll = async (query) => {
    const products = await ProductServices.getAll(query);
    return products;
}

exports.getById = async (id) => {
    const product = await ProductServices.getById(id);
    return product;
}

exports.getByIdCategory = async (id) => {
    const products = await ProductServices.getByIdCategory(id);
    return products;
}

exports.getRecentProducts = async (limit) => {
    const products = await ProductServices.getRecentProducts(limit);
    return products;
}

exports.getProductsByViews = async (limit) => {
    const products = await ProductServices.getProductsByViews(limit);
    return products;
}
exports.getProductsByName = async (name) => {
    const products = await ProductServices.getProductsByName(name);
    return products;
}