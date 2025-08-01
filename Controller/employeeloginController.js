const { userModel } = require("../Models/authModel");
const bcrypt = require("bcrypt");

const employeeLogin = async (req, res) => {
    const { Email, Password } = req.body;

    try {

        const user = await userModel.findOne({ Email });

        if (!user) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or password"
            });
        }


        const isPasswordValid = await bcrypt.compare(Password, user.Password);

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
                id: user._id,
                FirstName: user.FirstName,
                LastName: user.LastName,
                Email: user.Email,
                ContactNumber: user.ContactNumber,
                Address: user.Address
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