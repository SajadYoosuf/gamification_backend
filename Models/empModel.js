const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    Fullname: { Type: String, required: true },
    Address: { Type: String, required: true },
    ContactNumber: { type: String, required: true },
    AadharNumber: { type: String, required: true },
    PAN: { type: String, required: true },
    JoiningDate: { type: String, required: true },
    Blood: { type: String, required: true },
    Designation: {
        type: [String],
        enum: ['Business Development', 'Mentor', 'HR'],
        required: true
    },
    CourseAssained: { type: String, required: true },
    EmergencyContactName: { type: String, required: true },
    EmergencyNumber: { type: String, required: true },
    Relationship: { type: String, required: true },
}, { timestamps: true });
const employeeModel = mongoose.model('Employee', employeeSchema);

module.exports = { employeeModel }