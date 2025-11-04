const moment = require("moment-timezone");
const { attendModel } = require("../Models/empAttendModel");

// Helper to convert "HH:mm" string to float hours
function convertToHours(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours + minutes / 60;
}
const createAttend = async (req, res) => {
  const { date, Checkin, Checkout, WorkingHours, Reason, Fullname } = req.body;
  const { empID } = req.params;

  try {
    // Convert all times to IST (Asia/Kolkata)
    const serverDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
    const clientDate = date
      ? moment(date, ["YYYY-MM-DD", "DD/MM/YYYY"])
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD")
      : serverDate;

    if (!empID || empID === "undefined") {
      return res.status(400).json({ message: "Invalid user ID in URL." });
    }

    // Date validation (must be today's date)
    if (clientDate !== serverDate) {
      return res.status(400).json({
        status: false,
        message: "You can only check in, check out, or apply leave for today.",
      });
    }

    // ✅ Parse incoming Checkin/Checkout values safely
    const checkinDate = Checkin
      ? moment(Checkin).tz("Asia/Kolkata").toDate()
      : null;

    const checkoutDate = Checkout
      ? moment(Checkout).tz("Asia/Kolkata").toDate()
      : null;

    // Validate parsed dates
    if (checkinDate && isNaN(checkinDate.getTime())) {
      return res.status(400).json({ message: "Invalid Checkin time format." });
    }
    if (checkoutDate && isNaN(checkoutDate.getTime())) {
      return res.status(400).json({ message: "Invalid Checkout time format." });
    }

    // Determine employee status
    let status = "Absent";
    if (checkinDate) {
      const tenAM = moment().tz("Asia/Kolkata").set({
        hour: 10,
        minute: 10,
        second: 0,
        millisecond: 0,
      });
      status = moment(checkinDate).isBefore(tenAM) ? "Present" : "Late";
    }

    // === CASE 1: Check-in ===
    if (checkinDate) {
      const existing = await attendModel.findOne({
        userId: empID,
        date: clientDate,
      });

      if (existing && existing.Checkin) {
        return res.status(400).json({
          status: false,
          message: "You have already checked in today.",
        });
      }

      const newRecord = await attendModel.create({
        userId: empID,
        date: clientDate,
        status,
        Fullname,
        Checkin: checkinDate,
        WorkingHours: WorkingHours ?? null,
      });

      return res.json({ message: "Check-in created", data: newRecord });
    }

    // === CASE 2: Check-out ===
    if (checkoutDate) {
      const openCard = await attendModel
        .findOne({ userId: empID, date: clientDate })
        .sort({ createdAt: -1 });

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

    if (checkinDate) {
      return res.json({
        message: "You cannot take leave, you are already checked in.",
      });
    }

    // === CASE 3: Leave ===
    if (!checkinDate && !checkoutDate && Reason) {
      const newLeave = await attendModel.create({
        userId: empID,
        date: clientDate,
        Fullname,
        status: "Leave",
        Reason,
      });

      return res.json({ message: "Leave recorded", data: newLeave });
    }

    return res.status(400).json({
      status: false,
      message: "Invalid attendance request.",
    });
  } catch (error) {
    console.error("Attendance error:", error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};








const getAttend = async (req, res) => {
  try {
    const getattend = await attendModel.find().populate('userId', 'FirstName LastName Email ContactNumber');
    res.send(getattend);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAttendId = async (req, res) => {
  try {
    const _id = req.params.id;
    const attendId = await attendModel.findById(_id).populate('userId', 'FirstName LastName Email ContactNumber');
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
    const attendanceRecords = await attendModel.find({ userId }).populate('userId', 'FirstName LastName Email ContactNumber');
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

    const attendanceData = await attendModel.find(query)
      .populate('userId', 'FirstName LastName Email ContactNumber')
      .sort({ date: -1 });

    res.json(attendanceData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = { createAttend, getAttend, getAttendId, getAttendByUserId, getAttendanceReport };