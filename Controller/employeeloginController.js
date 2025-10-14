const { argon2d } = require("argon2");
const { employeeModel } = require("../Models/empModel");
const bcrypt = require("bcrypt");
const argon2 = require("argon2");
const { employeeModel } = require("../Models/empModel");

const employeeLogin = async (req, res) => {
    const { Email, Password } = req.body;
    try {

        const user = await employeeModel.findOne({ Email });

        console.log("singup pass : ",user.Password);

        console.log(" user:", user); // Log the user object to see what is returned
        console.log(" pass:", Password); // Log the email to verify it's being received correctly
        
        if (!user) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or hhhhh"
            });
        }


        const isPasswordValid = await argon2.verify(user.Password,Password);
        const isPasswordValid = await bcrypt.compare(Password, employee.Password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or ppppp"
            });
        }

       
        res.status(200).json({
            status: true,
            message: "Login successful",
            data: {
                id: employee._id,
                FullName : employee.Fullname,
                Email: employee.Email,
                ContactNumber: employee.ContactNumber,
                Address: employee.Address
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

module.exports = employeeLogin;