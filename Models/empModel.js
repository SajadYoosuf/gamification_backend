const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
    Salary: { type: String },
    datee: { type: String },
})

const employeeSchema = new mongoose.Schema({
    Fullname: { type: String, required: true },
    Address: { type: String, required: false },
    
    ContactNumber: { type: String, required: true },
    AadharNumber: { type: String, required: false },
    PAN: { type: String, required: false },
    JoiningDate: { type: String, required: true },
    Blood: { type: String, required: false },
    Designation: {
        type: [String],
        enum: ['Developer & Mentor',
    'Digital Marketer & Mentor',
    'Business Development',
    'HR',
    'UI/UX & Mentor',],
        required: true
    },
    CourseAssained: { type: String, required: true },
    Email: { type: String, required: true },
    Password: { type: String, required: true },
    EmergencyContactName: { type: String },
    EmergencyNumber: { type: String, required: false },
    Relationship: { type: String, required: false },
    salary: { type: [salarySchema], default: [] }
}, { timestamps: true });

const employeeModel = mongoose.model('Employee', employeeSchema);

module.exports = { employeeModel };
