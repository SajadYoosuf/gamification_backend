
const mongoose = require('mongoose');

const authLoginSchema = new mongoose.Schema({
	Email: { type: String, required: true },
	Password: { type: String, required: true },
});

const loginModel = mongoose.model('UserLogin', authLoginSchema);

module.exports = { loginModel };

