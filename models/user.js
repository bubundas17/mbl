const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const postSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 1,
        required: true
    },
    username: {
        type: String,
        min: 6,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    meta: {
        email: {type: String, required: true, unique: true}, // Users Can't change it later.
        phone: {type: Number, required: true},
        dateOfBarth: String,
        zebpay: {type: Number},
        paytm: {type: Number},
        joiningDate: {type: Date, default: Date.now} // The Date The user joined to this site.
    },
    bitcoin: {type: String}, // Bitcoin Wallet Address.
    totalReferred: {type: Number, default: 0},    // Maximum 2
    upTree: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}], // Last 10 Users Above him.["Ram", "bubun", "subham", "bubundas17@gmail.com"] etc...
    referedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},   // Name of the user who referred.
    credits: {type: Number, default: 0},
    isAdmin: {type: Boolean, default: false},
    isActive: {type: Boolean, default: false},
    isBanned: {type: Boolean, default: false}
});

postSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', postSchema);
