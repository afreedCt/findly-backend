import CLAIM from "../Models/claimModel.js";
import POST from "../Models/postModel.js";
import REPORT from "../Models/reportModel.js";

export const addPostController = async (req, res) => {
  const { title, description, location, type, date } = req.body;
  const userId = req.userId;
  const image = req.file.filename;
  try {
    const post = await POST.create({
      title,
      description,
      location,
      type,
      postedBy: userId,
      postImage: image,
      date,
    });

    res
      .status(201)
      .json({ success: true, message: "successfully created post", post });
  } catch (error) {
    console.log("first", error);
    res
      .status(401)
      .json({ success: false, message: "error to create post", err: error });
  }
};

export const getAllPostsController = async (req, res) => {
  try {
    const {search}=req.query
    // const posts = await POST.find();
    const posts = await POST.find({location:{$regex:search,$options:"i"}}).populate("postedBy");
    res.status(201).json({
      success: true,
      message: "successfully geting all messages",
      posts,
    });
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "error to get all posts", err: error });
  }
};

export const updatePostController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, type, date, postImage } = req.body;

    const image = req.file ? req.file.filename : postImage;
    const userId = req.userId;

    const updatedPost = await POST.findByIdAndUpdate(
      { _id: id },
      { title, description, location, type, date, postImage: image },
      { new: true }
    );
    res.status(201).json({
      success: true,
      message: "post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "error to update a post", err: error });
  }
};

export const deletePostController = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await POST.findByIdAndUpdate(
      { _id: id },
      { status: "removed" },
      { new: true }
    );
    // const deletedPost = await POST.findByIdAndDelete({ _id: id });
    // const deletedClaims=await CLAIM.deleteMany({postId:id})
    // const deletedReports=await REPORT.deleteMany({reportedPost:id})
    res.status(201).json({
      success: true,
      message: "post deleted successfully",
      post: deletedPost,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "error to delete a project",
      err: error.message,
    });
  }
};

export const guestPostsController = async (req, res) => {
  const { limit } = req.query;
  try {
    const posts = await POST.find().sort({ createdAt: -1 }).limit(limit);
    res.status(201).json({
      success: true,
      message: "successfully geting guest page posts",
      posts,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "error to get posts for guest page ",
      err: error,
    });
  }
};

export const restorePostController = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const post = await POST.findByIdAndUpdate(
      { _id: id },
      { status },
      { new: true }
    );
    res.status(201).json({
      success: true,
      message: "successfully updated post status",
      post,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "error to update post status for restore ",
      err: error.message,
    });
  }
};

export const matchedPostController = async (req, res) => {
  console.log("inside mathcedcontroller");
  const { id } = req.params;

  try {
    // console.log("postId",id)
    const lostPost = await POST.findOne({ _id: id });
    const { title, description, location, createdAt } = lostPost;

    // console.log("post******",title,description,location,createdAt)
    const dateObj = new Date(createdAt);
    console.log("dateobj : ", dateObj);
    const startDate = new Date(dateObj);
    const endDate = new Date(dateObj);
    startDate.setDate(dateObj.getDate() - 3);
    endDate.setDate(dateObj.getDate() + 3);
    // const matches = await POST.find(
    //   {
    //     type: "found",
    //     location: { $regex: location, $options: "i" },
    //     createdAt: { $gte: startDate, $lte: endDate },
    //     $text: { $search: `${title} ${description}` },
    //   },
    //   {
    //     score: { $meta: "textScore" }, // include text score in output
    //   }
    // ).sort({ score: { $meta: "textScore" } });

    const regexMatches = await POST.find({
      type: "found",
      $or: [
        { title: { $regex: lostPost.title, $options: "i" } },
        { description: { $regex: lostPost.title, $options: "i" } },
        { description: { $regex: lostPost.description, $options: "i" } },
        { location: { $regex: lostPost.location, $options: "i" } },
      ],
    });
    res
      .status(201)
      .json({ success: true, message: "geting matched posts", matches:regexMatches });
    // return matches;
  } catch (error) {
    console.log("error to get matched posts : ", error.message);
    res.status(501).json({
      success: false,
      message: "error to get matched posts : ",
      err: error.message,
    });
  }
};
