




const { adminLogin } = require('../Controller/adminloginController')
const { createUser, employeeList, profile, employeeDelete, updateprofile } = require('../Controller/authController')

const express = require ('express')
const employeeLogin = require('../Controller/employeeloginController')
const { createAttend, getAttend, getAttendId, getAttendByUserId, getAttendanceReport } = require('../Controller/empAttendController')
const { createExamByCourse, getExams, getExamByCourse, evaluateStudentExam, getAnswersByStudents } = require('../Controller/adminExamController')
const { getExamsByCourse, submitStudentExam } = require('../Controller/studentExamController')


const router = express.Router()

// User management routes
router.route('/').post(createUser)
router.route('/adminlogin').post(adminLogin)
router.route('/employeelogin').post(employeeLogin)
router.route('/list').get(employeeList)
router.route('/profile/:id').get(profile)
router.route('/employeeDelete/:id').delete(employeeDelete)
router.route('/employeeUpdate/:id').put(updateprofile)

// Attendance routes
router.route('/attend/:empID').post(createAttend)
router.route('/attendlist').get(getAttend)
router.route('/getAttendById/:id').get(getAttendId)
router.route('/getAttendByUserId/:userId').get(getAttendByUserId)
router.route('/attendanceReport').get(getAttendanceReport)

// Exam Admin
router.route('/createExam').post(createExamByCourse)
router.route('/getExams').get(getExams)
router.route('/getExamsByCourse').get(getExamByCourse)

router.route('/Evaluate').post(evaluateStudentExam)
router.route('/getAnswers').get(getAnswersByStudents)

// Exam Student
router.route('/getExam').get(getExamsByCourse)
router.route('/submitExam').post(submitStudentExam)


module.exports = router;