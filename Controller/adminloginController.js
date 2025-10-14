const adminModel = require("../Models/adminloginModel");
const bcrypt = require("bcrypt");

const adminLogin = async (req, res) => {
    const { Email, Password } = req.body || {};
    console.log("Login attempt:", Email, Password);

    if (!Email || !Password) {
        return res.status(400).json({
            status: false,
            message: "Email and Password are required"
        });
    }

    try {

        const admin = await adminModel.findOne({ Email: Email });
        console.log("Found admin:", admin);

        if (!admin.Email || !admin.Password) {
            console.log("Admin not found or missing password hash");
            // either admin not found or stored password hash missing
            return res.status(401).json({
                status: false,
                message: "Invalid username or password"
            });
        }

        const isPasswordValid = Password === admin.Password;
        console.log("Password valid:", isPasswordValid);

        if (isPasswordValid) {
            return res.status(200).json({
                status: true,
                message: "Admin login successful",
                data: {
                    id: admin._id,
                    UserName: admin.UserName
                }
            });
        }

        return res.status(401).json({
            status: false,
            message: "Invalid username or password"
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


const createDefaultAdmin = async (req,res) => {
    const body = req.body || {};
    const { Email, Password } = body;

    if (!Email || !Password) {
        return res.status(400).json({
            status: false,
            message: "Email and Password are required"
        });
    }

    try {
        const existingAdmin = await adminModel.findOne({ Email: Email });

        if (existingAdmin) {
            return res.status(409).json({
                status: false,
                message: "Admin with this email already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const admin = await adminModel.create({
            Email: Email,
            Password: hashedPassword,
        });

        console.log(`Default admin created: email ${Email}`);
        return res.status(201).json({
            status: true,
            message: "Default admin created",
            data: { id: admin._id, Email: admin.Email }
        });
    } catch (error) {
        console.error("Error creating default admin:", error);
        return res.status(500).json({
            status: false,
            message: "Error creating default admin",
            error: error.message
        });
    }
};

module.exports = { adminLogin, createDefaultAdmin };