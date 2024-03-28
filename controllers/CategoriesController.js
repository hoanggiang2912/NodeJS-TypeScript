const CategoriesServices = require('../services/CategoriesServices.js');

exports.getAll = async () => {
    const categories = CategoriesServices.getAll();
    return categories;
}

exports.getOne = async (id) => {
    const category = await CategoriesServices.getOne(id);
    return category;
}

exports.update = async (id, category) => {
    const updatedCategory = await CategoriesServices.update(id, category);
    return updatedCategory;
}

exports.create = async (category) => {
    const newCategory = await CategoriesServices.create(category);
    return newCategory;
}