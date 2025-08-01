const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    questionId: mongoose.Schema.Types.ObjectId,
    questionText: String,
    studentAnswer: String
});

const studentExamSchema = new mongoose.Schema({
    studentName: String,
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "exam" },
    answers: [answerSchema],
    totalMarks: { type: Number, default: 0 },
    isEvaluated: { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now }
});


const studentExamModel = mongoose.model('studentExam', studentExamSchema);
module.exports = studentExamModel;


