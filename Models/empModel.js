const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    Salary: { type: String },
    datee: { type: String },
})

const employeeSchema = new mongoose.Schema({
    Fullname: { type: String, required: true },
    Address: { type: String, required: true },
    
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
    Email: { type: String, required: true },
    Password: { type: String, required: true },
    EmergencyContactName: { type: String },
    EmergencyNumber: { type: String, required: true },
    Relationship: { type: String, required: true },
    salary: { type: [salarySchema], default: [] }
}, { timestamps: true });

const employeeModel = mongoose.model('Employee', employeeSchema);

module.exports = { employeeModel };
