const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {type: Number},
    method: {type: Number, required: true}, // 1 for Bank And 2 for Recharge, 3 For Bitcoin
    bank: {
        payee: String, // payee Name
        bank: String, // Name of the bank
        accountNumber: Number, // Bank account number
        ifsc: {type: String}, // Ifsc Code
    },
    recharge: {
        number: Number,
    },
    bitcoin: {
        walletAddress: String
    },
    // Bitcoin Wallet Adress
    status: {type: Number, default: 1}, // 1 = POSSESSING, 2 = SUCCEED, 3 = INVALID, 4 = FAILED
    message: {type: String}, // message for admin from user
    remarks: {type: String},   // message for user about request details.
    date: {type: Date, default: Date.now} // Timestamp of the request Created.
});


Schema.plugin(mongoosePaginate);
module.exports = mongoose.model('Withdrawal', Schema);