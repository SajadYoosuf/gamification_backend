const { StudentModel } = require("../Models/authModel");
const bcrypt = require("bcrypt");

const authLogin = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const user = await StudentModel.findOne({ Email });

    if (!user) {
      return res.status(401).json({ status: false, message: "Invalid email or" });
    }

    const isPasswordValid = await bcrypt.compare(Password, user.Password);

    if (!isPasswordValid) {
      return res.status(401).json({ status: false, message: "Invalid  or password" });
    }

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
