





const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Age: { type: Number, required: true },
    ContactNumber: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Course: { type: String, required: true},
    Address: { type: String, required: true },
     Password: { type: String, required: true },
}, { timestamps: true });
const userModel = mongoose.model('User', userSchema);





module.exports = { userModel };
