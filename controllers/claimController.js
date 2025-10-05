import CLAIM from "../Models/claimModel.js";
import POST from "../Models/postModel.js";
export const addClaimController = async (req, res) => {
  const { message, postId } = req.body;
  const userId = req.userId;
  try {
    const claim = await CLAIM.create({ claimerId: userId, postId, message });
    res
      .status(201)
      .json({ success: true, message: "successfully requested claim", claim });
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "error to add claim", err: error });
  }
};

export const getAllClaimsController = async (req, res) => {
  try {
    const claims = await CLAIM.find().populate("postId claimerId").exec();
    // console.log(claims);
    res.status(201).json({
      success: true,
      message: "successfully geting all claims",
      claims,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "error to get all claims",
      err: error.message,
    });
  }
};

export const updateClaimController = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedClaim = await CLAIM.findByIdAndUpdate(
      { _id: id },
      { status },
      { new: true }
    ).populate({
      path: "postId",
      populate: {
        path: "postedBy",
        select: "username email profilePic",
      },
    });

    let updatedPost = {};
    if (status === "approved") {
      updatedPost = await POST.findByIdAndUpdate(
        { _id: updatedClaim.postId._id },
        { status: "claimed" },
        { new: true }
      );
    }

    res
      .status(201)
      .json({
        success: true,
        message: "successfully updated",
        updatedClaim,
        updatedPost,
      });
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "error to update a claim" ,err:error.message});
  }
};
