const mongoose = require ('mongoose')

const employeeloginSchema = new mongoose.Schema({
    Email:{type:String,required:true},
    Password:{type:String,required:true},
    ConfirmPassword:{type:String,required:true},
})
const emplModel = mongoose.model('Emplogin',employeeloginSchema)

module.exports = {emplModel}
