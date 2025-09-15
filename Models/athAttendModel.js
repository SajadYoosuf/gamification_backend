const mongoose = require("mongoose")

const studentAttendSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        // This attendance model is for authenticated users (students), so reference the "User" model.
        ref: 'User',
        required: true
    },
    date: { type: String, required: true },
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
    // Leavetype: { type: String },
    Reason: { type: String },
});

const studentAttendModel = mongoose.model('studentAttend', studentAttendSchema);
module.exports = { studentAttendModel };
