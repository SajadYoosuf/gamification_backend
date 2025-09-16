
const bcrypt = require("bcrypt");
const { employeeModel } = require("../Models/empModel");

const employeeLogin = async (req, res) => {
    const { Email, Password } = req.body;

    try {

        const employee = await employeeModel.findOne({ Email });

        if (!employee) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or password"
            });
        }


        const isPasswordValid = await bcrypt.compare(Password, employee.Password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or password"
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