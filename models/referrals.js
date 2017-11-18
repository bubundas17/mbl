const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Schema = new mongoose.Schema({
    user: { // Object Id of the user who referred.
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    refUser: { // Object id of the user referring to.
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: Number, // The amount given for referring the user.
    description: String, // Some Texts
    level: {type: Number}, // Range 1 to 10
    date: {type: Date, default: Date.now} // The Date Of the entry made.
});

Schema.plugin(mongoosePaginate);
module.exports = mongoose.model('Referrals', Schema);
/*
    NOTE: This Schema is also used to keep track of level if each user.
 */
