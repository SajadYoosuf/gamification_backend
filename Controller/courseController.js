const { courseModel } = require("../Models/course");

const createCourse = async (req, res) => {
    const { CourseName, Discription, Duration, Fee, StartDate, EndDate, AssignedMentor } = req.body;
    try {
        const courseDetails = await courseModel.create({
            CourseName,
            Discription,
            Duration,
            Fee,
            StartDate,
            EndDate,
            AssignedMentor,
        })
        res.status(201).json({
            status: true,
            message: "Successfully created new Course",
            data: {
                courseDetails
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "Something Went Wrong!",
            error: error.message
        })
    }
}





const courseDelete = async (req, res) => {
    try {
        const _id = req.params.id;
        const coursedelete = await courseModel.findByIdAndDelete(_id)
        if (coursedelete) {
            res.status(200).json(" Successfully Deleted ")
        } else {
            res.status(404).json(" Could Not find course ! ")
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}





const courseList = async (req, res) => {
    try {
        const courselist = await courseModel.find();
        res.json(courselist);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}





const getOneCourse = async (req, res) => {
    try {
        const _id = req.params.id;
        // console.log("Route hit with id:", req.params.id);
        const onecourse = await courseModel.findOne({ _id });
        if (onecourse) {
            res.json(onecourse)
        } else {
            res.status(404).json('Not found!')
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}



const updateCourse = async (req, res) => {
    try {
        const _id = req.params.id;
        if (!_id) {
            return res.status(400).json({ error: "Id is required!" });
        }

        const { CourseName, Discription, Duration, Fee, StartDate, EndDate, AssignedMentor } = req.body;

        
        const updatecourse = await courseModel.findByIdAndUpdate(
            _id,
            { CourseName, Discription, Duration, Fee, StartDate, EndDate, AssignedMentor },
            { new: true }
        );
        if (!updatecourse) {
            return res.status(404).json('Cannot Find Such Course!')
        }
        res.status(200).json({
            status: true,
            message: "Successfully Updated Course",
            data: updatecourse,
        })
    } catch (error) {
        console.log("❌ Error in updateprofile:", error)
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}



module.exports = { createCourse, courseDelete, courseList, getOneCourse, updateCourse }