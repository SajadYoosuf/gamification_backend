const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    CourseName:{ type: String, required: true },
    Discription:{ type: String, required: true },
    Duration:{ type: String, required: true },
    Fee:{ type: String, required: true },
    StartDate:{ type: Date },
    EndDate:{ type: Date },
    AssignedMentor:{ type: String },
},{ timestamps: true })
const courseModel = mongoose.model( 'course', courseSchema );

module.exports = { courseModel }