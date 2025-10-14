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
    Fullname: { type: String },
    Checkin: { type: Date },
    Checkout: { type: Date },
    Breakin:{ type: String },
    Breakout:{ type: String },
    WorkingHours: { type: String }, // store as "03:45:00"
    Reason: { type: String },
    review: { type: String },
    rating: { type: Number },
});

const studentAttendModel = mongoose.model('studentAttendance', studentAttendSchema);
module.exports = { studentAttendModel };
