



const mongoose = require("mongoose")

const empAttendSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: { type: String, required: true },
    status: {
        type: String,
        enum: ["Present", "Late", "Leave"],
        required: true,
    },
    // Present: { type: String, required: true },
    Checkin: { type: Date },
    Checkout: { type: Date },
    WorkingHours: { type: String }, // store as "03:45:00"
    Leavetype: { type: String },
    From: { type: Date },
    To: { type: Date },
    Reason: { type: String },
    Rating: {
        type: Number,
        min: 1,
        max: 5
    },
    Review: { type: String }
})
const attendModel = mongoose.model('attend', empAttendSchema);
module.exports = { attendModel }

