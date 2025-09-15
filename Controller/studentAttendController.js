const moment = require("moment-timezone");
const { studentAttendModel } = require("../Models/athAttendModel");

// Helper to convert "HH:mm" string to float hours
function convertToHours(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours + minutes / 60;
}


const createAttend = async (req, res) => {
  try {
    let { date, Checkin, Checkout, Breakin, Breakout, WorkingHours, Reason } = req.body;
    const { userId } = req.params;

    const serverDate = moment().format("DD/MM/YYYY");
    const clientDate = date || serverDate;

    if (!userId || userId === "undefined") {
      return res.status(400).json({ message: "Invalid user ID in URL." });
    }

    if (clientDate !== serverDate) {
      return res.status(400).json({
        status: false,
        message: "You can only check in, check out, or apply leave for today.",
      });
    }

    // 🔑 Normalize empty strings → undefined
    Checkin = Checkin || undefined;
    Checkout = Checkout || undefined;
    Breakin = Breakin || undefined;
    Breakout = Breakout || undefined;
    Reason = Reason || undefined;

    // === CASE 1: Checkin ===
    if (Checkin) {
      const checkinDate = new Date();

      let status = "Present";
      const tenAM = new Date(checkinDate);
      tenAM.setHours(10, 10, 0, 0);
      status = checkinDate < tenAM ? "Present" : "Late";

      const existing = await studentAttendModel.findOne({ userId, date: clientDate });
      if (existing && existing.Checkin) {
        return res.status(400).json({ status: false, message: "You have already checked in today." });
      }

      const newRecord = await studentAttendModel.create({
        userId,
        date: clientDate,
        status,
        Checkin: checkinDate,
        Breakin,
        Breakout,
        WorkingHours: WorkingHours ?? null,
        Reason,
      });

      return res.json({ message: "Check-in created", data: newRecord });
    }

    // === CASE 2: Checkout ===
    if (Checkout) {
      const checkoutDate = new Date();

      const openCard = await studentAttendModel.findOne({ userId, date: clientDate }).sort({ createdAt: -1 });
      if (!openCard || openCard.Checkout) {
        return res.status(400).json({
          status: false,
          message: "You have already checked out today or no valid check-in found.",
        });
      }

      openCard.Checkout = checkoutDate;
      if (WorkingHours) openCard.WorkingHours = WorkingHours;
      if (Reason) openCard.Reason = Reason;

      await openCard.save();
      return res.json({ message: "Checkout updated", data: openCard });
    }

    // === CASE 3: Leave Only ===
    if (Reason && !Checkin && !Checkout) {
      const newLeave = await studentAttendModel.create({
        userId,
        date: clientDate,
        status: "Leave",
        Reason,
      });

      return res.json({ message: "Leave recorded", data: newLeave });
    }

    return res.status(400).json({ status: false, message: "fdsfdf." });

  } catch (error) {
    console.error("Attendance error:", error);
    return res.status(500).json({ status: false, message: "Something went wrong", error: error.message });
  }
};










const getAttend = async (req, res) => {
  try {
    const getattend = await studentAttendModel.find().populate('userId', 'Fullname Email ContactNumber');
    res.send(getattend);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAttendId = async (req, res) => {
  try {
    const _id = req.params.id;
    const attendId = await studentAttendModel.findById(_id).populate('userId', 'Fullname Email ContactNumber');
    if (attendId) {
      res.json(attendId);
    } else {
      res.status(404).json('Not Found');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// New function to get attendance by user ID
const getAttendByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const attendanceRecords = await studentAttendModel.find({ userId }).populate('userId', 'Fullname Email ContactNumber');
    if (attendanceRecords.length > 0) {
      res.json(attendanceRecords);
    } else {
      res.status(404).json({ message: 'No attendance records found for this user' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// New function to get comprehensive attendance report
const getAttendanceReport = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    let query = {};

    if (userId) {
      query.userId = userId;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const attendanceData = await studentAttendModel.find(query)
      .populate('userId', 'Fullname Email ContactNumber')
      .sort({ date: -1 });

    res.json(attendanceData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = { createAttend, getAttend, getAttendId, getAttendByUserId, getAttendanceReport };
