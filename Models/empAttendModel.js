

const mongoose = require("mongoose")

const empAttendSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,

        // Mongoose does not accept an array for `ref`.
        // This attendance model is used for employees, so reference the "Employee" model.
        // If you need polymorphic refs in future, use `refPath` with an accompanying type field.
        ref: 'Employee',
        required: true
    },
    date: { type: String, required: true },
    Fullname: { type: String },
    status: {
        type: String,
        enum: ["Present", "Late", "Leave"],
        required: true,
    },
    Checkin: { type: Date },
    Checkout: { type: Date },
    Breakin:{ type: String },
    Breakout:{ type: String },
    WorkingHours: { type: String }, // store as "03:45:00"
    Leavetype: { type: String },
    Reason: { type: String },
  
})
const attendModel = mongoose.model('employeeAttendance', empAttendSchema);
module.exports = { attendModel };

