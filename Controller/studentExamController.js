const studentExamModel = require("../Models/studentExamModel");
const adminExamModel = require("../Models/adminExam");

const submitStudentExam = async (req, res) => {
    const { studentName, examId, answers } = req.body;

    try {
        // Validate the exam exists
        const exam = await adminExamModel.findById(examId);
        if (!exam) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }

        // Optional: Validate number of answers matches number of questions
        if (answers.length !== exam.Questions.length) {
            return res.status(400).json({ 
                success: false, 
                message: `Expected ${exam.Questions.length} answers, got ${answers.length}` 
            });
        }

        // Save student submission
        const submission = await studentExamModel.create({
            studentName,
            examId,
            answers
        });

        res.status(201).json({
            success: true,
            message: "Exam submitted successfully",
            data: submission
        });
    } catch (error) {
        console.error("Error submitting exam:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit exam",
            error: error.message
        });
    }
};


const getExamsByCourse = async (req, res) => {
    const { course } = req.params;

    try {
        const exams = await adminExamModel.find({ Course: course });
        res.status(200).json({ success: true, data: exams });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch exams" });
    }
};



module.exports ={ submitStudentExam, getExamsByCourse};
