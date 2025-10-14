




const { adminLogin,createDefaultAdmin } = require('../Controller/adminloginController')
// const { createUser, getAllStudents, getStudentById, updateStudent, deleteStudent } = require('../Controller/authController')
const { createEmployee, employeeList, profile: employeeProfile, employeeDelete, updateprofile: employeeUpdate } = require('../Controller/employeeController')

const express = require ('express')
const employeeLogin = require('../Controller/employeeloginController')
 const authLogin = require('../Controller/authLoginController')
const { createAttend, getAttend, getAttendId, getAttendByUserId, getAttendanceReport } = require('../Controller/empAttendController')
const { createAttend: createStudentAttend, getAttend: getStudentAttend, getAttendId: getStudentAttendId, getAttendByUserId: getStudentAttendByUserId, getAttendanceReport: getStudentAttendanceReport } = require('../Controller/studentAttendController')
const { createExamByCourse, getExams, getExamByCourse, evaluateStudentExam, getAnswersByStudents } = require('../Controller/adminExamController')
const { getExamsByCourse, submitStudentExam } = require('../Controller/studentExamController')
const { createCourse, courseDelete, courseList, getOneCourse, updateCourse } = require('../Controller/courseController')
const { createUser, getAllStudents, getStudentById, updateStudent, deleteStudent } = require('../Controller/authController')


const router = express.Router()






// logins
router.route('/adminlogin').post(adminLogin)
router.route('/employeelogin').post(employeeLogin)
router.route('/login').post(authLogin)


router.route('/createAdmin').post(createDefaultAdmin);

// Employees
router.route('/addEmployee').post(createEmployee)
router.route('/employeeList').get(employeeList)
router.route('/employeeProfile/:id').get(employeeProfile)
router.route('/employeeDelete/:id').delete(employeeDelete)
router.route('/employeeUpdate/:id').put(employeeUpdate)

// Employee Attendance routes
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
router.route('/deleteCourse/:id').delete(courseDelete)
router.route('/courses').get(courseList)
router.route('/oneCourse/:id').get(getOneCourse)
router.route('/updateCourse/:id').put(updateCourse)



//Students
router.route('/').post(createUser)
router.route('/studentList').get(getAllStudents)
router.route('/oneStudent/:id').get(getStudentById)
router.route('/updateStudent/:id').put(updateStudent)
router.route('/deleteStudent/:id').delete(deleteStudent)






module.exports = router;