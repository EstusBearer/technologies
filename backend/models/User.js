const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String, required: true, unique: true,
    }, login: {
        type: String, required: true,
    }, password: {
        type: String, required: true,
    }, bloodType: {
        type: String, required: false,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    }, weight: {
        value: {type: Number, required: false}, unit: {type: String, required: false, default: 'kg'},
    }, height: {
        value: {type: Number, required: false}, unit: {type: String, required: false, default: 'cm'},
    },

});

module.exports = mongoose.model('User', UserSchema);
