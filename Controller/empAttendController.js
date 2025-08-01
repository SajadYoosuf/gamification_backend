const moment = require("moment-timezone");
const { attendModel } = require("../Models/empAttendModel");

// Helper to convert "HH:mm" string to float hours
function convertToHours(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours + minutes / 60;
}
const createAttend = async (req, res) => {
  const { date, Checkin, Checkout, WorkingHours, Leavetype, From, To, Reason, Rating, Review } = req.body;
  const { empID } = req.params;

  try {
    const serverDate = moment().format("DD/MM/YYYY");
    const clientDate = date || serverDate;

    if (!empID || empID === "undefined") {
      return res.status(400).json({ message: "Invalid user ID in URL." });
    }




    if (clientDate !== serverDate) {
      return res.status(400).json({
        status: false,
        message: "You can only check in, check out, or apply leave for today.",
      });
    }

    const [day, month, year] = clientDate.split("/").map(Number);

    const checkinDate = Checkin
      ? new Date(year, month - 1, day, ...Checkin.split(":").map(Number))
      : null;

    const checkoutDate = Checkout
      ? new Date(year, month - 1, day, ...Checkout.split(":").map(Number))
      : null;

    let status = "Absent";
    if (checkinDate) {
      const tenAM = new Date(checkinDate);
      tenAM.setHours(10, 10, 0, 0);
      status = checkinDate < tenAM ? "Present" : "Late";
    }

    // === CASE 1: Checkin ===
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
        Checkin: checkinDate,
        WorkingHours: WorkingHours ?? null,
        Leavetype,
        From: From ? moment(From, "DD/MM/YYYY").toDate() : null,
        To: To ? moment(To, "DD/MM/YYYY").toDate() : null,
        Reason,
        Rating,
        Review,
      });

      return res.json({ message: "Check-in created", data: newRecord });
    }




    // === CASE 2: Checkout ===
    if (checkoutDate) {
      const openCard = await attendModel.findOne({
        userId: empID,
        date: clientDate,
      }).sort({ createdAt: -1 });

      if (!openCard || openCard.Checkout) {
        return res.status(400).json({
          status: false,
          message: "You have already checked out today or no valid check-in found.",
        });
      }

      openCard.Checkout = checkoutDate;

      if (WorkingHours) openCard.WorkingHours = WorkingHours;
      if (Leavetype) openCard.Leavetype = Leavetype;
      if (From) openCard.From = moment(From, "DD/MM/YYYY").toDate();
      if (To) openCard.To = moment(To, "DD/MM/YYYY").toDate();
      if (Reason) openCard.Reason = Reason;
      if (Rating) openCard.Rating = Rating;
      if (Review) openCard.Review = Review;

      await openCard.save();

      return res.json({ message: "Checkout updated", data: openCard });
    }



    // === CASE 3: Leave Only ===
    if (!checkinDate && !checkoutDate && Leavetype && From && To) {
      const newLeave = await attendModel.create({
        userId: empID,
        date: clientDate,
        status: "Leave",
        Leavetype,
        From: moment(From, "DD/MM/YYYY").toDate(),
        To: moment(To, "DD/MM/YYYY").toDate(),
        Reason,
      });

      return res.json({ message: "Leave recorded", data: newLeave });
    }


    // === CASE 4: Add Rating & Review only ===
    if (!checkinDate && !checkoutDate && (Rating || Review)) {
      const existing = await attendModel.findOne({
        userId: empID,
        date: clientDate
      }).sort({ createdAt: -1 });

      if (!existing) {
        return res.status(404).json({ message: "No attendance record found for review." });
      }

      if (Rating) existing.Rating = Rating;
      if (Review) existing.Review = Review;

      await existing.save();
      return res.json({ message: "Review submitted", data: existing });
    }



    return res.status(400).json({
      status: false,
      message: "Checkin or Checkout required.",
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