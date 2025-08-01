const adminExamModel = require ("../Models/adminExam")
const studentExamModel = require("../Models/studentExamModel");


const createExamByCourse = async (req , res) => {
    const {Course, Category, ExamTitle, Discription, ExamDate, NumberofQuestions, Questions} = req.body;
    try{
        const createExam = await adminExamModel.create({
            Course,
            Category,
            ExamTitle,
            Discription,
            ExamDate,
            NumberofQuestions,
            Questions,
        })

        res.status(201).json({
            success: true,
            message: "Exam created successfully",
            data: createdExam
        });
    }catch(error){
        console.error("Error creating exam:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create exam",
            error: error.message
        });
    }
}






const getExams = async (req ,res) => {
    try{
        const getExam = await adminExamModel.find();
        res.json(getExam)
    }catch(error){
        console.log(error)
        res.status(500).json({ error : 'Internal server error' })
    }
}






const getExamByCourse = async (req, res) => {
    try{
        const _id = req.params.id;
        const getExamCourse = await adminExamModel.findOne({_id});
        if(getExamByCourse){
            res.json(getExamByCourse)
        }else{
            res.status().json('Not fond exams')
        }
    }catch(error){
         console.log(error)
        res.status(500).json({ error : 'Internal server error' })
    }
}






const getAnswersByStudents = async (req, res) => {
    const { examId } = req.params;

    try {
        // Find all student submissions for the given exam
        const submissions = await studentExamModel
            .find({ examId })
            .populate('examId', 'ExamTitle Course Category') // optional: populate exam details
            .sort({ submittedAt: -1 });

        if (!submissions || submissions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No submissions found for this exam."
            });
        }

        res.status(200).json({
            success: true,
            data: submissions
        });

    } catch (error) {
        console.error("Error fetching student answers:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch student answers",
            error: error.message
        });
    }
};





const evaluateStudentExam = async (req, res) => {
    const { submissionId } = req.params;

    try {
        const submission = await studentExamModel.findById(submissionId);
        if (!submission) return res.status(404).json({ message: "Submission not found" });

        const exam = await adminExamModel.findById(submission.examId);
        if (!exam) return res.status(404).json({ message: "Exam not found" });

        let marks = 0;

        // Auto evaluation: compare answers
        submission.answers.forEach((studentAns) => {
            const correctQ = exam.Questions.find(
                (q) => q.questionText === studentAns.questionText
            );

            if (correctQ && correctQ.correctAnswer.trim().toLowerCase() === studentAns.studentAnswer.trim().toLowerCase()) {
                marks += 1; // or 2, 5 etc. based on your marking scheme
            }
        });

        submission.totalMarks = marks;
        submission.isEvaluated = true;
        await submission.save();

        res.status(200).json({
            success: true,
            message: "Evaluation completed",
            totalMarks: marks,
            student: submission.studentName
        });

    } catch (error) {
        res.status(500).json({ message: "Evaluation failed", error: error.message });
    }
};






module.exports = { createExamByCourse, getExams,getExamByCourse ,evaluateStudentExam , getAnswersByStudents}