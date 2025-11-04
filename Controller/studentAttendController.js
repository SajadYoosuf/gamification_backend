const moment = require("moment-timezone");
const { studentAttendModel } = require("../Models/athAttendModel");

const createAttend = async (req, res) => {
  try {
    let {
      date,
      Checkin,
      Fullname,
      Checkout,
      Breakin,
      Breakout,
      WorkingHours,
      Reason,
      review,
      rating,
    } = req.body;

    const { userId } = req.params;

    // === Always use IST timezone ===
    const serverDate = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
    const clientDate = date
      ? moment(date).tz("Asia/Kolkata").format("YYYY-MM-DD")
      : serverDate;

    if (!userId || userId === "undefined") {
      return res.status(400).json({ message: "Invalid user ID in URL." });
    }

    // === Restrict to today's date only ===
    if (clientDate !== serverDate) {
      return res.status(400).json({
        status: false,
        message: "You can only check in, check out, or apply leave for today.",
      });
    }

    // === Normalize empty strings ===
    Checkin = Checkin || undefined;
    Checkout = Checkout || undefined;
    Breakin = Breakin || undefined;
    Breakout = Breakout || undefined;
    Reason = Reason || undefined;
    review = review || undefined;
    rating = rating || undefined;

    // === CASE 1: Check-in ===
    if (Checkin) {
      const checkinDate = moment().tz("Asia/Kolkata").toDate(); // store IST

      let status = "Present";
      const tenAM = moment().tz("Asia/Kolkata").set({ hour: 10, minute: 10, second: 0, millisecond: 0 });
      status = moment(checkinDate).isBefore(tenAM) ? "Present" : "Late";

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
        Fullname,
        review,
        rating,
      });

      return res.json({ message: "Check-in created", data: newRecord });
    }

    // === CASE 2: Checkout ===
    if (Checkout) {
      const checkoutDate = moment().tz("Asia/Kolkata").toDate(); // store IST

      const openCard = await studentAttendModel
        .findOne({ userId, date: clientDate })
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
      if (review) openCard.review = review;
      if (rating) openCard.rating = rating;

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

    return res.status(400).json({ status: false, message: "Invalid attendance operation." });
  } catch (error) {
    console.error("Attendance error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong", error: error.message });
  }
};










const getAttend = async (req, res) => {
  try {
    const getattend = await studentAttendModel.find()
      // .populate('userId', 'Fullname Email ContactNumber') 
    res.send(getattend);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAttendId = async (req, res) => {
  try {
    const _id = req.params.id;
    const attendId = await studentAttendModel.findById(_id)
      // .populate('userId', 'Fullname Email ContactNumber') 

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

// Function to add/update review and rating for attendance record
const updateReviewRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { review, rating } = req.body;

    const attendanceRecord = await studentAttendModel.findById(id);
    if (!attendanceRecord) {
      return res.status(404).json({ status: false, message: 'Attendance record not found' });
    }

    // Update only the fields that are provided
    if (review !== undefined) attendanceRecord.review = review;
    if (rating !== undefined) attendanceRecord.rating = rating;

    await attendanceRecord.save();

    const updatedRecord = await studentAttendModel.findById(id).populate('userId', 'Fullname Email ContactNumber');
    res.json({ 
      status: true, 
      message: 'Review and rating updated successfully', 
      data: updatedRecord 
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
};

// Function to get attendance records with reviews and ratings
const getAttendanceWithReviews = async (req, res) => {
  try {
    const { userId } = req.query;
    let query = {};

    // Filter by userId if provided
    if (userId) {
      query.userId = userId;
    }

    // Only get records that have review or rating
    query.$or = [
      { review: { $exists: true, $ne: null, $ne: "" } },
      { rating: { $exists: true, $ne: null } }
    ];

    const attendanceWithReviews = await studentAttendModel.find(query)
      .populate('userId', 'Fullname Email ContactNumber')
      .sort({ date: -1 });

    res.json({
      status: true,
      count: attendanceWithReviews.length,
      data: attendanceWithReviews
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
};


module.exports = { 
  createAttend, 
  getAttend, 
  getAttendId, 
  getAttendByUserId, 
  getAttendanceReport, 
  updateReviewRating, 
  getAttendanceWithReviews 
};
