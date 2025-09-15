




const { adminLogin } = require('../Controller/adminloginController')
const { createUser, getAllStudents, getStudentById, updateStudent, deleteStudent } = require('../Controller/authController')
const { createEmployee, employeeList, profile: employeeProfile, employeeDelete, updateprofile: employeeUpdate } = require('../Controller/employeeController')

const express = require ('express')
const employeeLogin = require('../Controller/employeeloginController')
 const authLogin = require('../Controller/authLoginController')
const { createAttend, getAttend, getAttendId, getAttendByUserId, getAttendanceReport } = require('../Controller/empAttendController')
const { createAttend: createStudentAttend, getAttend: getStudentAttend, getAttendId: getStudentAttendId, getAttendByUserId: getStudentAttendByUserId, getAttendanceReport: getStudentAttendanceReport } = require('../Controller/studentAttendController')
const { createExamByCourse, getExams, getExamByCourse, evaluateStudentExam, getAnswersByStudents } = require('../Controller/adminExamController')
const { getExamsByCourse, submitStudentExam } = require('../Controller/studentExamController')
const { createCourse, courseDelete, courseList, getOneCourse, updateCourse } = require('../Controller/courseController')


const router = express.Router()

// User management routes
router.route('/').post(createUser)
// Student CRUD
router.route('/students').get(getAllStudents)
router.route('/students/:id').get(getStudentById)
router.route('/students/:id').put(updateStudent)
router.route('/students/:id').delete(deleteStudent)
router.route('/adminlogin').post(adminLogin)
router.route('/employeelogin').post(employeeLogin)
router.route('/login').post(authLogin)
router.route('/list').get(employeeList)
router.route('/profile/:id').get(employeeProfile)
router.route('/employeeDelete/:id').delete(employeeDelete)
router.route('/employeeUpdate/:id').put(employeeUpdate)

// Attendance routes
router.route('/attend/:empID').post(createAttend)
router.route('/attendlist').get(getAttend)
router.route('/getAttendById/:id').get(getAttendId)
router.route('/getAttendByUserId/:userId').get(getAttendByUserId)
router.route('/attendanceReport').get(getAttendanceReport)

// Student attendance routes
router.route('/student/attend/:userId').post(createStudentAttend)
router.route('/student/attendlist').get(getStudentAttend)
router.route('/student/getAttendById/:id').get(getStudentAttendId)
router.route('/student/getAttendByUserId/:userId').get(getStudentAttendByUserId)
router.route('/student/attendanceReport').get(getStudentAttendanceReport)

// Exam Admin
router.route('/createExam').post(createExamByCourse)
router.route('/getExams').get(getExams)
router.route('/getExamsByCourse').get(getExamByCourse)

router.route('/Evaluate').post(evaluateStudentExam)
router.route('/getAnswers').get(getAnswersByStudents)

// Exam Student
router.route('/getExam').get(getExamsByCourse)
router.route('/submitExam').post(submitStudentExam)





// Course
router.route('/createCourses').post(createCourse)
router.route('/deleteCourse').delete(courseDelete)
router.route('/courses').get(courseList)
router.route('/oneCourse').get(getOneCourse)
router.route('/updateCourse').put(updateCourse)





module.exports = router;