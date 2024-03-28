const BillsServices = require('../services/BillsServices');

exports.getAll = async () => {
    const bills = await BillsServices.getAll();
    return bills;
}

exports.getById = async (idBill) => {
    const bill = await BillsServices.getById(idBill);
    return bill;
}

exports.getByUserId = async (userId) => {
    const bills = await BillsServices.getByUserId(userId);
    return bills;
}

exports.create = async (bill) => {
    const newBill = await BillsServices.create(bill);
    return newBill;
}

exports.update = async (id, bill) => {
    const updatedBill = await BillsServices.update(id, bill);
    return updatedBill;
}

exports.delete = async (id) => {
    const removedBill = await BillsServices.delete(id);
    return removedBill;
}