const BillsModel = require('../models/BillsModel');

exports.getAll = async () => {
    const bills = await BillsModel.find({})
                                .populate('products.idProduct', '_id name price qty')
                                .populate('idUser', '_id name');
    return bills;
}

exports.getById = async (id) => {
    const bill = await BillsModel.findById(id);
    return bill;
}

exports.getByUserId = async (userId) => {
    const bills = await BillsModel.find({ idUser: userId })
                                .populate('products.idProduct', '_id name price qty')
                                .populate('idUser', '_id name');
    return bills;
}

exports.create = async (bill) => {
    const newBill = await BillsModel.create(bill);
    return newBill;
}

exports.update = async (id, bill) => {
    const updatedBill = await BillsModel.findByIdAndUpdate(id, bill, { new: true });
    return updatedBill;
}

exports.delete = async (id) => {
    const removedBill = await BillsModel.findByIdAndDelete(id);
    return removedBill;
}