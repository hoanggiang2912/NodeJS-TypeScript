const UsersServices = require('../services/UsersServices');

exports.getAll = async (req, res, next) => {
    const users = await UsersServices.getAll();
    return users;
}

exports.getById = async (id) => {
    const user = await UsersServices.getById(id);
    return user;
}

exports.getByEmail = async (email) => {
    const user = await UsersServices.getByEmail(email);
    return user;
}

exports.update = async (id, user) => {
    const updatedUser = await UsersServices.update(id, user);
    return updatedUser;
}

exports.delete = async (id) => {
    const user = await UsersServices.delete(id);
    return user;
}

exports.updatePassword = async (id, password) => {
    const updatedUser = await UsersServices.updatePassword(id, password);
    return updatedUser;
}
exports.changePassword = async (id, password) => {
    const updatedUser = await UsersServices.changePassword(id, password);
    return updatedUser;
}

exports.updateRole = async (id, role) => {
    const updatedUser = await UsersServices.updateRole(id, role);
    return updatedUser;
}

exports.create = async (user) => {
    const newUser = await UsersServices.create(user);
    return newUser;
}

