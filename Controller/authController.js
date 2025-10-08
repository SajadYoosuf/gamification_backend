const { StudentModel } = require("../Models/authModel.js");
const { courseModel } = require("../Models/course");
const bcrypt = require("bcrypt");
const { generatePassword } = require("../RandomPass.jsx");
const { transporter } = require("../Config/nodeMail.js");
require('dotenv').config();

const createUser = async (req, res) => {
    const { Fullname, Guardian, Address, ContactNumber, GuardianNumber, DOB, Aadhar, PAN, BloodGroup, JoiningDate, Email, Course, EmergencyContactName, EmergencyNumber, Relationship } = req.body;

    try {
        let allowedCourses = ['MERN Stack', 'Python', 'Flutter', 'Digital Marketing'];
        try {
            const dbCourses = await StudentModel.find().select('CourseName -_id').lean();
            const dbCourseNames = (dbCourses || []).map(c => c.CourseName).filter(Boolean);
            if (dbCourseNames.length > 0) allowedCourses = dbCourseNames;
        } catch (e) {
            console.warn('Could not read courses from DB, using fallback list', e.message);
        }

        if (!allowedCourses.includes(Course)) return res.status(400).json({ error: 'Invalid course selected' });
        if (!Email) return res.status(400).json({ error: 'Email is required' });

        const generatedPassword = generatePassword();
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(generatedPassword, saltRounds);

        const user = await StudentModel.create({
            Fullname,
            Guardian,
            Address,
            ContactNumber,
            GuardianNumber,
            DOB,
            Aadhar,
            PAN,
            BloodGroup,
            JoiningDate,
            Course,
            Email,
            Password: generatedPassword,
            EmergencyContactName,
            EmergencyNumber,
            Relationship,
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: Email,
            subject: 'Welcome 🎉 You’re an Early Explorer of Our Innovative Attendance System!',
            text: `Hello ${Fullname}

                We’re thrilled to welcome you as one of the very first users of our Attendance Management System. 🌟  

                Right now, you can log in and start using the system with your credentials below:  
                Email: ${Email}  
                Password: ${generatedPassword}  

                As an early explorer, you’re not just using a tool — you’re helping us shape the future. 🚀  
                We’re building exciting upcoming features like rewards, progress milestones, and gamified experiences that will make your journey even more engaging.  

                For now, enjoy the simplicity of managing your attendance with ease — and know that you’re among the pioneers helping us grow.  

                Best regards,  
                The Admin Team`,

            html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2 style="color: #4CAF50;">🎉 Welcome, ${Fullname} !</h2>
            <p>You are one of the <strong>early explorers</strong> of our brand-new <em>Attendance Management System</em>.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee;">
                <h3>🔑 Your Login Credentials</h3>
                <p><strong>Email:</strong> ${Email}</p>
                <p><strong>Password:</strong> ${generatedPassword}</p>
            </div>
            
            <p>Right now, you can enjoy a smooth and simple way to manage your attendance. ✅</p>
            
            <h3>✨ Coming Soon</h3>
            <p>We’re working on exciting features like:</p>
            <ul>
                <li>🏆 Rewards for consistency</li>
                <li>📈 Progress milestones</li>
                <li>🎮 Gamified experiences to make attendance fun</li>
            </ul>
            
            <p>As one of our first users, you’re not just using the system — you’re shaping its future. 🚀</p>
            
            <p>Thank you for being with us at the very start of this journey.</p>
            
            <p>Best regards,<br>
            <strong>The Admin Team</strong></p>
        </div>
    `
        };


        transporter.verify((error, success) => {
            if (error) console.log("SMTP connection error:", error);
            else console.log("Server is ready to send emails");
        });

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
            return res.status(201).json({ status: true, message: 'User created successfully and credentials sent to email', data: { id: user._id, Fullname: user.Fullname, Email: user.Email } });
        } catch (emailError) {
            console.error('Error sending email:', emailError.message);
            return res.status(201).json({
                status: true,
                message: 'User created successfully but email could not be sent',
                data: { id: user._id, Fullname: user.Fullname, Email: user.Email },
                emailError: emailError.message
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Something went wrong', error: error.message });
    }
};





const getAllStudents = async (req, res) => {
    try {
        const students = await StudentModel.find().select('-Password').lean();
        return res.status(200).json({ status: true, data: students });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Could not fetch students', error: err.message });
    }
};






const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await StudentModel.findById(id).select('-Password');
        if (!student) return res.status(404).json({ status: false, message: 'Student not found' });
        return res.status(200).json({ status: true, data: student });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Could not fetch the student', error: err.message });
    }
};






const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };
        // Prevent direct password overwrite here; use a separate change-password flow
        delete updates.Password;

        const updated = await StudentModel.findByIdAndUpdate(id, updates, { new: true }).select('-Password , -Email');
        if (!updated) return res.status(404).json({ status: false, message: 'Student not found' });
        return res.status(200).json({ status: true, message: 'Student updated', data: updated });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Could not update student', error: err.message });
    }
};






const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await StudentModel.findByIdAndDelete(id).select('-Password');
        if (!deleted) return res.status(404).json({ status: false, message: 'Student not found' });
        return res.status(200).json({
            status: true,
            message: 'Student deleted',
            data: deleted
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Could not delete student', error: err.message });
    }
};





module.exports = { createUser, getAllStudents, getStudentById, updateStudent, deleteStudent };
