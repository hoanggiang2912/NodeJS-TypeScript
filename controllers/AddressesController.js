const AddressesServices = require('../services/AddressesServices');

exports.getAll = async (req, res, next) => {
    const addresses = await AddressesServices.getAll();
    return addresses;
}

exports.getById = async (id) => {
    const address = await AddressesServices.getOne(id);
    return address;
}

exports.getUserAddresses = async (idUser) => {
    const addresses = await AddressesServices.getUserAddresses(idUser);
    return addresses;
}

exports.create = async (address) => {
    const newAddress = await AddressesServices.create(address);
    return newAddress;
}

exports.update = async (id, address) => {
    const updatedAddress = await AddressesServices.update(id, address);
    return updatedAddress;
}