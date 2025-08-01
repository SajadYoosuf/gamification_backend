



const { userModel, adminModel, userlModel } = require("../Models/authModel.js");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { generatePassword } = require("../RandomPass.jsx");
const { transporter } = require("../Config/nodeMail.js");
require('dotenv').config();






const createUser = async (req, res) => {
    const { FirstName, LastName, Age, ContactNumber, Email, Course, Address } = req.body;

    try {
        // Generate random password
        const Password = generatePassword();

        // Hash the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(Password, saltRounds);

        // Create user in database
        const employeeDetails = await userModel.create({
            FirstName,
            LastName,
            Age,
            ContactNumber,
            Email,
            Course,
            Address,
            Password: hashedPassword
        });

        // Send email with password
        const mailOptions = {
            // from: process.env.EMAIL_USER,
            from: process.env.EMAIL_USER,
            to: Email,
            subject: 'Your Account Credentials - Attendance Management System',
            text: `Hello ${FirstName} ${LastName},Your account has been created successfully in the Attendance Management System.
                   Your login credentials are:
                   Email: ${Email}
                   Password: ${Password}
                   Please keep this information secure and change your password after first login.
                   Best regards,Admin Team`,

            html: `<h2>Welcome to Attendance Management System</h2>
                    <p>Hello <strong>${FirstName} ${LastName}</strong>,</p>
                    <p>Your account has been created successfully.</p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3>Your Login Credentials:</h3>
                        <p><strong>Email:</strong> ${Email}</p>
                        <p><strong>Password:</strong> ${Password}</p>
                    </div>
                    <p>Please keep this information secure and change your password after first login.</p>
                    <p>Best regards,<br>Admin Team</p>
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
            console.log('Email sent:', info.response);

            res.status(201).json({
                status: true,
                message: "User created successfully and credentials sent to email",
                data: {
                    id: employeeDetails._id,
                    FirstName: employeeDetails.FirstName,
                    LastName: employeeDetails.LastName,
                    Email: employeeDetails.Email
                }
            });
        } catch (emailError) {
            console.error('Error sending email:', emailError.message);
            res.status(201).json({
                status: true,
                message: "User created successfully but email could not be sent",
                data: {
                    id: employeeDetails._id,
                    FirstName: employeeDetails.FirstName,
                    LastName: employeeDetails.LastName,
                    Email: employeeDetails.Email
                },
                emailError: emailError.message
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};





const employeeDelete = async (req, res) => {
    try {
        const _id = req.params.id;
        const employeedelete = await userModel.findByIdAndDelete(_id)
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
        const employeeget = await userModel.find();
        res.json(employeeget);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })

    }
}




const profile = async (req, res) => {
    try {
        const _id = req.params.id;
        const emprofile = await userModel.findOne({ _id });
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
    console.log("🔥 Received body:", req.body);
    console.log("🆔 ID param:", req.params.id);

    const { FirstName, LastName, Age, ContactNumber, Email, Designation, Address } = req.body;
    const _id = req.params.id;

    if (!_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const empupdate = await userModel.findByIdAndUpdate(
      _id,
      { FirstName, LastName, Age, ContactNumber, Email, Designation, Address },
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










module.exports = { createUser, employeeList, profile, employeeDelete, updateprofile };
