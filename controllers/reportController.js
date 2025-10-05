import REPORT from "../Models/reportModel.js";

export const addPostReportController = async (req, res) => {
  const { message, postId } = req.body;
  const userId = req.userId;

  try {
    const reportedCount=await REPORT.countDocuments({reportedPost:postId})
    const report = await REPORT.create({
      type: "post",
      reportedPost: postId,
      reason: message,
      reportedBy: userId,
      reportedCount:reportedCount+1
    });

    res
      .status(201)
      .json({ success: true, message: "successfully reported post", report });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "error to add post report : ",
      err: error,
    });
  }
};

export const addUserReportController = async (req, res) => {
  const { message, reportedUser } = req.body;
  const userId = req.userId;

  try {
    const reportedCount=await REPORT.countDocuments({reportedUser})
    const postCount=await REPORT.countDocuments({reportedBy:reportedUser})
    console.log(reportedCount)
    const report = await REPORT.create({
      type: "user",
      reportedUser,
      reason: message,
      reportedBy: userId,
      reportedCount:reportedCount+1,
      postCount:postCount+1
    });

    res
      .status(201)
      .json({ success: true, message: "successfully reported user", report });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: "error to add post report : ",
      err: error,
    });
  }
};

export const getAllReportsController = async (req, res) => {
  try {
    const reports = await REPORT.find()
      .populate(["reportedUser", "reportedBy", "reportedPost"])
      .sort({ createdAt: -1 });
    res
      .status(201)
      .json({
        success: true,
        message: "successfully geting all reports",
        reports,
      });
  } catch (error) {
    res
      .status(501)
      .json({
        success: false,
        message: "error to get all reports ",
        err: error,
      });
  }
};

export const dismissController = async (req, res) => {
  const { id } = req.params;

  try {
    const report = await REPORT.findByIdAndUpdate(
      { _id: id },
      { status: "dismiss" },
      { new: true }
    );
    res
      .status(201)
      .json({
        success: true,
        message: "successfully updated status to dismiss",
        report,
      });
  } catch (error) {
    res
      .status(501)
      .json({
        success: false,
        message: "error to dismiss a report ",
        err: error.message,
      });
  }
};

export const updateReportController = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const report = await REPORT.findByIdAndUpdate(
      { _id: id },
      { status },
      { new: true }
    );
    res
      .status(201)
      .json({
        success: true,
        message: "successfully updated reported status",
        report,
      });
  } catch (error) {
    res
      .status(501)
      .json({
        success: false,
        message: "error to update a report ",
        err: error.message,
      });
  }
};
