const mongoose = require("mongoose")


const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    correctAnswer: { type: String, required: true }, // string-based answer
});

const examSchema = new mongoose.Schema({
    Course: {
        type: String,
        enum: ["MERN Stack", "Python", "Digital Marketing", "Flutter"], 
        required: true
    },
    Category: { type: String },
    ExamTitle: { type: String },
    Discription: { type: String },
    ExamDate: { type: Date },
    NumberofQuestions: { type: Number },
    Questions:[questionSchema]
})
const adminExamModel = mongoose.model('exam', examSchema)
module.exports = adminExamModel;