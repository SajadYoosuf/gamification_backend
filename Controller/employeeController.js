const { employeeModel } = require("../Models/empModel");
const bcrypt = require("bcrypt");
const { generatePassword } = require("../RandomPass.jsx");
const { transporter } = require("../Config/nodeMail.js");
require('dotenv').config();


const createEmployee = async (req, res) => {
    console.log("👉 req.body:", req.body);   // log the incoming data
    const { Fullname, Address, ContactNumber, AadharNumber, PAN, JoiningDate, Blood, Designation, CourseAssained, EmergencyContactName, EmergencyNumber, Relationship, Email } = req.body;

    try {
        if (!Fullname || !ContactNumber || !AadharNumber) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // generate a password for employees as well
        const generatedPassword = generatePassword();
        const saltRounds = 10;
        
        // const hashedPassword = await bcrypt.hash(generatedPassword, saltRounds);

        const newEmployee = await employeeModel.create({
            Fullname,
            Address,
            ContactNumber,
            AadharNumber,
            PAN,
            JoiningDate,
            Blood,
            Designation,
            CourseAssained,
            Email,
            Password: generatedPassword,
            EmergencyContactName,
            EmergencyNumber,
            Relationship,
            // Note: employeeModel doesn't have Email/Password fields currently; store only if schema updated
        });
   

        // attempt to email credentials if transporter and Email provided
        if (Email && transporter) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: Email,
                subject: 'Welcome to the Team 👋 Your Attendance Account is Ready',
                text: `Hello ${Fullname},

We’re excited to welcome you as a valued member of our organization. 🌟  

Your attendance account has been created successfully, and you can now log in with the details below:  
Email: ${Email}  
Password: ${generatedPassword}  

This system has been designed to make managing attendance simple and transparent.  
As one of the early employees using it, your experience and feedback will help us improve and shape upcoming features.  

We’re working on adding new innovations like rewards, progress milestones, and gamified experiences to make attendance more engaging in the future. 🚀  

For now, please log in, explore the system, and manage your attendance with ease.  

Best regards,  
The Admin Team`,

                html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2 style="color: #4CAF50;">👋 Welcome, ${Fullname}!</h2>
            <p>We’re glad to have you onboard as part of our team.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee;">
                <h3>🔑 Your Login Credentials</h3>
                <p><strong>Email:</strong> ${Email}</p>
                <p><strong>Password:</strong> ${generatedPassword}</p>
            </div>
            
            <p>This system has been created to make attendance tracking <strong>easy, transparent, and reliable</strong>. ✅</p>
            
            <h3>✨ Looking Ahead</h3>
            <p>We’ll soon be adding exciting features like:</p>
            <ul>
                <li>🏆 Recognition & rewards for consistency</li>
                <li>📈 Progress tracking and milestones</li>
                <li>🎮 Gamified experiences to make attendance engaging</li>
            </ul>
            
            <p>As one of the first employees using this platform, your feedback will be invaluable in shaping its future. 🚀</p>
            
            <p>Thank you for being part of our journey.</p>
            
            <p>Best regards,<br>
            <strong>The Admin Team</strong></p>
        </div>
    `
            };

            transporter.verify(function (error, success) {
                if (error) {
                    console.log("SMTP connection error:", error);
                } else {
                    console.log("Server is ready to send emails");
                }
            });

            try {
                const info = await transporter.sendMail(mailOptions);
                console.log('Employee email sent:', info.response);
            } catch (e) {
                console.warn('Failed to send employee email:', e.message);
            }
        }

        res.status(201).json({ status: true, message: 'Employee created', data: newEmployee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Something went wrong', error: error.message });
    }
};


const employeeDelete = async (req, res) => {
    try {
        const _id = req.params.id;
        const employeedelete = await employeeModel.findByIdAndDelete(_id)
        if (employeedelete) {
            res.status(200).json('Successfully Deleted')
        } else {
            res.status(404).json('Could not find user')
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}







const employeeList = async (req, res) => {
    try {
        const employeeget = await employeeModel.find();
        res.json(employeeget);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })

    }
}







const profile = async (req, res) => {
    try {
        const _id = req.params.id;
        const emprofile = await employeeModel.findOne({ _id });
        if (emprofile) {
            res.json(emprofile);
        } else {
            res.status(404).json('Not Found.')
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}





const updateprofile = async (req, res) => {
    try {
console.log("👉 req.body:", req.body);   // log the incoming data
        console.log("👉 req.params:", req.params);


        const { Fullname, Address, ContactNumber, CourseAssained } = req.body || {};
        const _id = req.params.id;

        if (!_id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const empupdate = await employeeModel.findByIdAndUpdate(
            _id,
            { Fullname, Address, ContactNumber, CourseAssained },
            { new: true }
        );

        if (!empupdate) {
            return res.status(404).json({ error: "Employee not found" });
        }

        res.json(empupdate);
    } catch (error) {
        console.error("❌ Error in updateprofile:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};


module.exports = { createEmployee, employeeList, profile, employeeDelete, updateprofile };
