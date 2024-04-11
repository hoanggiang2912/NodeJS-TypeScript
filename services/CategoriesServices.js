const CategoriesModel = require('../models/CategoriesModel');
const ProductsModel = require('../models/ProductsModel');

exports.getAll = async () => {
    try {
        const categories = await CategoriesModel.find()
            .populate({
                path: 'products',
                model: ProductsModel
            });

        // const categoriesWithProductAmounts = categories.map(category => ({
        //     ...category._doc,
        //     productAmount: category.products.length
        // }));

        // return categoriesWithProductAmounts;
        return categories;
    } catch (err) {
        console.error(err);
    }
}

exports.getOne = async (id) => {
    const category = await CategoriesModel.findById(id);
    return category;
}

exports.update = async (id, category) => {
    const updatedCategory = await CategoriesModel.updateOne(
        {_id: id}, 
        {
            $set: {
                name: category.name,
                description: category.description
            }
        }
    );
    return updatedCategory;
}

exports.create = async (category) => {
    const newCategory = new CategoriesModel({
        name: category.name,
        banner: category.banner,
        description: category.description
    });

    try {
        const saveCategory = await newCategory.save();
        return saveCategory;
    } catch (error) {
        console.error('Error creating category:', error);
        return {message: error};
    }
}