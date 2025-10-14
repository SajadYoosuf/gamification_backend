
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
    // Category: {
    //     type: String,
    //     enum: ['Student','Employee'],
    //     default: 'Student'
    // },
    Aadhar: { type: String, required: true },
    PAN: { type: String },
    BloodGroup: { type: String, required: true}, 
    JoiningDate: { type: Date, required: true },
    Email: { type: String, required: true, unique: true },
    Course: { type: String, required: true},
     Password: { type: String },
     EmergencyContactName: { type: String, required: true },
    EmergencyNumber: { type: String, required: true },
    Relationship: { type: String, required: true },
    fee: { type: [feeSchema], default:[] }
}, { timestamps: true });






const StudentModel = mongoose.model('User', userSchema);

module.exports = { StudentModel };
