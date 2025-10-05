import mongoose from "mongoose";

const connectDB=()=>{
    const connectionString=process.env.MONGODM_URL

    mongoose.connect(connectionString).then((res)=>{
        console.log("connected to DB ")
    }).catch((err)=>{
        console.log("error to connect db : ",err)
    })
}

export default connectDB