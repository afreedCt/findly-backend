import MESSAGE from "../Models/messageModel.js";

export const addMessageController = async (req, res) => {
  console.log(req.body);
  const { title, text, receiverId, type, postId, email, username, profilePic } =
    req.body;
  const senderId = req.userId;

  try {
    const msg = await MESSAGE.create({
      senderId,
      receiverId,
      title,
      text,
      type,
      postId,
      email,
      username,
      profilePic,
    });
    res
      .status(201)
      .json({ success: true, message: "successfully created message", msg });
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "error to add message", err: error });
  }
};

export const getUserMessageController = async (req, res) => {
  const userId = req.userId;

  try {
    const userMessages = await MESSAGE.find({ receiverId: userId }).sort({
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      message: "successfully geting all messages",
      messages: userMessages,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "error to get user message",
      err: error,
    });
  }
};

export const updateMessageToSeenController = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedMessage = await MESSAGE.findByIdAndUpdate(
      { _id: id },
      { status },
      { new: true }
    );
    res.status(201).json({
      success: true,
      message: "successfully updated message status",
      updatedMessage,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "error to update message status",
      err: error,
    });
  }
};

export const addDonationMessageController = async (req, res) => {
  const { title, text, type } = req.body;
  const receiverId = req.userId;

  // console.log("message : ", req.body);

  try {
    const msg = await MESSAGE.create({ title, text, type, receiverId });
    // console.log(msg);
    res
      .status(201)
      .json({ success: true, message: "successfully created message", msg });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      success: false,
      message: "error to add donation message",
      err: error,
    });
  }
};

export const addDismissMessageController=async(req,res)=>{
    const {receiverId,title,text,type}=req.body
    const userId=req.userId
    // const postId=req.body.postId?req.body.postId:''
    try {
        const msg=await MESSAGE.create({
            receiverId,
            title,
            text,
            type,
            senderId:userId,
            // postId
        })
        res.status(201).json({success:true,message:"dismiss messsage created",msg})
    } catch (error) {
        res
      .status(401)
      .json({ success: false, message: "error to add dismiss message", err: error.message });
    }
}

export const messageCountController=async(req,res)=>{
  const userId=req.userId
  try {
    const messageCount=await MESSAGE.countDocuments({receiverId:userId , status:"unread"})
    res.status(201).json({success:true,message:"successfully geting message count",messageCount})
  } catch (error) {
    res.status(501).json({success:false,message:"error to get message count",err:error.message})
  }
}