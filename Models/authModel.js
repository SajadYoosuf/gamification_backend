
const mongoose = require('mongoose');



    
const feeSchema = new mongoose.Schema({
    Fees: { type: String},
    date: { type: Date},
})


const userSchema = new mongoose.Schema({
    Fullname:{ type: String, required: true},
    Guardian: { type: String, required: true},
    Address: { type: String, required: true },
    ContactNumber: { type: String, required: true },
    GuardianNumber: { type: String, required: true },
    DOB: { type: String, required: true },
   
    Aadhar: { type: String, required: false },
    PAN: { type: String },
    BloodGroup: { type: String, required: false}, 
    JoiningDate: { type: Date, required: true },
    Email: { type: String, required: true, unique: true },
    Course: { type: String, required: true},
     Password: { type: String },
     EmergencyContactName: { type: String, required: false },
    EmergencyNumber: { type: String, required: false },
    Relationship: { type: String, required: false },
    fee: { type: [feeSchema], default:[] }
}, { timestamps: true });






const StudentModel = mongoose.model('User', userSchema);

module.exports = { StudentModel };
