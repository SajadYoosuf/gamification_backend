const adminModel = require("../Models/adminloginModel");
const bcrypt = require("bcrypt");

const adminLogin = async (req, res) => {
    const { UserName, Password } = req.body;

    try {
    
        const admin = await adminModel.findOne({ UserName: UserName });
        
        if (admin) {
            
            const isPasswordValid = await bcrypt.compare(Password, admin.Password);
            
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


const createDefaultAdmin = async () => {
    try {
        const existingAdmin = await adminModel.findOne({ UserName: "admin" });
        
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            
            await adminModel.create({
                UserName: "admin",
                Password: hashedPassword,
                ConfirmPassword: hashedPassword
            });
            
            console.log("Default admin created: username=admin, password=admin123");
        }
    } catch (error) {
        console.error("Error creating default admin:", error);
    }
};

module.exports = { adminLogin, createDefaultAdmin };