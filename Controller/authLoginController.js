const { StudentModel } = require("../Models/authModel");
const argon2 = require("argon2");

const authLogin = async (req, res) => {
  const { Email, Password } = req.body;
console.log(Email,Password) 
  try {
    const user = await StudentModel.findOne({ Email });
    console.log(user)
 
    if ( !user ) {
      console.log("User not found with email:", Email);
      return res.status(401).json({ status: false, message: "User not found with email" });
    }
const isPasswordValid = await argon2.verify(Password, user.Password);
   

    if (!isPasswordValid) {
      console.log("Invalid password attempt for user:", Email);
      return res.status(401).json({ status: false, message: "Invalid password attempt for user" });
    }
       console.log("Login successful for user:", Email);
    return res.status(200).json({
      status: true,
      message: "Login successful",
      data: {
        id: user._id,
        Fullname: user.Fullname,
        Email: user.Email,
        ContactNumber: user.ContactNumber,
        Course: user.Course,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Something went wrong", error: error.message });
  }
};

module.exports = authLogin;
