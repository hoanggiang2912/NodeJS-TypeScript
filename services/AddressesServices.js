const AddressesModel = require('../models/AddressesModel');

exports.getAll = async () => {
    const addresses = await AddressesModel.find({});
    return addresses;
}

exports.getOne = async (id) => {
    const address = await AddressesModel.findById(id);
    return address;
}

exports.getUserAddresses = async (idUser) => {
    const addresses = await AddressesModel.find({ idUser: idUser });
    return addresses;
}

exports.create = async (address) => {
    const newAddress = await AddressesModel.create(address);
    return newAddress;
}

exports.update = async (id, address) => {
    const updatedAddress = await AddressesModel.findByIdAndUpdate(id, address, { new: true });
    return updatedAddress;
}