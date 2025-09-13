
const mongoose = require('mongoose');

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
     Password: { type: String, required: true },
     EmergencyContactName: { type: String, required: true },
    EmergencyNumber: { type: String, required: true },
    Relationship: { type: String, required: true },
}, { timestamps: true });
const userModel = mongoose.model('User', userSchema);



module.exports = { userModel };
