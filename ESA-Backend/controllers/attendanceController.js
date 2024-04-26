const markAttendancesud = require('../markAttendancesud');

const markAttendancesid = async (req, res) => {
    console.log("markAttendance.jsss");;
    //console.log(dateObject)

    try {
        await markAttendancesud(Object.keys(files));
    } catch (error) {
        return res.status(500).json({ status: "error", message: error });
    } return res.status(500).json({ 'message': error.message });
};

module.exports = { markAttendancesid };