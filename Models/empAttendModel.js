

const mongoose = require("mongoose")

const empAttendSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ['User', 'Employee'],
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
    Breakin:{ type: String },
    Breakout:{ type: String },
    WorkingHours: { type: String }, // store as "03:45:00"
    Leavetype: { type: String },
    Reason: { type: String },
    // Rating: {
    //     type: Number,
    //     min: 1,
    //     max: 5
    // },
    // Review: { type: String }
})
const attendModel = mongoose.model('attend', empAttendSchema);
module.exports = { attendModel }

