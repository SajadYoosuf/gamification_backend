const mongoose = require ('mongoose')

const adminLoginSchema = new mongoose.Schema({
    UserName:{type: String, required:true},
    Password:{type: String ,required:true},
    ConfirmPassword:{type:String,required:true},
})
const adminModel = mongoose.model('Admin',adminLoginSchema);

module.exports = adminModel ;