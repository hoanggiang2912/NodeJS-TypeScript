const ProductsModel = require('../models/ProductsModel');
// const moment = require('moment');
// const date = moment().format('YYYY-MM-DD HH:mm:ss');

exports.getAll = async (query) => {
    // console.log(query);
    let products = {};
    const limit = 50;
    
    if (query && Object.keys(query).length > 0){
        const { page, idCategory, keyword, viewed, limit } = query;
        const skip = (page - 1) * limit;
        const queries = {};

        if (keyword) {
            queries.title = {
                $regex: new RegExp(keyword, 'i')
            }
        }
        
        if (idCategory) {
            queries.idCategory = idCategory;
        }

        if (viewed == true) {
            products = await ProductsModel.find(queries)
                                        .sort({ viewed: -1 })
                                        .skip(skip)
                                        .limit(limit)
                                        .populate('idCategory', '_id name');
        } else {
            products = await ProductsModel.find(queries)
                                        .skip(skip)
                                        .limit(limit)
                                        .populate('idCategory', '_id name');
        }
    } else {
        products = await ProductsModel.find()
                                    .limit(limit)
                                    .populate('idCategory', '_id name');
    }

    return products;
}

exports.getById = async (id) => {
    const product = await ProductsModel.findById(id)
        .populate('idCategory', '_id name');
    return product;
}

exports.getByIdCategory = async (idCategory) => {
    try {
        const products  = await ProductsModel.find({
            "idCategory": {
                "_id": idCategory
            },
        })

        return products; 
    } catch (error) {
        console.log('Error while getting products by category!');
    }
}

exports.getRecentProducts = async (limit) => {
    const products = await ProductsModel.find()
                        .sort({ date: -1 })
                        .limit(limit);
    return products;
}

exports.getProductsByViews = async (limit) => {
    const products = await ProductsModel.find()
                        .sort({ viewed: -1 })
                        .limit(limit);
    return products;
}

exports.getProductsByName = async (name) => {
    const products = await ProductsModel.find({title: name})
                                    .populate('idCategory', '_id name');
    return products;
}